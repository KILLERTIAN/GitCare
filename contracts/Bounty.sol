// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// OpenZeppelin imports (Remix can resolve via GitHub in many setups)
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";

contract GitCareBounty is ReentrancyGuard, Ownable {
    struct Bounty {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 reward; // in wei (AVAX)
        bool isCompleted;
        address completedBy;
        uint256 createdAt;
        uint256 deadline; // unix timestamp; 0 = no deadline
        string[] tags;
    }

    struct UserStats {
        uint256 completedBounties;
        uint256 totalEarned;
        uint256 reputation;
    }

    uint256 public bountyCount;
    uint256 public totalBountiesCreated;
    uint256 public totalRewardsDistributed;

    mapping(uint256 => Bounty) public bounties;
    mapping(address => UserStats) public userStats;
    mapping(address => uint256[]) public userBounties;

    // Security & UX: proposed completer per bounty to avoid front-running
    mapping(uint256 => address) public proposedCompleter;

    // Cancel timelock: timestamp when cancel was requested
    mapping(uint256 => uint256) public cancelRequestedAt;
    uint256 public constant CANCEL_TIMELOCK = 24 hours;

    // Events
    event BountyCreated(uint256 indexed bountyId, address indexed creator, string title, uint256 reward, uint256 deadline);
    event BountyProposedCompletion(uint256 indexed bountyId, address indexed proposer);
    event BountyApprovedAndPaid(uint256 indexed bountyId, address indexed completer, uint256 reward);
    event CancelRequested(uint256 indexed bountyId, address indexed creator, uint256 whenExecutable);
    event BountyCancelled(uint256 indexed bountyId, address indexed creator, uint256 refundedAmount);
    event BountyReclaimedExpired(uint256 indexed bountyId, address indexed creator, uint256 refundedAmount);
    event DeadlineExtended(uint256 indexed bountyId, uint256 oldDeadline, uint256 newDeadline);

    modifier bountyExists(uint256 _bountyId) {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Bounty does not exist");
        _;
    }

    modifier notCompleted(uint256 _bountyId) {
        require(!bounties[_bountyId].isCompleted, "Bounty already completed");
        _;
    }

    constructor() {
        // Ownable sets owner to deployer
    }

    // ========== Create ==========
    /// @notice Create a bounty and lock funds (msg.value)
    /// @param _title short title
    /// @param _description longer description
    /// @param _tags tag array (useful for UI; consider indexing off-chain for scale)
    /// @param _deadline unix timestamp after which creator can reclaim if not completed (0 = none)
    function createBounty(
        string memory _title,
        string memory _description,
        string[] memory _tags,
        uint256 _deadline
    ) external payable {
        // require(msg.value > 0, "Reward must be > 0");
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        if (_deadline != 0) {
            require(_deadline > block.timestamp + 1 hours, "Deadline too soon");
        }

        bountyCount++;
        totalBountiesCreated++;

        bounties[bountyCount] = Bounty({
            id: bountyCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            reward: msg.value,
            isCompleted: false,
            completedBy: address(0),
            createdAt: block.timestamp,
            deadline: _deadline,
            tags: _tags
        });

        userBounties[msg.sender].push(bountyCount);

        emit BountyCreated(bountyCount, msg.sender, _title, msg.value, _deadline);
    }

    // ========== Propose completion (developer) ==========
    /// @notice Developer proposes they completed the bounty (records proposer)
    function proposeCompletion(uint256 _bountyId) external bountyExists(_bountyId) notCompleted(_bountyId) {
        Bounty storage b = bounties[_bountyId];
        require(b.creator != msg.sender, "Creator cannot propose");
        // If bounty has a deadline, ensure not expired
        if (b.deadline != 0) {
            require(block.timestamp <= b.deadline, "Bounty expired");
        }
        proposedCompleter[_bountyId] = msg.sender;
        emit BountyProposedCompletion(_bountyId, msg.sender);
    }

    // ========== Approve & pay (creator) ==========
    /// @notice Only the bounty creator approves the proposed completer. Uses CEI + nonReentrant.
    function approveCompletion(uint256 _bountyId) external bountyExists(_bountyId) notCompleted(_bountyId) nonReentrant {
        Bounty storage b = bounties[_bountyId];
        require(msg.sender == b.creator, "Only creator can approve");
        address completer = proposedCompleter[_bountyId];
        require(completer != address(0), "No proposed completer");

        // Effects (CEI)
        b.isCompleted = true;
        b.completedBy = completer;
        uint256 amount = b.reward;
        b.reward = 0; // zero out before interaction
        proposedCompleter[_bountyId] = address(0);

        // Interaction: pay via call (future-proof)
        (bool sent, ) = payable(completer).call{value: amount}("");
        require(sent, "Failed to send reward");

        // Update stats
        userStats[completer].completedBounties++;
        userStats[completer].totalEarned += amount;
        userStats[completer].reputation += calculateReputationPoints(amount);
        totalRewardsDistributed += amount;

        emit BountyApprovedAndPaid(_bountyId, completer, amount);
    }

    // ========== Cancel flow (timelocked) ==========
    /// @notice Creator requests cancel. After timelock elapses, they can cancel and reclaim funds.
    function requestCancelBounty(uint256 _bountyId) external bountyExists(_bountyId) notCompleted(_bountyId) {
        Bounty storage b = bounties[_bountyId];
        require(msg.sender == b.creator, "Only creator");
        require(cancelRequestedAt[_bountyId] == 0, "Already requested");
        cancelRequestedAt[_bountyId] = block.timestamp;
        emit CancelRequested(_bountyId, msg.sender, block.timestamp + CANCEL_TIMELOCK);
    }

    /// @notice After timelock, creator can cancel and get refund
    function cancelBountyAfterTimelock(uint256 _bountyId) external bountyExists(_bountyId) notCompleted(_bountyId) nonReentrant {
        Bounty storage b = bounties[_bountyId];
        require(msg.sender == b.creator, "Only creator");
        uint256 req = cancelRequestedAt[_bountyId];
        require(req != 0 && block.timestamp >= req + CANCEL_TIMELOCK, "Timelock not passed");

        // Effects
        uint256 refund = b.reward;
        b.reward = 0;
        b.isCompleted = true; // mark as closed
        cancelRequestedAt[_bountyId] = 0;
        proposedCompleter[_bountyId] = address(0);

        // Interaction
        (bool sent, ) = payable(b.creator).call{value: refund}("");
        require(sent, "Refund failed");

        emit BountyCancelled(_bountyId, b.creator, refund);
    }

    // ========== Reclaim expired bounty (if deadline passed) ==========
    /// @notice Creator reclaims funds if deadline passed and not completed
    function reclaimExpiredBounty(uint256 _bountyId) external bountyExists(_bountyId) notCompleted(_bountyId) nonReentrant {
        Bounty storage b = bounties[_bountyId];
        require(msg.sender == b.creator, "Only creator");
        require(b.deadline != 0 && block.timestamp > b.deadline, "Deadline not passed");

        uint256 refund = b.reward;
        b.reward = 0;
        b.isCompleted = true;
        proposedCompleter[_bountyId] = address(0);
        cancelRequestedAt[_bountyId] = 0;

        (bool sent, ) = payable(b.creator).call{value: refund}("");
        require(sent, "Refund failed");

        emit BountyReclaimedExpired(_bountyId, b.creator, refund);
    }

    // ========== Admin: extend deadline (creator calls) ==========
    function extendDeadline(uint256 _bountyId, uint256 _newDeadline) external bountyExists(_bountyId) notCompleted(_bountyId) {
        Bounty storage b = bounties[_bountyId];
        require(msg.sender == b.creator, "Only creator");
        require(_newDeadline > b.deadline, "New must be > old");
        uint256 old = b.deadline;
        b.deadline = _newDeadline;
        emit DeadlineExtended(_bountyId, old, _newDeadline);
    }

    // ========== View helpers ==========
    function getBounty(uint256 _bountyId) public view bountyExists(_bountyId) returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        uint256 reward,
        bool isCompleted,
        address completedBy,
        uint256 createdAt,
        uint256 deadline,
        string[] memory tags
    ) {
        Bounty memory bounty = bounties[_bountyId];
        return (
            bounty.id,
            bounty.creator,
            bounty.title,
            bounty.description,
            bounty.reward,
            bounty.isCompleted,
            bounty.completedBy,
            bounty.createdAt,
            bounty.deadline,
            bounty.tags
        );
    }

    function getUserBounties(address _user) public view returns (uint256[] memory) {
        return userBounties[_user];
    }

    function getUserStats(address _user) public view returns (uint256 completedBounties, uint256 totalEarned, uint256 reputation) {
        UserStats memory stats = userStats[_user];
        return (stats.completedBounties, stats.totalEarned, stats.reputation);
    }

    // ========== Reputation ==========
    function calculateReputationPoints(uint256 _reward) private pure returns (uint256) {
        // reward in wei; thresholds are example values
        if (_reward < 0.1 ether) return 1;
        if (_reward < 0.5 ether) return 5;
        if (_reward < 1 ether) return 10;
        return 20;
    }

    // Fallback to receive funds
    receive() external payable {}
}
