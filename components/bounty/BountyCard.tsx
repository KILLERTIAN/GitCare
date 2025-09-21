'use client'

import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBountyContract } from '@/lib/hooks/use-bounty-contract'
import type { Bounty } from '@/lib/contracts/gitcare-bounty'

interface BountyCardProps {
  bounty: Bounty
  onRefresh?: () => void
}

export function BountyCard({ bounty, onRefresh }: BountyCardProps) {
  const { address } = useAccount()
  const { proposeCompletion, approveCompletion, isPending } = useBountyContract()

  const isCreator = address?.toLowerCase() === bounty.creator.toLowerCase()
  const isCompleted = bounty.isCompleted
  const hasDeadline = bounty.deadline !== '0'
  const isExpired = hasDeadline && Date.now() > Number(bounty.deadline) * 1000

  const handleProposeCompletion = async () => {
    try {
      await proposeCompletion(Number(bounty.id))
      onRefresh?.()
    } catch (error) {
      console.error('Error proposing completion:', error)
    }
  }

  const handleApproveCompletion = async () => {
    try {
      await approveCompletion(Number(bounty.id))
      onRefresh?.()
    } catch (error) {
      console.error('Error approving completion:', error)
    }
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{bounty.title}</CardTitle>
            <CardDescription className="text-white/70">
              By {bounty.creator.slice(0, 6)}...{bounty.creator.slice(-4)}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {formatEther(BigInt(bounty.reward))} AVAX
            </div>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Completed
              </Badge>
            )}
            {isExpired && !isCompleted && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                Expired
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-white/80 mb-4">{bounty.description}</p>
        
        {bounty.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {bounty.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-white/30 text-white/70">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-sm text-white/60 space-y-1">
          <div>Created: {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}</div>
          {hasDeadline && (
            <div>Deadline: {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}</div>
          )}
          {isCompleted && (
            <div>Completed by: {bounty.completedBy.slice(0, 6)}...{bounty.completedBy.slice(-4)}</div>
          )}
        </div>
      </CardContent>

      {!isCompleted && address && (
        <CardFooter>
          {!isCreator && !isExpired && (
            <Button 
              onClick={handleProposeCompletion}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Proposing...' : 'Propose Completion'}
            </Button>
          )}
          
          {isCreator && (
            <Button 
              onClick={handleApproveCompletion}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isPending ? 'Approving...' : 'Approve Completion'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}