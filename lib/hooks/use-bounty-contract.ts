import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { GITCARE_BOUNTY_ADDRESS, GITCARE_BOUNTY_ABI, type Bounty, type UserStats } from '@/lib/contracts/gitcare-bounty'

export function useBountyContract() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read functions
  const useBountyCount = () => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'bountyCount',
  })

  const useBounty = (bountyId: number) => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'getBounty',
    args: [BigInt(bountyId)],
    query: { enabled: bountyId > 0 }
  })

  const useUserBounties = (userAddress: string) => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'getUserBounties',
    args: [userAddress as `0x${string}`],
    query: { enabled: !!userAddress }
  })

  const useUserStats = (userAddress: string) => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'getUserStats',
    args: [userAddress as `0x${string}`],
    query: { enabled: !!userAddress }
  })

  // Write functions
  const createBounty = async (
    title: string,
    description: string,
    tags: string[],
    deadline: number,
    rewardAmount: string
  ) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'createBounty',
      args: [title, description, tags, BigInt(deadline)],
      value: parseEther(rewardAmount),
    })
  }

  const proposeCompletion = async (bountyId: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'proposeCompletion',
      args: [BigInt(bountyId)],
    })
  }

  const approveCompletion = async (bountyId: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'approveCompletion',
      args: [BigInt(bountyId)],
    })
  }

  const requestCancel = async (bountyId: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'requestCancelBounty',
      args: [BigInt(bountyId)],
    })
  }

  const cancelBountyAfterTimelock = async (bountyId: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'cancelBountyAfterTimelock',
      args: [BigInt(bountyId)],
    })
  }

  const reclaimExpiredBounty = async (bountyId: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'reclaimExpiredBounty',
      args: [BigInt(bountyId)],
    })
  }

  const extendDeadline = async (bountyId: number, newDeadline: number) => {
    return writeContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'extendDeadline',
      args: [BigInt(bountyId), BigInt(newDeadline)],
    })
  }

  // Additional read functions
  const useProposedCompleter = (bountyId: number) => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'proposedCompleter',
    args: [BigInt(bountyId)],
    query: { enabled: bountyId > 0 }
  })

  const useCancelRequestedAt = (bountyId: number) => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'cancelRequestedAt',
    args: [BigInt(bountyId)],
    query: { enabled: bountyId > 0 }
  })

  const useAllBounties = () => useReadContract({
    address: GITCARE_BOUNTY_ADDRESS,
    abi: GITCARE_BOUNTY_ABI,
    functionName: 'getAllBounties',
  })

  return {
    // Read hooks
    useBountyCount,
    useBounty,
    useUserBounties,
    useUserStats,
    useProposedCompleter,
    useCancelRequestedAt,
    useAllBounties,
    
    // Write functions
    createBounty,
    proposeCompletion,
    approveCompletion,
    requestCancel,
    cancelBountyAfterTimelock,
    reclaimExpiredBounty,
    extendDeadline,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}