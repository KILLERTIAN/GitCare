'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Medal, Star, Crown, Award, TrendingUp, Users,
  GitBranch, GitCommit, Eye, Target, Zap, Calendar,
  Filter, Search, ArrowUp, ArrowDown, MoreVertical,
  MapPin, Link as LinkIcon, Github, Twitter, Globe
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Dynamic import for the dark veil background
const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

// Mock leaderboard data
const topContributors = [
  {
    id: 1,
    rank: 1,
    previousRank: 1,
    name: 'Alice Chen',
    username: 'alice_dev',
    avatar: '/api/placeholder/40/40',
    location: 'San Francisco, CA',
    totalEarnings: 156.8,
    monthlyEarnings: 23.4,
    contributions: 4256,
    repositories: 87,
    pullRequests: 892,
    codeReviews: 1245,
    score: 9850,
    badges: ['Gold Contributor', 'Security Expert', 'Community Leader'],
    specialties: ['Blockchain', 'DeFi', 'Smart Contracts'],
    joinDate: '2023-01-15',
    streak: 245,
    socialLinks: {
      github: 'alice_dev',
      twitter: 'alice_blockchain',
      website: 'alicechen.dev'
    }
  },
  {
    id: 2,
    rank: 2,
    previousRank: 3,
    name: 'Marcus Rodriguez',
    username: 'marcus_crypto',
    avatar: '/api/placeholder/40/40',
    location: 'New York, NY',
    totalEarnings: 142.3,
    monthlyEarnings: 19.8,
    contributions: 3897,
    repositories: 65,
    pullRequests: 756,
    codeReviews: 1089,
    score: 9234,
    badges: ['Gold Contributor', 'Performance Expert'],
    specialties: ['Consensus', 'P2P Networks', 'Cryptography'],
    joinDate: '2023-02-20',
    streak: 189,
    socialLinks: {
      github: 'marcus_crypto',
      twitter: 'marcus_dev'
    }
  },
  {
    id: 3,
    rank: 3,
    previousRank: 2,
    name: 'Sarah Kim',
    username: 'sarah_blockchain',
    avatar: '/api/placeholder/40/40',
    location: 'Seoul, South Korea',
    totalEarnings: 138.9,
    monthlyEarnings: 21.2,
    contributions: 3654,
    repositories: 72,
    pullRequests: 689,
    codeReviews: 967,
    score: 8976,
    badges: ['Gold Contributor', 'Innovation Award', 'Bug Hunter'],
    specialties: ['Frontend', 'Web3 UX', 'dApps'],
    joinDate: '2023-01-08',
    streak: 156,
    socialLinks: {
      github: 'sarah_blockchain',
      website: 'sarahkim.io'
    }
  },
  // Add more contributors...
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    previousRank: i + Math.floor(Math.random() * 3) + 2,
    name: `Developer ${i + 4}`,
    username: `dev_${i + 4}`,
    avatar: '/api/placeholder/40/40',
    location: ['London, UK', 'Berlin, Germany', 'Tokyo, Japan', 'Toronto, Canada', 'Sydney, Australia'][i % 5],
    totalEarnings: Math.round((135 - i * 5) * 10) / 10,
    monthlyEarnings: Math.round((20 - i * 0.5) * 10) / 10,
    contributions: 3500 - i * 100,
    repositories: 70 - i * 2,
    pullRequests: 650 - i * 20,
    codeReviews: 900 - i * 30,
    score: 8800 - i * 200,
    badges: i < 5 ? ['Gold Contributor'] : i < 10 ? ['Silver Contributor'] : ['Bronze Contributor'],
    specialties: [
      ['Backend', 'APIs', 'Infrastructure'],
      ['Frontend', 'React', 'TypeScript'],
      ['DevOps', 'CI/CD', 'Cloud'],
      ['Security', 'Auditing', 'Testing'],
      ['Mobile', 'React Native', 'Flutter']
    ][i % 5],
    joinDate: `2023-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    streak: Math.floor(Math.random() * 200) + 50,
    socialLinks: {
      github: `dev_${i + 4}`
    }
  }))
];

const categories = [
  { id: 'overall', name: 'Overall', icon: Trophy },
  { id: 'earnings', name: 'Top Earners', icon: Star },
  { id: 'contributions', name: 'Most Contributions', icon: GitCommit },
  { id: 'reviews', name: 'Best Reviewers', icon: Eye },
  { id: 'security', name: 'Security Experts', icon: Target },
  { id: 'newcomers', name: 'Rising Stars', icon: TrendingUp }
];

const timeRanges = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
];

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const getRankChange = (rank: number, previousRank: number) => {
    if (rank < previousRank) return { type: 'up', change: previousRank - rank };
    if (rank > previousRank) return { type: 'down', change: rank - previousRank };
    return { type: 'same', change: 0 };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes('Gold')) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
    if (badge.includes('Silver')) return 'text-gray-300 border-gray-400/30 bg-gray-400/20';
    if (badge.includes('Bronze')) return 'text-amber-600 border-amber-500/30 bg-amber-500/20';
    return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
  };

  const filteredContributors = topContributors.filter(contributor =>
    contributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contributor.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <div className="p-3 rounded-xl glass-card border border-yellow-500/30">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent">
                      Leaderboard
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Top contributors in the Avalanche ecosystem
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px] glass-base border-white/20">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {timeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'glass-card border-blue-500/30 text-blue-400'
                        : 'glass-base border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative max-w-md"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-base border-white/20"
              />
            </motion.div>
          </motion.div>

          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="md:order-1"
            >
              <Card className="glass-card border-white/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-300" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={topContributors[1]?.avatar}
                        alt={topContributors[1]?.name}
                        className="w-20 h-20 rounded-full border-4 border-gray-300"
                      />
                      <div className="absolute -top-2 -right-2 p-2 bg-gray-300 rounded-full">
                        <Medal className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{topContributors[1]?.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">@{topContributors[1]?.username}</p>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-300">{topContributors[1]?.totalEarnings} AVAX</div>
                    <div className="text-sm text-gray-400">{topContributors[1]?.contributions} contributions</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="md:order-2 md:-mt-4"
            >
              <Card className="glass-card border-yellow-500/30 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-300" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={topContributors[0]?.avatar}
                        alt={topContributors[0]?.name}
                        className="w-24 h-24 rounded-full border-4 border-yellow-400"
                      />
                      <div className="absolute -top-3 -right-3 p-2 bg-yellow-400 rounded-full">
                        <Crown className="h-6 w-6 text-yellow-900" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{topContributors[0]?.name}</h3>
                  <p className="text-gray-400 mb-3">@{topContributors[0]?.username}</p>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-yellow-400">{topContributors[0]?.totalEarnings} AVAX</div>
                    <div className="text-gray-400">{topContributors[0]?.contributions} contributions</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="md:order-3"
            >
              <Card className="glass-card border-white/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-500" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={topContributors[2]?.avatar}
                        alt={topContributors[2]?.name}
                        className="w-20 h-20 rounded-full border-4 border-amber-600"
                      />
                      <div className="absolute -top-2 -right-2 p-2 bg-amber-600 rounded-full">
                        <Medal className="h-4 w-4 text-amber-100" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{topContributors[2]?.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">@{topContributors[2]?.username}</p>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-amber-600">{topContributors[2]?.totalEarnings} AVAX</div>
                    <div className="text-sm text-gray-400">{topContributors[2]?.contributions} contributions</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-400" />
                  Full Rankings
                </CardTitle>
                <CardDescription>
                  Complete contributor leaderboard for {timeRanges.find(r => r.value === timeRange)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredContributors.map((contributor, index) => {
                    const rankChange = getRankChange(contributor.rank, contributor.previousRank);
                    
                    return (
                      <motion.div
                        key={contributor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="glass-base p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex items-center gap-2 w-16">
                            <div className="text-2xl font-bold text-white flex items-center gap-1">
                              {getRankIcon(contributor.rank)}
                              {contributor.rank}
                            </div>
                            {rankChange.type !== 'same' && (
                              <div className={`flex items-center text-xs ${
                                rankChange.type === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {rankChange.type === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                {rankChange.change}
                              </div>
                            )}
                          </div>

                          {/* Avatar */}
                          <img
                            src={contributor.avatar}
                            alt={contributor.name}
                            className="w-12 h-12 rounded-full border-2 border-white/20"
                          />

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{contributor.name}</h4>
                              <span className="text-gray-400 text-sm">@{contributor.username}</span>
                              {contributor.location && (
                                <span className="flex items-center gap-1 text-gray-500 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  {contributor.location}
                                </span>
                              )}
                            </div>
                            
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {contributor.badges.slice(0, 3).map((badge, i) => (
                                <Badge key={i} className={`text-xs ${getBadgeColor(badge)}`}>
                                  {badge}
                                </Badge>
                              ))}
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1">
                              {contributor.specialties.slice(0, 3).map((specialty, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-xl font-bold text-amber-400">{contributor.totalEarnings}</div>
                              <div className="text-xs text-gray-400">Total AVAX</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-white">{contributor.contributions}</div>
                              <div className="text-xs text-gray-400">Contributions</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-400">{contributor.pullRequests}</div>
                              <div className="text-xs text-gray-400">Pull Requests</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-400">{contributor.codeReviews}</div>
                              <div className="text-xs text-gray-400">Reviews</div>
                            </div>
                          </div>

                          {/* Social Links */}
                          <div className="flex items-center gap-2">
                            {contributor.socialLinks.github && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Github className="h-4 w-4" />
                              </Button>
                            )}
                            {'twitter' in contributor.socialLinks && contributor.socialLinks.twitter && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Twitter className="h-4 w-4" />
                              </Button>
                            )}
                            {'website' in contributor.socialLinks && contributor.socialLinks.website && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Globe className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}