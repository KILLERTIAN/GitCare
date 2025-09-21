"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Calendar, Award, TrendingUp, GitCommit, 
  Star, Zap, Filter, BarChart3, Activity, Target, Users, Clock, 
  Sparkles, Code2, Shield, Rocket, Globe, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ArcTimelineStep {
  icon: React.ReactNode;
  content: string;
  achievement?: string;
  reward?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category?: string;
  date?: string;
  stats?: {
    commits?: number;
    impact?: number;
    collaborators?: number;
  };
}

export interface ArcTimelineItem {
  time: string;
  steps: ArcTimelineStep[];
  monthlyStats?: {
    totalCommits: number;
    totalRewards: number;
    projectsContributed: number;
    avgDifficulty: number;
  };
}

export interface ContributionNode {
  date: string;
  value: number;
  category: 'commit' | 'review' | 'bounty' | 'milestone' | 'security';
  projects: string[];
  reward?: number;
}

interface AdvancedTimelineProps {
  data: ArcTimelineItem[];
  defaultActiveStep?: { time: string; stepIndex: number };
  className?: string;
}

// Generate advanced contribution network data
const generateAdvancedContributionData = (year: number): ContributionNode[] => {
  const nodes: ContributionNode[] = [];
  const today = new Date();
  const categories: Array<'commit' | 'review' | 'bounty' | 'milestone' | 'security'> = 
    ['commit', 'review', 'bounty', 'milestone', 'security'];
  
  const projects = ['avalanche-core', 'defi-protocol', 'smart-contracts', 'web3-sdk', 'nft-marketplace'];
  
  // Use deterministic pseudo-random based on year for consistent SSR/client rendering
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + i);
    
    // Skip if future date
    if (date > today) break;
    
    const seed = year * 1000 + i;
    const activity = seededRandom(seed);
    
    if (activity > 0.3) { // 70% chance of activity
      const categoryIndex = Math.floor(seededRandom(seed + 1) * categories.length);
      const projectCount = Math.floor(seededRandom(seed + 2) * 3) + 1;
      const selectedProjects = projects.slice(0, projectCount);
      
      nodes.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(seededRandom(seed + 3) * 20) + 1,
        category: categories[categoryIndex],
        projects: selectedProjects,
        reward: categories[categoryIndex] === 'bounty' ? 
          Math.floor(seededRandom(seed + 4) * 10) + 1 : undefined
      });
    }
  }
  
  return nodes;
};

export const AdvancedTimeline: React.FC<AdvancedTimelineProps> = ({
  data,
  defaultActiveStep,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contributionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [activeStep, setActiveStep] = useState(
    defaultActiveStep || { time: data[0]?.time || "", stepIndex: 0 }
  );
  const [selectedYear, setSelectedYear] = useState(2024);
  const [hoveredElement, setHoveredElement] = useState<{
    type: 'node' | 'connection' | 'particle' | null;
    position: { x: number; y: number };
    description: string;
  } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(11); // December
  const [viewMode, setViewMode] = useState<'timeline' | 'network'>('timeline');
  const [animationPhase, setAnimationPhase] = useState(0);
  
  const contributionData = useMemo(() => 
    generateAdvancedContributionData(selectedYear), [selectedYear]);
  
  // Animation loop for dynamic effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Separate useEffect for handling dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        canvasRef.current.width = rect.width * window.devicePixelRatio;
        canvasRef.current.height = rect.height * window.devicePixelRatio;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      }
      
      if (contributionCanvasRef.current) {
        const rect = contributionCanvasRef.current.getBoundingClientRect();
        contributionCanvasRef.current.width = rect.width * window.devicePixelRatio;
        contributionCanvasRef.current.height = rect.height * window.devicePixelRatio;
        const ctx = contributionCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Advanced Timeline Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || viewMode !== 'timeline') return;

    const drawAdvancedTimeline = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
      
      // Draw quantum-style background grid
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(animationPhase * 0.02) * 0.05})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * radius * 0.8;
        const y1 = centerY + Math.sin(angle) * radius * 0.8;
        const x2 = centerX + Math.cos(angle) * radius * 1.2;
        const y2 = centerY + Math.sin(angle) * radius * 1.2;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      // Draw spiral timeline path
      const spiralTurns = 2;
      const points = 200;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = t * spiralTurns * Math.PI * 2;
        const r = radius * (0.3 + t * 0.7);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Draw timeline nodes with neural network connections
      data.forEach((item, index) => {
        const t = index / Math.max(data.length - 1, 1);
        const angle = t * spiralTurns * Math.PI * 2;
        const r = radius * (0.3 + t * 0.7);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        // Draw connections to nearby nodes
        if (index > 0) {
          const prevIndex = index - 1;
          const prevT = prevIndex / Math.max(data.length - 1, 1);
          const prevAngle = prevT * spiralTurns * Math.PI * 2;
          const prevR = radius * (0.3 + prevT * 0.7);
          const prevX = centerX + Math.cos(prevAngle) * prevR;
          const prevY = centerY + Math.sin(prevAngle) * prevR;
          
          ctx.strokeStyle = item.time === activeStep.time ? 
            'rgba(59, 130, 246, 0.8)' : 'rgba(139, 92, 246, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        
        // Draw node with pulsing effect
        const isActive = item.time === activeStep.time;
        const pulse = isActive ? 1 + Math.sin(animationPhase * 0.1) * 0.3 : 1;
        
        // Outer glow
        if (isActive) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20 * pulse);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 20 * pulse, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        // Main node
        ctx.beginPath();
        ctx.arc(x, y, 8 * pulse, 0, 2 * Math.PI);
        ctx.fillStyle = isActive ? 
          `hsl(${220 + Math.sin(animationPhase * 0.05) * 20}, 70%, 60%)` : 
          'rgba(139, 92, 246, 0.8)';
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(x, y, 4 * pulse, 0, 2 * Math.PI);
        ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        
        // Draw orbiting particles for active node
        if (isActive) {
          for (let p = 0; p < 3; p++) {
            const particleAngle = (animationPhase * 0.05) + (p * Math.PI * 2 / 3);
            const particleR = 15 + Math.sin(animationPhase * 0.03 + p) * 5;
            const px = x + Math.cos(particleAngle) * particleR;
            const py = y + Math.sin(particleAngle) * particleR;
            
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, 2 * Math.PI);
            ctx.fillStyle = `hsla(${60 + p * 60}, 80%, 70%, 0.8)`;
            ctx.fill();
          }
        }
      });
    };

    drawAdvancedTimeline();
  }, [dimensions, activeStep, data, animationPhase, viewMode]);

  // Advanced Contribution Network Drawing
  useEffect(() => {
    const canvas = contributionCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || viewMode !== 'network') return;
    
    const drawContributionNetwork = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Group contributions by month
      const monthlyData: { [key: string]: ContributionNode[] } = {};
      contributionData.forEach(node => {
        const monthKey = node.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
        monthlyData[monthKey].push(node);
      });
      
      const months = Object.keys(monthlyData).sort();
      const cols = 12; // 12 months
      const rows = Math.max(...Object.values(monthlyData).map(m => m.length));
      
      const cellWidth = (width - 100) / cols;
      const cellHeight = (height - 100) / Math.max(rows, 20);
      const startX = 50;
      const startY = 50;
      
      // Draw month labels with dynamic colors
      ctx.font = 'bold 12px -apple-system, sans-serif';
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      months.forEach((month, colIndex) => {
        const monthIndex = parseInt(month.split('-')[1]) - 1;
        const x = startX + colIndex * cellWidth + cellWidth / 2;
        const y = startY - 15;
        
        ctx.fillStyle = `hsl(${monthIndex * 30}, 60%, 70%)`;
        ctx.fillText(monthNames[monthIndex], x - 15, y);
      });
      
      // Draw contribution network nodes
      months.forEach((month, colIndex) => {
        const nodes = monthlyData[month] || [];
        const x = startX + colIndex * cellWidth + cellWidth / 2;
        
        nodes.forEach((node, nodeIndex) => {
          const y = startY + nodeIndex * cellHeight + cellHeight / 2;
          
          // Category colors and shapes
          const categoryStyles = {
            commit: { color: 'rgba(34, 197, 94, 0.8)', shape: 'circle' },
            review: { color: 'rgba(59, 130, 246, 0.8)', shape: 'square' },
            bounty: { color: 'rgba(251, 191, 36, 0.8)', shape: 'diamond' },
            milestone: { color: 'rgba(139, 92, 246, 0.8)', shape: 'star' },
            security: { color: 'rgba(239, 68, 68, 0.8)', shape: 'triangle' }
          };
          
          const style = categoryStyles[node.category];
          const size = Math.min(node.value * 2 + 5, 15);
          
          // Draw connections between related nodes
          if (nodeIndex > 0) {
            const prevNode = nodes[nodeIndex - 1];
            const prevY = startY + (nodeIndex - 1) * cellHeight + cellHeight / 2;
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
          
          // Draw node based on category
          ctx.fillStyle = style.color;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          
          switch (style.shape) {
            case 'circle':
              ctx.beginPath();
              ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
              break;
              
            case 'square':
              ctx.fillRect(x - size / 2, y - size / 2, size, size);
              ctx.strokeRect(x - size / 2, y - size / 2, size, size);
              break;
              
            case 'diamond':
              ctx.beginPath();
              ctx.moveTo(x, y - size / 2);
              ctx.lineTo(x + size / 2, y);
              ctx.lineTo(x, y + size / 2);
              ctx.lineTo(x - size / 2, y);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              break;
              
            case 'triangle':
              ctx.beginPath();
              ctx.moveTo(x, y - size / 2);
              ctx.lineTo(x + size / 2, y + size / 2);
              ctx.lineTo(x - size / 2, y + size / 2);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              break;
              
            case 'star':
              // Draw 5-pointed star
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x1 = x + Math.cos(angle) * size / 2;
                const y1 = y + Math.sin(angle) * size / 2;
                if (i === 0) ctx.moveTo(x1, y1);
                else ctx.lineTo(x1, y1);
                
                const innerAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
                const x2 = x + Math.cos(innerAngle) * size / 4;
                const y2 = y + Math.sin(innerAngle) * size / 4;
                ctx.lineTo(x2, y2);
              }
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              break;
          }
          
          // Add glow effect for high-value nodes
          if (node.value > 10) {
            ctx.shadowColor = style.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x, y, size / 2 + 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
      
      // Draw legend
      const legendY = height - 40;
      const legendItems = [
        { category: 'commit', color: 'rgba(34, 197, 94, 0.8)', shape: 'circle' },
        { category: 'review', color: 'rgba(59, 130, 246, 0.8)', shape: 'square' },
        { category: 'bounty', color: 'rgba(251, 191, 36, 0.8)', shape: 'diamond' },
        { category: 'milestone', color: 'rgba(139, 92, 246, 0.8)', shape: 'star' },
        { category: 'security', color: 'rgba(239, 68, 68, 0.8)', shape: 'triangle' }
      ];
      
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Legend:', 10, legendY - 10);
      
      legendItems.forEach((item, index) => {
        const x = 10 + index * 80;
        const y = legendY;
        
        // Draw legend shape
        ctx.fillStyle = item.color;
        switch (item.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(x + 8, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(x + 4, y - 4, 8, 8);
            break;
          case 'diamond':
            ctx.beginPath();
            ctx.moveTo(x + 8, y - 4);
            ctx.lineTo(x + 12, y);
            ctx.lineTo(x + 8, y + 4);
            ctx.lineTo(x + 4, y);
            ctx.closePath();
            ctx.fill();
            break;
        }
        
        // Draw legend text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(item.category, x + 16, y + 3);
      });
    };
    
    drawContributionNetwork();
  }, [contributionData, selectedYear, viewMode]);

  const handleStepClick = (time: string, stepIndex: number) => {
    setActiveStep({ time, stepIndex });
  };

  const navigateStep = (direction: 'prev' | 'next') => {
    const allSteps: Array<{ time: string; stepIndex: number }> = [];
    data.forEach(item => {
      item.steps.forEach((_, stepIndex) => {
        allSteps.push({ time: item.time, stepIndex });
      });
    });
    
    const currentIndex = allSteps.findIndex(
      step => step.time === activeStep.time && step.stepIndex === activeStep.stepIndex
    );
    
    if (direction === 'prev' && currentIndex > 0) {
      setActiveStep(allSteps[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < allSteps.length - 1) {
      setActiveStep(allSteps[currentIndex + 1]);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'Hard': return 'text-orange-400 border-orange-500/30 bg-orange-500/20';
      case 'Expert': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
    }
  };

  const currentItem = data.find(item => item.time === activeStep.time);
  const currentStep = currentItem?.steps[activeStep.stepIndex];

  return (
    <div className={`w-full ${className}`}>
      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setViewMode(viewMode === 'timeline' ? 'network' : 'timeline')}
            variant="outline"
            className="glass-base border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            {viewMode === 'timeline' ? (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Network View
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Timeline View
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[100px] glass-base border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {[2024, 2023, 2022].map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {viewMode === 'timeline' && (
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-[120px] glass-base border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  .map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Canvas Area */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/20 p-6 relative overflow-hidden">
            {/* Background gradient animation */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at ${50 + Math.sin(animationPhase * 0.01) * 20}% ${50 + Math.cos(animationPhase * 0.015) * 20}%, 
                    rgba(59, 130, 246, 0.3) 0%, 
                    rgba(139, 92, 246, 0.2) 50%, 
                    transparent 70%)`
                }}
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    {viewMode === 'timeline' ? (
                      <>
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        Quantum Timeline
                      </>
                    ) : (
                      <>
                        <Activity className="h-5 w-5 text-blue-400" />
                        Contribution Network
                      </>
                    )}
                  </h3>
                  
                  <div className="group relative">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Shield className="h-4 w-4" />
                    </button>
                    
                    {/* Briefing Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 left-6 top-0 w-80 glass-card border border-white/20 p-4 rounded-lg backdrop-blur-md">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        Quantum Timeline Briefing
                      </h4>
                      <p className="text-gray-300 text-sm mb-3">
                        {viewMode === 'timeline' ? 
                          'The Quantum Timeline visualizes your contribution journey as a neural network. Each node represents a milestone, connected by quantum entanglements showing your development path through the Avalanche ecosystem.' :
                          'The Contribution Network displays your activity patterns as interconnected nodes, revealing collaboration clusters and project relationships across time dimensions.'
                        }
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-gray-400">Active Neural Node</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-blue-400"></div>
                          <span className="text-gray-400">Quantum Connection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                          <span className="text-gray-400">Current Position</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                  {viewMode === 'timeline' ? 'Neural Path' : 'Node Graph'}
                </Badge>
              </div>
              
              <div className="relative">
                {viewMode === 'timeline' ? (
                  <canvas
                    ref={canvasRef}
                    className="w-full h-80 rounded-lg cursor-pointer"
                    style={{ background: 'transparent' }}
                    onMouseMove={(e) => {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      
                      const rect = canvas.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      // Check if hovering over a node
                      const centerX = canvas.width / (2 * window.devicePixelRatio);
                      const centerY = canvas.height / (2 * window.devicePixelRatio) + 150;
                      const radius = Math.min(canvas.width / (2 * window.devicePixelRatio) * 0.8, 400);
                      
                      data.forEach((item, index) => {
                        const t = index / Math.max(data.length - 1, 1);
                        const angle = t * 2 * Math.PI * 2;
                        const r = radius * (0.3 + t * 0.7);
                        const nodeX = centerX + Math.cos(angle) * r;
                        const nodeY = centerY + Math.sin(angle) * r;
                        
                        const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
                        
                        if (distance < 15) {
                          setHoveredElement({
                            type: 'node',
                            position: { x: e.clientX, y: e.clientY },
                            description: `Neural Node: ${item.time} - Contains ${item.steps?.length || 0} quantum milestones. This node represents a significant evolution point in your development journey.`
                          });
                          return;
                        }
                      });
                      
                      // If not hovering over anything specific, clear hover
                      setHoveredElement(null);
                    }}
                    onMouseLeave={() => setHoveredElement(null)}
                  />
                ) : (
                  <canvas
                    ref={contributionCanvasRef}
                    className="w-full h-80 rounded-lg cursor-pointer"
                    style={{ background: 'transparent' }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      // Simple hover detection for contribution network
                      setHoveredElement({
                        type: 'node',
                        position: { x: e.clientX, y: e.clientY },
                        description: `Contribution Network Node - This represents activity clusters and collaboration patterns across your project ecosystem.`
                      });
                    }}
                    onMouseLeave={() => setHoveredElement(null)}
                  />
                )}
                
                {/* Interactive Tooltip */}
                {hoveredElement && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed z-50 glass-card border border-white/20 p-3 rounded-lg max-w-xs backdrop-blur-md pointer-events-none"
                    style={{
                      left: hoveredElement.position.x + 10,
                      top: hoveredElement.position.y - 10,
                      transform: 'translateY(-100%)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {hoveredElement.type === 'node' && <Sparkles className="h-4 w-4 text-purple-400" />}
                      {hoveredElement.type === 'connection' && <Activity className="h-4 w-4 text-blue-400" />}
                      {hoveredElement.type === 'particle' && <Zap className="h-4 w-4 text-yellow-400" />}
                      <span className="text-white font-medium text-sm capitalize">{hoveredElement.type}</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {hoveredElement.description}
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Advanced Timeline Navigation */}
              {viewMode === 'timeline' && data.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 glass-base px-4 py-3 rounded-full border border-white/20 backdrop-blur-md">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateStep('prev')}
                      className="h-8 w-8 p-0 hover:bg-white/10 rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2 px-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse" />
                      <span className="text-sm text-white font-medium">
                        {data.findIndex(item => item.time === activeStep.time) + 1} / {data.length}
                      </span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateStep('next')}
                      className="h-8 w-8 p-0 hover:bg-white/10 rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Comprehensive Quantum Timeline Briefing Panel */}
              {viewMode === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  {/* Main Briefing Section */}
                  <div className="glass-base p-4 rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-medium flex items-center gap-2 text-sm">
                          <Rocket className="h-4 w-4 text-purple-400" />
                          Neural Architecture
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Each contribution creates a neural pathway in your quantum development matrix. The spiral pattern represents evolutionary growth through complexity layers, with each rotation signifying increased mastery.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white font-medium flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-blue-400" />
                          Quantum Entanglement
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Connections between nodes show how your contributions influence each other across temporal dimensions, creating quantum entanglements that strengthen your development ecosystem.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white font-medium flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          Evolution Tracking
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Pulsing effects and orbiting particles indicate active development phases. The quantum energy signatures reveal your current focus areas and evolutionary momentum.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Legend */}
                  <div className="glass-base p-4 rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-cyan-400" />
                      Quantum Legend & Navigation Guide
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Visual Elements */}
                      <div>
                        <h5 className="text-sm font-medium text-cyan-300 mb-2">Visual Elements</h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                            <span className="text-gray-400">Active Neural Node - Currently selected milestone</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-600 opacity-70"></div>
                            <span className="text-gray-400">Inactive Neural Node - Available milestone</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                            <span className="text-gray-400">Quantum Connection - Temporal influence link</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-gray-400">Quantum Particles - Active energy signatures</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Controls */}
                      <div>
                        <h5 className="text-sm font-medium text-cyan-300 mb-2">Navigation Controls</h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-white">Click</kbd>
                            <span className="text-gray-400">Select neural node to explore milestone</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-white">Hover</kbd>
                            <span className="text-gray-400">Reveal quantum information tooltip</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-white">◄ ►</kbd>
                            <span className="text-gray-400">Navigate through timeline sequence</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-white">Auto</kbd>
                            <span className="text-gray-400">Activate quantum evolution playback</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-base p-4 rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-400" />
                        Quantum Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Neural Nodes:</span>
                          <span className="text-green-400 font-medium">{data.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantum Links:</span>
                          <span className="text-blue-400 font-medium">{Math.max(data.length - 1, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Evolution State:</span>
                          <span className="text-purple-400 font-medium">{data.length > 0 ? 'Active' : 'Dormant'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantum Level:</span>
                          <span className="text-yellow-400 font-medium">L{Math.min(Math.floor(data.length / 3) + 1, 10)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-base p-4 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-amber-400" />
                        Current Status
                      </h4>
                      <div className="space-y-2 text-xs">
                        {data.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Active Node:</span>
                              <span className="text-amber-400 font-medium">{activeStep.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Progress:</span>
                              <span className="text-green-400 font-medium">
                                {Math.round((data.findIndex(item => item.time === activeStep.time) + 1) / data.length * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Energy Level:</span>
                              <span className="text-blue-400 font-medium">Quantum Active</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-2">
                            <div className="text-gray-500">Quantum Timeline Initializing...</div>
                            <div className="text-xs text-gray-600 mt-1">Create your first contribution to activate</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Details Panel */}
        <div className="space-y-4">
          {viewMode === 'timeline' && currentStep ? (
            <Card className="glass-card border-white/20 overflow-hidden">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeStep.time}-${activeStep.stepIndex}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    {/* Enhanced Step Header */}
                    <div className="flex items-center gap-3 mb-4 relative">
                      <div className="relative p-3 rounded-xl glass-base border border-blue-500/30 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                        <div className="relative z-10">
                          {currentStep.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          {activeStep.time}
                        </h3>
                        {currentStep.date && (
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {currentStep.date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="mb-6 p-4 rounded-lg glass-base border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                      <p className="text-gray-300 leading-relaxed">
                        {currentStep.content}
                      </p>
                    </div>

                    {/* Achievement Showcase */}
                    {currentStep.achievement && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-4 p-4 rounded-lg glass-base border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">Achievement Unlocked</span>
                        </div>
                        <p className="text-white font-medium">{currentStep.achievement}</p>
                      </motion.div>
                    )}

                    {/* Enhanced Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentStep.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(currentStep.difficulty)} backdrop-blur-sm`}>
                          <Target className="h-3 w-3 mr-1" />
                          {currentStep.difficulty}
                        </Badge>
                      )}
                      {currentStep.category && (
                        <Badge variant="outline" className="text-xs backdrop-blur-sm border-white/20">
                          <Code2 className="h-3 w-3 mr-1" />
                          {currentStep.category}
                        </Badge>
                      )}
                      {currentStep.reward && (
                        <Badge className="text-xs text-amber-400 border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm">
                          <Zap className="h-3 w-3 mr-1" />
                          {currentStep.reward}
                        </Badge>
                      )}
                    </div>

                    {/* Enhanced Stats Grid */}
                    {currentStep.stats && (
                      <div className="grid grid-cols-3 gap-3">
                        {currentStep.stats.commits && (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-3 glass-base rounded-lg border border-white/10 bg-gradient-to-b from-green-500/10 to-transparent"
                          >
                            <GitCommit className="h-5 w-5 text-green-400 mx-auto mb-2" />
                            <div className="text-white font-bold">{currentStep.stats.commits}</div>
                            <div className="text-gray-400 text-xs">Commits</div>
                          </motion.div>
                        )}
                        {currentStep.stats.impact && (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-3 glass-base rounded-lg border border-white/10 bg-gradient-to-b from-blue-500/10 to-transparent"
                          >
                            <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                            <div className="text-white font-bold">{currentStep.stats.impact}%</div>
                            <div className="text-gray-400 text-xs">Impact</div>
                          </motion.div>
                        )}
                        {currentStep.stats.collaborators && (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-3 glass-base rounded-lg border border-white/10 bg-gradient-to-b from-purple-500/10 to-transparent"
                          >
                            <Users className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                            <div className="text-white font-bold">{currentStep.stats.collaborators}</div>
                            <div className="text-gray-400 text-xs">Collabs</div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          ) : (
            /* Network View Stats */
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  {selectedYear} Network Analysis
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 glass-base rounded-lg border border-white/10 bg-gradient-to-b from-blue-500/10 to-transparent"
                    >
                      <div className="text-2xl font-bold text-blue-400">
                        {contributionData.length}
                      </div>
                      <div className="text-gray-400 text-sm">Total Nodes</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 glass-base rounded-lg border border-white/10 bg-gradient-to-b from-green-500/10 to-transparent"
                    >
                      <div className="text-2xl font-bold text-green-400">
                        {contributionData.reduce((sum, node) => sum + node.value, 0)}
                      </div>
                      <div className="text-gray-400 text-sm">Total Value</div>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-3">
                    {['commit', 'review', 'bounty', 'milestone', 'security'].map((category) => {
                      const count = contributionData.filter(n => n.category === category).length;
                      const percentage = (count / contributionData.length) * 100;
                      
                      return (
                        <div key={category} className="p-3 glass-base rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white capitalize font-medium">{category}</span>
                            <span className="text-gray-400 text-sm">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Timeline Items List */}
          {viewMode === 'timeline' && (
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Quantum Steps
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {data.map((item) => (
                    item.steps.map((step, stepIndex) => (
                      <motion.button
                        key={`${item.time}-${stepIndex}`}
                        onClick={() => handleStepClick(item.time, stepIndex)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                          activeStep.time === item.time && activeStep.stepIndex === stepIndex
                            ? 'glass-card border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                            : 'hover:bg-white/5 hover:border-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                            activeStep.time === item.time && activeStep.stepIndex === stepIndex
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : 'bg-white/5'
                          }`}>
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium text-sm">{item.time}</span>
                              {step.reward && (
                                <Badge className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                                  {step.reward}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                              {step.content}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedTimeline;