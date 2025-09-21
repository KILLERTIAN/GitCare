'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { 
  BarChart3, LineChart, PieChart, TrendingUp, Zap, Globe, 
  ArrowUpRight, ArrowDownRight, Clock, Calendar, Download,
  Info, HelpCircle, Settings, ChevronDown, Filter, Coins,
  Award, Code, Users, Activity, Target
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dynamic import for the dark veil background
const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

// Mock data for analytics
const networkMetrics = {
  tps: {
    current: 4500,
    change: 12.5,
    history: [3950, 4100, 4250, 4000, 4200, 4350, 4500],
    goal: 5000
  },
  blockTime: {
    current: 2.1,
    change: -8.7,
    history: [2.4, 2.3, 2.25, 2.2, 2.2, 2.15, 2.1],
    goal: 2.0
  },
  activeValidators: {
    current: 1245,
    change: 5.2,
    history: [1150, 1175, 1190, 1205, 1220, 1235, 1245],
    goal: 1500
  },
  transactionFees: {
    current: 0.0075,
    change: -15.3,
    history: [0.0095, 0.009, 0.0085, 0.008, 0.0078, 0.0076, 0.0075],
    goal: 0.005
  },
  tvl: {
    current: 5.8,
    unit: 'B',
    change: 7.4,
    history: [5.25, 5.32, 5.45, 5.5, 5.65, 5.72, 5.8],
    goal: 10
  }
};

const contributionActivity = [
  { date: 'Mon', commits: 1245, prs: 285, reviews: 345, contributors: 89 },
  { date: 'Tue', commits: 1540, prs: 320, reviews: 410, contributors: 92 },
  { date: 'Wed', commits: 1350, prs: 275, reviews: 380, contributors: 87 },
  { date: 'Thu', commits: 1480, prs: 310, reviews: 395, contributors: 94 },
  { date: 'Fri', commits: 1620, prs: 340, reviews: 425, contributors: 98 },
  { date: 'Sat', commits: 920, prs: 190, reviews: 240, contributors: 76 },
  { date: 'Sun', commits: 850, prs: 175, reviews: 210, contributors: 72 }
];

const rewardDistribution = {
  monthly: [
    { month: 'Jan', value: 1250 },
    { month: 'Feb', value: 1380 },
    { month: 'Mar', value: 1540 },
    { month: 'Apr', value: 1420 },
    { month: 'May', value: 1680 },
    { month: 'Jun', value: 1840 },
    { month: 'Jul', value: 1720 },
    { month: 'Aug', value: 1850 },
    { month: 'Sep', value: 1950 },
  ],
  topContributors: [
    { name: 'Alex Chen', value: 45.2, avatar: '👨‍💻', specialty: 'Smart Contracts' },
    { name: 'Maya Patel', value: 38.7, avatar: '👩‍🚀', specialty: 'DeFi Protocol' },
    { name: 'Jordan Kim', value: 32.1, avatar: '🧑‍💼', specialty: 'Infrastructure' },
    { name: 'Sarah Wilson', value: 28.5, avatar: '👩‍🔬', specialty: 'AI/ML' },
    { name: 'David Rodriguez', value: 25.3, avatar: '👨‍🎨', specialty: 'Frontend' }
  ]
};

const projectDistribution = [
  { name: 'DeFi', value: 35, color: '#8b5cf6', count: 142 },
  { name: 'Infrastructure', value: 25, color: '#06b6d4', count: 98 },
  { name: 'Developer Tools', value: 18, color: '#2dd4bf', count: 76 },
  { name: 'NFTs & Gaming', value: 12, color: '#f97316', count: 54 },
  { name: 'Social', value: 10, color: '#ec4899', count: 42 }
];

const ecosystemStats = [
  { label: 'Total Projects', value: '412', change: '+12', icon: Code },
  { label: 'Active Developers', value: '2.8K', change: '+156', icon: Users },
  { label: 'Weekly Commits', value: '8.9K', change: '+234', icon: Activity },
  { label: 'Bounty Pool', value: '125K AVAX', change: '+2.4K', icon: Target }
];

// Time periods
const timePeriods = [
  { value: 'day', label: '24 Hours' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
  { value: 'quarter', label: '90 Days' },
  { value: 'year', label: '1 Year' },
];

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('week');

  // Chart component for metric cards
  const MetricChart = ({ data, color }: { data: number[], color: string }) => (
    <div className="h-10 mt-2">
      <div className="relative h-full flex items-end justify-between">
        {data.map((value, i) => {
          const max = Math.max(...data);
          const height = (value / max) * 100;
          const isLast = i === data.length - 1;
          
          return (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height}%`, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-[10%] rounded-sm ${isLast ? color : `${color}/50`}`}
            />
          );
        })}
      </div>
    </div>
  );

  // Network health metric component
  const NetworkMetric = ({ title, value, unit, change, color, history, goal }: { 
    title: string, 
    value: number,
    unit?: string,
    change: number,
    color: string,
    history: number[],
    goal: number
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Card className="glass-card border-white/20 h-full">
        <CardContent className="p-4 sm:p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-300 font-medium text-sm">{title}</h3>
            <Badge className={`
              ${change >= 0 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border-red-500/30'}
            `}>
              <span className="flex items-center">
                {change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(change)}%
              </span>
            </Badge>
          </div>
          
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-gray-400 mb-1">{unit}</span>}
          </div>
          
          <MetricChart data={history} color={color} />
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-400">Goal: {goal}{unit}</div>
            <div className="h-1.5 bg-white/10 rounded-full w-full max-w-24">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((value / goal) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${color}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
          {/* Analytics Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-xl glass-card border border-blue-500/30">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                      Ecosystem Analytics
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">
                    Network statistics, contribution metrics, and Avalanche ecosystem insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full sm:w-[150px] glass-base border-white/20">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent className="glass-card z-50">
                    {timePeriods.map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button className="glass-button border-blue-500/30 hover:border-blue-400/50 w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Export</span>
                </Button>
              </div>
            </div>
            
            {/* Ecosystem Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {ecosystemStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="glass-card p-4 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-green-400 text-sm flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
                      <stat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Network Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8"
            >
              <NetworkMetric 
                title="Transactions Per Second" 
                value={networkMetrics.tps.current}
                change={networkMetrics.tps.change} 
                color="bg-blue-500" 
                history={networkMetrics.tps.history}
                goal={networkMetrics.tps.goal}
              />
              <NetworkMetric 
                title="Block Time (s)" 
                value={networkMetrics.blockTime.current}
                change={networkMetrics.blockTime.change} 
                color="bg-purple-500" 
                history={networkMetrics.blockTime.history}
                goal={networkMetrics.blockTime.goal}
              />
              <NetworkMetric 
                title="Active Validators" 
                value={networkMetrics.activeValidators.current}
                change={networkMetrics.activeValidators.change} 
                color="bg-green-500" 
                history={networkMetrics.activeValidators.history}
                goal={networkMetrics.activeValidators.goal}
              />
              <NetworkMetric 
                title="Average Fee (AVAX)" 
                value={networkMetrics.transactionFees.current}
                change={networkMetrics.transactionFees.change} 
                color="bg-amber-500" 
                history={networkMetrics.transactionFees.history}
                goal={networkMetrics.transactionFees.goal}
              />
              <NetworkMetric 
                title="Total Value Locked" 
                value={networkMetrics.tvl.current}
                unit="B"
                change={networkMetrics.tvl.change} 
                color="bg-rose-500" 
                history={networkMetrics.tvl.history}
                goal={networkMetrics.tvl.goal}
              />
            </motion.div>
          </motion.div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* AVAX Rewards Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-amber-400" />
                    AVAX Rewards Distribution
                  </CardTitle>
                  <CardDescription>Monthly AVAX rewards distributed to contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg bg-black border border-white/10 p-4">
                    <div className="h-full flex items-end justify-around">
                      {rewardDistribution.monthly.map((data, i) => {
                        const barHeight = (data.value / 2000) * 100;
                        return (
                          <div key={i} className="relative flex flex-col items-center justify-end h-full" style={{ width: '8%' }}>
                            <motion.div 
                              className="w-full rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-400"
                              style={{ 
                                height: `${barHeight}%`,
                                boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${barHeight}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                            <div className="absolute -top-6 text-xs text-amber-400 font-medium">
                              {data.value}
                            </div>
                            <div className="absolute -bottom-5 text-xs text-gray-400">
                              {data.month}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="glass-card border-white/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-rose-400" />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>Highest AVAX earners this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rewardDistribution.topContributors.map((contributor, i) => (
                      <motion.div
                        key={contributor.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg glass-base border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{contributor.avatar}</div>
                          <div>
                            <div className="text-white font-medium">{contributor.name}</div>
                            <div className="text-gray-400 text-sm">{contributor.specialty}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-bold">{contributor.value} AVAX</div>
                          <div className="text-gray-500 text-sm">#{i + 1}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Developer Activity and Project Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Developer Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Developer Activity
                  </CardTitle>
                  <CardDescription>Weekly contribution metrics across all projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg glass-base border border-white/10 p-4">
                    <div className="grid grid-cols-7 h-[85%] items-end gap-2">
                      {contributionActivity.map((day, i) => (
                        <div key={i} className="h-full flex flex-col justify-end">
                          <div className="w-full flex gap-1 h-full items-end">
                            <motion.div 
                              className="w-1/4 bg-green-500/80 rounded-t-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.commits / 2000) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 }}
                              title={`Commits: ${day.commits}`}
                            />
                            <motion.div 
                              className="w-1/4 bg-blue-500/80 rounded-t-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.prs / 400) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                              title={`PRs: ${day.prs}`}
                            />
                            <motion.div 
                              className="w-1/4 bg-purple-500/80 rounded-t-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.reviews / 500) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                              title={`Reviews: ${day.reviews}`}
                            />
                            <motion.div 
                              className="w-1/4 bg-orange-500/80 rounded-t-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.contributors / 100) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 + 0.3 }}
                              title={`Contributors: ${day.contributors}`}
                            />
                          </div>
                          <div className="text-center text-xs text-gray-400 mt-2">{day.date}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500/80 rounded-sm mr-2"></div>
                        <span className="text-xs text-gray-400">Commits</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-500/80 rounded-sm mr-2"></div>
                        <span className="text-xs text-gray-400">PRs</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-purple-500/80 rounded-sm mr-2"></div>
                        <span className="text-xs text-gray-400">Reviews</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-orange-500/80 rounded-sm mr-2"></div>
                        <span className="text-xs text-gray-400">Contributors</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-400" />
                    Project Categories
                  </CardTitle>
                  <CardDescription>Distribution of projects by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectDistribution.map((category, i) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-white font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{category.count}</div>
                          <div className="text-gray-400 text-sm">{category.value}%</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Visual Progress Bars */}
                  <div className="mt-6 space-y-3">
                    {projectDistribution.map((category, i) => (
                      <div key={`bar-${category.name}`} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{category.name}</span>
                          <span className="text-gray-400">{category.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${category.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
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
