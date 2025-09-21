'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useBountyContract as useBountyContractWagmi } from '@/lib/hooks/use-bounty-contract'
import { useAuthentication } from '@/hooks/useAuthenticationState'
import { Bounty } from '@/types/bounty'

export function useBountyContract() {
  const {
    createBounty: createBountyWagmi,
    approveCompletion: completeBountyWagmi,
    requestCancel: cancelBountyWagmi,
    useAllBounties: useAllBountiesWagmi,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  } = useBountyContractWagmi()
  
  const { data: rawBounties, refetch } = useAllBountiesWagmi()
  
  const { user } = useAuthentication()
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchBounties = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: refreshedBounties } = await refetch()
      
      if (refreshedBounties && Array.isArray(refreshedBounties)) {
        const formattedBounties = refreshedBounties.map((b: any) => ({
          id: Number(b.id),
          title: b.title,
          description: b.description,
          reward: b.reward,
          creator: b.creator,
          isCompleted: b.isCompleted,
          deadline: Number(b.deadline),
          completedBy: b.completedBy,
          createdAt: Number(b.createdAt),
          tags: b.tags,
        }))
        setBounties(formattedBounties)
      } else {
        setBounties([])
      }
    } catch (e) {
      console.error('Error fetching bounties:', e)
      setError('Failed to fetch bounties from the smart contract.')
    } finally {
      setIsLoading(false)
    }
  }, [refetch])

  useEffect(() => {
    if (rawBounties && Array.isArray(rawBounties)) {
      const formattedBounties = rawBounties.map((b: any) => ({
        id: Number(b.id),
        title: b.title,
        description: b.description,
        reward: b.reward,
        creator: b.creator,
        isCompleted: b.isCompleted,
        deadline: Number(b.deadline),
        completedBy: b.completedBy,
        createdAt: Number(b.createdAt),
        tags: b.tags,
      }))
      setBounties(formattedBounties)
      setIsLoading(false)
    }
  }, [rawBounties])

  const createBounty = async (title: string, description: string, reward: number, deadline: number) => {
    if (!user) throw new Error('User not authenticated')
    
    const rewardInWei = ethers.parseEther(reward.toString())
    
    await createBountyWagmi(title, description, [], deadline, rewardInWei.toString())
  }

  const completeBounty = async (bountyId: number) => {
    await completeBountyWagmi(bountyId)
  }

  const cancelBounty = async (bountyId: number) => {
    await cancelBountyWagmi(bountyId)
  }

  return {
    bounties,
    isLoading,
    error,
    refetchBounties,
    createBounty,
    completeBounty,
    cancelBounty,
    transactionState: {
      isPending,
      isConfirming,
      isConfirmed,
      hash,
    },
  }
}
