export const GITCARE_BOUNTY_ADDRESS = "0x2e48D65E17446c1176610BE419a02970B5D6E7F7";

export const GITCARE_BOUNTY_ABI = [
  {
    "inputs": [],
    "name": "bountyCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalBountiesCreated",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRewardsDistributed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "getBounty",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "reward", "type": "uint256"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"},
      {"internalType": "address", "name": "completedBy", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "string[]", "name": "tags", "type": "string[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserBounties",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserStats",
    "outputs": [
      {"internalType": "uint256", "name": "completedBounties", "type": "uint256"},
      {"internalType": "uint256", "name": "totalEarned", "type": "uint256"},
      {"internalType": "uint256", "name": "reputation", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string[]", "name": "_tags", "type": "string[]"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "createBounty",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "proposeCompletion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "approveCompletion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "requestCancelBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "cancelBountyAfterTimelock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_bountyId", "type": "uint256"}],
    "name": "reclaimExpiredBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_bountyId", "type": "uint256"},
      {"internalType": "uint256", "name": "_newDeadline", "type": "uint256"}
    ],
    "name": "extendDeadline",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "proposedCompleter",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "cancelRequestedAt",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "BountyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "proposer", "type": "address"}
    ],
    "name": "BountyProposedCompletion",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "completer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256"}
    ],
    "name": "BountyApprovedAndPaid",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllBounties",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "reward", "type": "uint256"},
          {"internalType": "bool", "name": "isCompleted", "type": "bool"},
          {"internalType": "address", "name": "completedBy", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "string[]", "name": "tags", "type": "string[]"}
        ],
        "internalType": "struct GitCareBounty.Bounty[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export interface Bounty {
  id: string;
  creator: string;
  title: string;
  description: string;
  reward: string;
  isCompleted: boolean;
  completedBy: string;
  createdAt: string;
  deadline: string;
  tags: string[];
}

export interface UserStats {
  completedBounties: bigint;
  totalEarned: bigint;
  reputation: bigint;
}