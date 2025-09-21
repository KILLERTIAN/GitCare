'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { 
  LayoutDashboard, TrendingUp, Calendar, Clock, DollarSign, 
  Users, GitBranch, Target, Award, Briefcase, Activity,
  Settings, Bell, Search, Filter, Plus, ExternalLink,
  BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight,
  Star, GitCommit, Eye, MessageSquare, AlertCircle, CheckCircle2
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Dynamic import for the dark veil background
const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

// Mock dashboard data
const dashboardStats = {
  totalEarnings: 45.7,
  weeklyEarnings: 8.3,
  activeProjects: 12,
  completedBounties: 89,
  currentRank: 15,
  contributionScore: 2847,
  weeklyGrowth: 12.5,
  monthlyGrowth: 28.7
};

const activeProjects = [
  {
    id: 1,
    name: 'Avalanche Core Protocol',
    description: 'Core blockchain improvements and optimizations',
    language: 'Go',
    progress: 75,
    deadline: '2024-01-15',
    reward: '15.2 AVAX',
    priority: 'high',
    contributions: 23,
    status: 'in-progress'
  },
  {
    id: 2,
    name: 'DeFi Lending Platform',
    description: 'Smart contract security audit and improvements',
    language: 'Solidity',
    progress: 45,
    deadline: '2024-01-20',
    reward: '8.7 AVAX',
    priority: 'medium',
    contributions: 12,
    status: 'in-progress'
  },
  {
    id: 3,
    name: 'Cross-Chain Bridge',
    description: 'Multi-blockchain interoperability solution',
    language: 'TypeScript',
    progress: 90,
    deadline: '2024-01-10',
    reward: '12.5 AVAX',
    priority: 'high',
    contributions: 34,
    status: 'review'
  },
  {
    id: 4,
    name: 'NFT Marketplace SDK',
    description: 'JavaScript library for NFT marketplace integration',
    language: 'JavaScript',
    progress: 60,
    deadline: '2024-01-25',
    reward: '6.3 AVAX',
    priority: 'low',
    contributions: 8,
    status: 'in-progress'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'commit',
    action: 'Committed to avalanche-core',
    description: 'Optimize consensus mechanism for better throughput',
    time: '2 hours ago',
    reward: '+2.5 AVAX'
  },
  {
    id: 2,
    type: 'review',
    action: 'Code review completed',
    description: 'Security audit for lending protocol smart contracts',
    time: '4 hours ago',
    reward: '+3.2 AVAX'
  },
  {
    id: 3,
    type: 'bounty',
    action: 'Bounty completed',
    description: 'Fixed critical vulnerability in cross-chain bridge',
    time: '1 day ago',
    reward: '+5.8 AVAX'
  },
  {
    id: 4,
    type: 'milestone',
    action: 'Milestone achieved',
    description: 'Reached 2500 total contributions',
    time: '2 days ago',
    reward: '+1.0 AVAX'
  },
  {
    id: 5,
    type: 'pr',
    action: 'Pull request merged',
    description: 'Added TypeScript support for wallet SDK',
    time: '3 days ago',
    reward: '+1.7 AVAX'
  }
];

const upcomingDeadlines = [
  {
    project: 'Cross-Chain Bridge',
    task: 'Final security review',
    deadline: '2024-01-10',
    daysLeft: 2,
    priority: 'high'
  },
  {
    project: 'Avalanche Core Protocol',
    task: 'Performance benchmarks',
    deadline: '2024-01-15',
    daysLeft: 7,
    priority: 'high'
  },
  {
    project: 'DeFi Lending Platform',
    task: 'Smart contract deployment',
    deadline: '2024-01-20',
    daysLeft: 12,
    priority: 'medium'
  },
  {
    project: 'NFT Marketplace SDK',
    task: 'Documentation completion',
    deadline: '2024-01-25',
    daysLeft: 17,
    priority: 'low'
  }
];

const earnings = [
  { month: 'Oct', amount: 32.5 },
  { month: 'Nov', amount: 41.2 },
  { month: 'Dec', amount: 45.7 },
  { month: 'Jan', amount: 38.9 }
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'review': return 'text-amber-400 border-amber-500/30 bg-amber-500/20';
      case 'completed': return 'text-green-400 border-green-500/30 bg-green-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/20';
      case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/20';
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'bounty': return <Target className="h-4 w-4" />;
      case 'milestone': return <Award className="h-4 w-4" />;
      case 'pr': return <GitBranch className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl glass-card border border-blue-500/30">
                  <LayoutDashboard className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                      Developer Dashboard
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Track your progress, manage projects, and monitor earnings
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="glass-base border-white/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="glass-base border-white/20">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-amber-400">{dashboardStats.totalEarnings} AVAX</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{dashboardStats.weeklyGrowth}% this week
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.activeProjects}</p>
                    <p className="text-blue-400 text-sm flex items-center mt-1">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {dashboardStats.completedBounties} completed
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Global Rank</p>
                    <p className="text-2xl font-bold text-white">#{dashboardStats.currentRank}</p>
                    <p className="text-purple-400 text-sm flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Top 1% contributor
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Contribution Score</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.contributionScore.toLocaleString()}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{dashboardStats.monthlyGrowth}% this month
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
                      Active Projects
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search projects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-48 glass-base border-white/20"
                        />
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Manage your ongoing contributions and track progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="glass-base p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{project.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {project.language}
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {project.deadline}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitCommit className="h-3 w-3" />
                                {project.contributions} contributions
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-amber-400 font-bold mb-2">{project.reward}</div>
                            <Button size="sm" variant="outline" className="text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest contributions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 glass-base rounded-lg border border-white/5"
                      >
                        <div className={`p-1.5 rounded-lg ${getStatusColor('in-progress')}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-xs truncate">{activity.description}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-500 text-xs">{activity.time}</span>
                            <span className="text-amber-400 text-xs font-bold">{activity.reward}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-400" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>
                    Important dates and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-3 glass-base rounded-lg border border-white/5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{deadline.task}</p>
                            <p className="text-gray-400 text-xs">{deadline.project}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getPriorityColor(deadline.priority)}`}>
                                {deadline.priority}
                              </Badge>
                              <span className="text-gray-500 text-xs">{deadline.deadline}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              deadline.daysLeft <= 3 ? 'text-red-400' : 
                              deadline.daysLeft <= 7 ? 'text-amber-400' : 'text-green-400'
                            }`}>
                              {deadline.daysLeft}d
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Chart */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                    Earnings Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly AVAX earnings overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {earnings.map((earning, index) => (
                      <motion.div
                        key={earning.month}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-400 text-sm">{earning.month}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${(earning.amount / 50) * 60}px` }}
                          />
                          <span className="text-white text-sm font-medium">{earning.amount}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
