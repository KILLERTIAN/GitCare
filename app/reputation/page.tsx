'use client';

import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import ReputationDashboard from '@/components/reputation/ReputationDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import DarkVeil from '@/components/DarkVeil';
import { WalletConnect } from '@/components/bounty/WalletConnect';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReputationPage() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();

  if (!session) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <DarkVeil />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto text-center glass-card border-white/20 text-white">
            <CardContent className="pt-6">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Build Your Reputation</h2>
              <p className="text-gray-400 mb-4">
                Connect your GitHub account to start building your on-chain developer reputation.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/api/auth/signin">
                  Connect GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <DarkVeil />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <Card className="max-w-md mx-auto text-center glass-card border-white/20 text-white">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-4">
                Connect your wallet to view and manage your reputation on the blockchain.
              </p>
              <WalletConnect />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">Developer Reputation</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl">
              Your on-chain reputation is built through completing bounties, earning badges, and contributing to the ecosystem. 
              All achievements are permanently recorded as soulbound tokens.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Reputation Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Earn reputation by completing bounties. Higher value bounties and faster completion times give bonus points.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Star className="h-5 w-5 text-purple-400" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Unlock soulbound NFT badges as you reach reputation milestones. These badges are non-transferable proof of your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Users className="h-5 w-5 text-blue-400" />
                  Global Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Compete with developers worldwide. Your rank is determined by your total reputation and contribution quality.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reputation Dashboard */}
          <ReputationDashboard userAddress={address} />
        </main>
        <Footer />
      </div>
    </div>
  );
}