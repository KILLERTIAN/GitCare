import { useBountyContract } from '@/lib/hooks/use-bounty-contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import React from 'react';
import ReputationBadge from './ReputationBadge';
import ReputationChart from './ReputationChart';

interface ReputationDashboardProps {
  userAddress: string;
}

const ReputationDashboard: React.FC<ReputationDashboardProps> = ({ userAddress }) => {
  const { useUserStats } = useBountyContract();
  const { data: userStats, isLoading, error } = useUserStats(userAddress);

  // Mock data for chart until real data is available
  const reputationHistory = [
    { date: 'Jan', reputation: 10 },
    { date: 'Feb', reputation: 25 },
    { date: 'Mar', reputation: 45 },
    { date: 'Apr', reputation: 70 },
  ];

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10 text-white">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading reputation data...
        </CardContent>
      </Card>
    );
  }

  if (error || !userStats) {
    return (
      <Card className="glass-card border-white/10 text-red-400">
        <CardContent className="pt-6 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 mr-2" />
          Error loading reputation data.
        </CardContent>
      </Card>
    );
  }

  const [completedBounties, totalEarned, reputation] = userStats;

  const getRank = (rep: bigint) => {
    if (rep >= 100n) return 'Gold';
    if (rep >= 50n) return 'Silver';
    return 'Bronze';
  };

  return (
    <Card className="glass-card border-white/10 text-white">
      <CardHeader>
        <CardTitle>My Reputation</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ReputationBadge 
            level={Number(reputation)} 
            rank={getRank(reputation)} 
          />
          <div className="text-sm">
            <p className="text-gray-400">Address:</p>
            <p className="font-mono break-all">{userAddress}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{completedBounties.toString()}</p>
              <p className="text-sm text-gray-400">Bounties Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{Number(totalEarned) / 1e18} AVAX</p>
              <p className="text-sm text-gray-400">Total Earned</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Reputation History</h3>
          <ReputationChart data={reputationHistory} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationDashboard;
