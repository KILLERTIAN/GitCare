'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { 
  GitBranch, GitCommit, GitPullRequest, Star, GitFork, Users, 
  Calendar, Clock, TrendingUp, Award, Code, Target, Zap,
  Filter, Search, ArrowUpRight, ChevronDown, Eye, Rocket,
  Box, Lock, Globe, Settings, Bolt, Wand2
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { ArcTimeline, ArcTimelineItem } from "@/components/magicui/arc-timeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dynamic import for the dark veil background
const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

// Mock contribution data
const userContributions = {
  totalCommits: 2847,
  totalPRs: 456,
  totalReviews: 789,
  totalRepos: 23,
  totalStars: 12500,
  streakDays: 127,
  currentRank: 15,
  totalEarned: 45.7
};

const recentContributions = [
  {
    id: 1,
    type: 'commit',
    repo: 'avalanche-core',
    title: 'Optimize consensus mechanism for better throughput',
    description: 'Implemented new Byzantine fault tolerance improvements',
    time: '2 hours ago',
    reward: '2.5 AVAX',
    language: 'Go',
    difficulty: 'Advanced'
  },
  {
    id: 2,
    type: 'pr',
    repo: 'defi-protocol',
    title: 'Add liquidity pool rewards calculation',
    description: 'Enhanced yield farming algorithm with compound interest',
    time: '5 hours ago',
    reward: '1.8 AVAX',
    language: 'Solidity',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    type: 'review',
    repo: 'smart-contracts',
    title: 'Security audit for new lending protocol',
    description: 'Comprehensive code review and vulnerability assessment',
    time: '1 day ago',
    reward: '3.2 AVAX',
    language: 'Solidity',
    difficulty: 'Advanced'
  },
  {
    id: 4,
    type: 'commit',
    repo: 'web3-sdk',
    title: 'Add TypeScript support for wallet integration',
    description: 'Complete rewrite of wallet connector with type safety',
    time: '2 days ago',
    reward: '1.5 AVAX',
    language: 'TypeScript',
    difficulty: 'Intermediate'
  }
];

const topRepositories = [
  {
    name: 'avalanche-core',
    description: 'Core blockchain protocol implementation',
    language: 'Go',
    stars: 3240,
    forks: 847,
    contributions: 156,
    lastContribution: '2 hours ago',
    totalEarned: '15.6 AVAX'
  },
  {
    name: 'defi-protocol',
    description: 'Decentralized finance lending and borrowing',
    language: 'Solidity',
    stars: 2180,
    forks: 562,
    contributions: 89,
    lastContribution: '5 hours ago',
    totalEarned: '12.3 AVAX'
  },
  {
    name: 'smart-contracts',
    description: 'Audited smart contract templates',
    language: 'Solidity',
    stars: 1850,
    forks: 423,
    contributions: 67,
    lastContribution: '1 day ago',
    totalEarned: '9.8 AVAX'
  },
  {
    name: 'web3-sdk',
    description: 'JavaScript SDK for Web3 development',
    language: 'TypeScript',
    stars: 1560,
    forks: 298,
    contributions: 45,
    lastContribution: '2 days ago',
    totalEarned: '8.0 AVAX'
  }
];

// Timeline data for ArcTimeline
const TIMELINE_DATA: ArcTimelineItem[] = [
  {
    time: "2023 Q4",
    steps: [
      {
        icon: <Rocket width={20} height={20} />,
        content: "Started contributing to Avalanche ecosystem with first smart contract deployment.",
      },
      {
        icon: <Box width={20} height={20} />,
        content: "Developed first DeFi protocol prototype earning 5.2 AVAX in bounties.",
      },
    ],
  },
  {
    time: "2024 Q1",
    steps: [
      {
        icon: <Lock width={20} height={20} />,
        content: "Completed security audit for major lending protocol, discovered 3 critical vulnerabilities.",
      },
      {
        icon: <Globe width={20} height={20} />,
        content: "Contributed to cross-chain bridge implementation, enabling multi-blockchain support.",
      },
      {
        icon: <Settings width={20} height={20} />,
        content: "Optimized consensus mechanism, improving network throughput by 25%.",
      },
    ],
  },
  {
    time: "2024 Q2",
    steps: [
      {
        icon: <Rocket width={20} height={20} />,
        content: "Launched open-source NFT marketplace with advanced royalty system.",
      },
      {
        icon: <Globe width={20} height={20} />,
        content: "Partnered with 5 major DeFi protocols to integrate yield farming mechanisms.",
      },
      {
        icon: <Wand2 width={20} height={20} />,
        content: "Developed AI-powered smart contract analyzer for automated vulnerability detection.",
      },
    ],
  },
  {
    time: "2024 Q3",
    steps: [
      {
        icon: <Star width={20} height={20} />,
        content: "Achieved top 1% contributor status in Avalanche ecosystem with 2500+ commits.",
      },
      {
        icon: <Bolt width={20} height={20} />,
        content: "Implemented lightning-fast transaction processing, reducing gas fees by 40%.",
      },
      {
        icon: <Rocket width={20} height={20} />,
        content: "Mentored 50+ new developers in Web3 development through community programs.",
      },
    ],
  },
  {
    time: "2024 Q4",
    steps: [
      {
        icon: <Settings width={20} height={20} />,
        content: "Leading development of next-generation consensus algorithm for Avalanche 2.0.",
      },
      {
        icon: <Star width={20} height={20} />,
        content: "Earned 'Distinguished Contributor' badge with over 45 AVAX in total rewards.",
      },
      {
        icon: <Box width={20} height={20} />,
        content: "Building revolutionary DeFi infrastructure for institutional adoption.",
      },
    ],
  },
];

export default function ContributionsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredContributions = recentContributions.filter(contribution => {
    const matchesSearch = contribution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contribution.repo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || contribution.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="h-4 w-4" />;
      case 'pr': return <GitPullRequest className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getContributionColor = (type: string) => {
    switch (type) {
      case 'commit': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'pr': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'review': return 'text-purple-400 border-purple-500/30 bg-purple-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl glass-card border border-green-500/30">
                  <GitBranch className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
                      My Contributions
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Track your impact on the Avalanche ecosystem and earn AVAX rewards
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px] glass-base border-white/20">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
            >
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">{userContributions.totalCommits.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Commits</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">{userContributions.totalPRs}</div>
                <div className="text-gray-400 text-sm">Pull Requests</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">{userContributions.totalReviews}</div>
                <div className="text-gray-400 text-sm">Reviews</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-white">{userContributions.totalRepos}</div>
                <div className="text-gray-400 text-sm">Repositories</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-amber-400">{userContributions.totalEarned} AVAX</div>
                <div className="text-gray-400 text-sm">Total Earned</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-green-400">{userContributions.streakDays}</div>
                <div className="text-gray-400 text-sm">Day Streak</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-blue-400">#{userContributions.currentRank}</div>
                <div className="text-gray-400 text-sm">Global Rank</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-bold text-purple-400">{userContributions.totalStars.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Stars</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contribution Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  Contribution Timeline
                </CardTitle>
                <CardDescription>
                  Your journey through the Avalanche ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ArcTimeline
                  data={TIMELINE_DATA}
                  defaultActiveStep={{ time: "2024 Q4", stepIndex: 0 }}
                  className="text-white"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity and Top Repositories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                      Recent Activity
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search contributions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-48 glass-base border-white/20"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32 glass-base border-white/20">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="commit">Commits</SelectItem>
                          <SelectItem value="pr">Pull Requests</SelectItem>
                          <SelectItem value="review">Reviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CardDescription>
                    Latest contributions across all repositories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredContributions.map((contribution, index) => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="glass-base p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${getContributionColor(contribution.type)}`}>
                              {getContributionIcon(contribution.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{contribution.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {contribution.language}
                                </Badge>
                                <Badge 
                                  variant={contribution.difficulty === 'Advanced' ? 'destructive' : 
                                          contribution.difficulty === 'Intermediate' ? 'default' : 'secondary'} 
                                  className="text-xs"
                                >
                                  {contribution.difficulty}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{contribution.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <GitBranch className="h-3 w-3" />
                                  {contribution.repo}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {contribution.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-400 font-bold">{contribution.reward}</div>
                            <Button size="sm" variant="outline" className="mt-2 text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Repositories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="glass-card border-white/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-purple-400" />
                    Top Repositories
                  </CardTitle>
                  <CardDescription>
                    Your most active contribution targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRepositories.map((repo, index) => (
                      <motion.div
                        key={repo.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="glass-base p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{repo.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stars.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Contributions</span>
                            <span className="text-white font-medium">{repo.contributions}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Earned</span>
                            <span className="text-amber-400 font-medium">{repo.totalEarned}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last: {repo.lastContribution}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
