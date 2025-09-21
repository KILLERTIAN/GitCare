'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WalletConnect } from './WalletConnect'
import { CreateBountyForm } from './CreateBountyForm'
import { BountyCard } from './BountyCard'
import { useBountyContract } from '@/lib/hooks/use-bounty-contract'
import type { Bounty } from '@/lib/contracts/gitcare-bounty'

interface BountyManagerProps {
  showStats?: boolean
}

export function BountyManager({ showStats = true }: BountyManagerProps) {
  const { address, isConnected } = useAccount()
  const { useBountyCount, useUserBounties, useUserStats } = useBountyContract()
  
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const { data: bountyCount } = useBountyCount()
  const { data: userBountyIds } = useUserBounties(address || '')
  const { data: userStats } = useUserStats(address || '')

  // Fetch all bounties from API
  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch('/api/bounties')
        if (response.ok) {
          const bountyData = await response.json()
          setBounties(bountyData)
        }
      } catch (error) {
        console.error('Error fetching bounties:', error)
      }
    }

    fetchBounties()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
        <p className="text-white/70 text-center max-w-md">
          Connect your wallet to create bounties, propose completions, and earn rewards.
        </p>
        <WalletConnect />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">GitCare Bounties</h1>
          <p className="text-white/70">Decentralized bounty system for open source contributions</p>
        </div>
        <WalletConnect />
      </div>

      {showStats && userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Completed Bounties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats[0]?.toString() || '0'}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {userStats[1] ? `${Number(userStats[1]) / 1e18} AVAX` : '0 AVAX'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Reputation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{userStats[2]?.toString() || '0'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All Bounties</TabsTrigger>
          <TabsTrigger value="my" className="data-[state=active]:bg-white/20">My Bounties</TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-white/20">Create Bounty</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">All Bounties ({bounties.length})</h2>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} onRefresh={handleRefresh} />
            ))}
          </div>
          
          {bounties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/70">No bounties found. Be the first to create one!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my" className="space-y-4">
          <h2 className="text-xl font-semibold text-white">My Bounties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bounties
              .filter(bounty => bounty.creator.toLowerCase() === address?.toLowerCase())
              .map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} onRefresh={handleRefresh} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="create">
          <CreateBountyForm onSuccess={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  )
}