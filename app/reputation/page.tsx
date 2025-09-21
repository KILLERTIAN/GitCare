'use client';

import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import { ReputationDashboard } from '@/components/reputation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function ReputationPage() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();

  if (!session) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Build Your Reputation</h2>
            <p className="text-muted-foreground mb-4">
              Connect your GitHub account to start building your on-chain developer reputation.
            </p>
            <Button asChild>
              <Link href="/api/auth/signin">
                Connect GitHub
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto px-6 py-20">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to view and manage your reputation on the blockchain.
            </p>
            <Button>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Developer Reputation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your on-chain reputation is built through completing bounties, earning badges, and contributing to the ecosystem. 
          All achievements are permanently recorded as soulbound tokens.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Reputation Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Earn reputation by completing bounties. Higher value bounties and faster completion times give bonus points.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-purple-500" />
              Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unlock soulbound NFT badges as you reach reputation milestones. These badges are non-transferable proof of your skills.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              Global Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compete with developers worldwide. Your rank is determined by your total reputation and contribution quality.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reputation Dashboard */}
      <ReputationDashboard userAddress={address} />
    </div>
  );
}