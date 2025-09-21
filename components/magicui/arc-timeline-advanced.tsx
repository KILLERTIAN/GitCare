"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Calendar, Award, TrendingUp, GitCommit, 
  Star, Zap, Filter, BarChart3, Activity, Target, Users, Clock
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

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub-style contribution levels
  details?: string[];
}

interface ArcTimelineProps {
  data: ArcTimelineItem[];
  defaultActiveStep?: { time: string; stepIndex: number };
  className?: string;
}

// Generate deterministic contribution graph data for the last 12 months
const generateContributionData = (year: number): ContributionDay[] => {
  const data: ContributionDay[] = [];
  const baseDate = new Date(year, 0, 1); // Start of the year
  const endDate = new Date(year, 11, 31); // End of the year
  
  // Use a simple seed-based pseudo-random function for consistent results
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const currentDate = new Date(baseDate);
  let dayCounter = 0;
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Use date as seed for consistent random values
    const seed = currentDate.getTime() / (1000 * 60 * 60 * 24);
    const randomFactor = seededRandom(seed);
    
    // Less activity on weekends
    const baseActivity = isWeekend ? 0.2 : 0.6;
    
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    
    if (randomFactor < baseActivity) {
      // Use another seeded random for count
      const countRandom = seededRandom(seed + 1);
      count = Math.floor(countRandom * 12) + 1;
      
      if (count >= 1 && count <= 2) level = 1;
      else if (count >= 3 && count <= 4) level = 2;
      else if (count >= 5 && count <= 7) level = 3;
      else level = 4;
    }
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      count,
      level,
      details: count > 0 ? [
        `${count} contributions`,
        `${Math.floor(count * 0.6)} commits`,
        `${Math.floor(count * 0.4)} reviews`
      ] : undefined
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
    dayCounter++;
  }
  
  return data;
};

export const ArcTimeline: React.FC<ArcTimelineProps> = ({
  data,
  defaultActiveStep,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [activeStep, setActiveStep] = useState(
    defaultActiveStep || { time: data[0]?.time || "", stepIndex: 0 }
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');
  
  const contributionData = useMemo(() => generateContributionData(selectedYear), [selectedYear]);
  
  // Filter data by selected year and month for timeline view
  const filteredData = useMemo(() => {
    if (viewMode === 'graph') return data;
    
    return data.filter(item => {
      const [year, period] = item.time.split(' ');
      const itemYear = parseInt(year);
      
      if (period.includes('Q')) {
        const quarter = parseInt(period.replace('Q', ''));
        const quarterMonths = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]
        ][quarter - 1];
        return itemYear === selectedYear && quarterMonths.includes(selectedMonth);
      } else {
        // Handle month names
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const itemMonth = monthNames.indexOf(period);
        return itemYear === selectedYear && (itemMonth === selectedMonth || itemMonth === -1);
      }
    });
  }, [data, selectedYear, selectedMonth, viewMode]);

  // Separate useEffect for handling dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Separate useEffect for drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || filteredData.length === 0) return;

    const drawArc = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      if (viewMode === 'timeline') {
        drawTimelineArc(ctx);
      } else {
        drawContributionGraph(ctx);
      }
    };

    const drawTimelineArc = (ctx: CanvasRenderingContext2D) => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height - 50;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
      
      // Draw main arc
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      
      // Draw progress arc
      const activeIndex = filteredData.findIndex(item => item.time === activeStep.time);
      if (activeIndex >= 0) {
        const progress = activeIndex / Math.max(filteredData.length - 1, 1);
        const startAngle = Math.PI * 0.15;
        const endAngle = startAngle + (Math.PI * 0.7 * progress);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
      }
      
      // Draw points
      filteredData.forEach((item, index) => {
        const angle = Math.PI * 0.15 + (Math.PI * 0.7 * index / Math.max(filteredData.length - 1, 1));
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = item.time === activeStep.time ? 
          'rgba(59, 130, 246, 1)' : 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = item.time === activeStep.time ? 
          'rgba(255, 255, 255, 1)' : 'rgba(59, 130, 246, 0.6)';
        ctx.fill();
        
        // Glow effect for active step
        if (item.time === activeStep.time) {
          ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };

    const drawContributionGraph = (ctx: CanvasRenderingContext2D) => {
      const cellSize = 11;
      const cellPadding = 3;
      const startX = 50;
      const startY = 60;
      const cornerRadius = 2;
      
      // Clear canvas with subtle background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Create rounded rectangle function
      const roundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Group by weeks starting from Sunday
      const weeks: ContributionDay[][] = [];
      let currentWeek: ContributionDay[] = [];
      
      // Start from the first Sunday of the year or before
      const firstDay = new Date(selectedYear, 0, 1);
      const firstSunday = new Date(firstDay);
      firstSunday.setDate(firstDay.getDate() - firstDay.getDay());
      
      for (let d = new Date(firstSunday); d.getFullYear() <= selectedYear; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0 && currentWeek.length > 0) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
        
        const dateStr = d.toISOString().split('T')[0];
        const dayData = contributionData.find(day => day.date === dateStr) || {
          date: dateStr,
          count: 0,
          level: 0 as const
        };
        
        if (d.getFullYear() === selectedYear) {
          currentWeek.push(dayData);
        }
        
        if (d.getFullYear() > selectedYear && d.getMonth() === 0 && d.getDate() === 7) break;
      }
      
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      
      // Draw title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(`${selectedYear} Contribution Activity`, startX, 30);
      
      // Draw month labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      monthLabels.forEach((month, index) => {
        const weeksPerMonth = 52 / 12;
        const x = startX + (index * weeksPerMonth) * (cellSize + cellPadding);
        ctx.fillText(month, x, startY - 15);
      });
      
      // Draw day labels
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      dayLabels.forEach((day, index) => {
        if (index % 2 === 1) { // Show Mon, Wed, Fri
          const y = startY + (index * (cellSize + cellPadding)) + (cellSize / 2) + 4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.fillText(day, startX - 20, y);
        }
      });
      
      // Enhanced color palette with better contrast
      const colors = [
        'rgba(30, 41, 59, 0.8)',      // No contributions - darker slate
        'rgba(6, 182, 212, 0.3)',     // Low - cyan
        'rgba(6, 182, 212, 0.5)',     // Medium-low - cyan
        'rgba(6, 182, 212, 0.7)',     // Medium-high - cyan
        'rgba(6, 182, 212, 1)'        // High - full cyan
      ];
      
      // Draw contribution squares with rounded corners and hover effects
      weeks.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
          const x = startX + weekIndex * (cellSize + cellPadding);
          const y = startY + dayIndex * (cellSize + cellPadding);
          
          // Draw rounded rectangle
          roundedRect(x, y, cellSize, cellSize, cornerRadius);
          ctx.fillStyle = colors[day.level];
          ctx.fill();
          
          // Add subtle border with gradient effect
          ctx.strokeStyle = day.level > 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Add glow effect for high activity days
          if (day.level >= 3) {
            ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
            ctx.shadowBlur = 4;
            roundedRect(x, y, cellSize, cellSize, cornerRadius);
            ctx.fillStyle = colors[day.level];
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
      
      // Enhanced legend with better styling
      const legendY = startY + 8 * (cellSize + cellPadding) + 30;
      const legendStartX = startX + (weeks.length * (cellSize + cellPadding)) - 150;
      
      // Legend background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      roundedRect(legendStartX - 10, legendY - 25, 160, 35, 8);
      ctx.fill();
      
      // Legend text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Less', legendStartX, legendY - 5);
      
      // Legend squares
      for (let i = 0; i < 5; i++) {
        const x = legendStartX + 25 + i * (cellSize + cellPadding);
        const y = legendY - 15;
        
        roundedRect(x, y, cellSize, cellSize, cornerRadius);
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('More', legendStartX + 25 + 5 * (cellSize + cellPadding) + 8, legendY - 5);
    };

    drawArc();
  }, [dimensions, activeStep, filteredData, viewMode, selectedYear, contributionData]);

  const handleStepClick = (time: string, stepIndex: number) => {
    setActiveStep({ time, stepIndex });
  };

  const navigateStep = (direction: 'prev' | 'next') => {
    const allSteps: Array<{ time: string; stepIndex: number }> = [];
    filteredData.forEach(item => {
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

  const currentItem = filteredData.find(item => item.time === activeStep.time);
  const currentStep = currentItem?.steps[activeStep.stepIndex];

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setViewMode(viewMode === 'timeline' ? 'graph' : 'timeline')}
            variant="outline"
            className="glass-base border-white/20"
          >
            {viewMode === 'timeline' ? <BarChart3 className="h-4 w-4 mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
            {viewMode === 'timeline' ? 'Contribution Graph' : 'Timeline View'}
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
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/20 p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-80 rounded-lg"
                style={{ background: 'transparent' }}
              />
              
              {/* Timeline Navigation */}
              {viewMode === 'timeline' && filteredData.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 glass-base px-3 py-2 rounded-full border border-white/20">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateStep('prev')}
                      className="h-8 w-8 p-0 hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-white px-2">
                      {filteredData.findIndex(item => item.time === activeStep.time) + 1} / {filteredData.length}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigateStep('next')}
                      className="h-8 w-8 p-0 hover:bg-white/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {viewMode === 'timeline' && currentStep ? (
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeStep.time}-${activeStep.stepIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Icon and Time */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg glass-base border border-blue-500/30">
                        {currentStep.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{activeStep.time}</h3>
                        {currentStep.date && (
                          <p className="text-gray-400 text-sm">{currentStep.date}</p>
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {currentStep.content}
                    </p>

                    {/* Achievement */}
                    {currentStep.achievement && (
                      <div className="mb-4 p-3 rounded-lg glass-base border border-yellow-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium text-sm">Achievement</span>
                        </div>
                        <p className="text-white text-sm">{currentStep.achievement}</p>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentStep.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(currentStep.difficulty)}`}>
                          {currentStep.difficulty}
                        </Badge>
                      )}
                      {currentStep.category && (
                        <Badge variant="outline" className="text-xs">
                          {currentStep.category}
                        </Badge>
                      )}
                      {currentStep.reward && (
                        <Badge className="text-xs text-amber-400 border-amber-500/30 bg-amber-500/20">
                          {currentStep.reward}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    {currentStep.stats && (
                      <div className="grid grid-cols-3 gap-3">
                        {currentStep.stats.commits && (
                          <div className="text-center p-2 glass-base rounded-lg border border-white/10">
                            <GitCommit className="h-4 w-4 text-green-400 mx-auto mb-1" />
                            <div className="text-white font-bold text-sm">{currentStep.stats.commits}</div>
                            <div className="text-gray-400 text-xs">Commits</div>
                          </div>
                        )}
                        {currentStep.stats.impact && (
                          <div className="text-center p-2 glass-base rounded-lg border border-white/10">
                            <TrendingUp className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                            <div className="text-white font-bold text-sm">{currentStep.stats.impact}%</div>
                            <div className="text-gray-400 text-xs">Impact</div>
                          </div>
                        )}
                        {currentStep.stats.collaborators && (
                          <div className="text-center p-2 glass-base rounded-lg border border-white/10">
                            <Users className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                            <div className="text-white font-bold text-sm">{currentStep.stats.collaborators}</div>
                            <div className="text-gray-400 text-xs">Collabs</div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          ) : (
            /* Contribution Graph Stats */
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  {selectedYear} Contributions
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 glass-base rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-green-400">
                        {contributionData.filter(d => new Date(d.date).getFullYear() === selectedYear && d.count > 0).length}
                      </div>
                      <div className="text-gray-400 text-sm">Active Days</div>
                    </div>
                    <div className="text-center p-3 glass-base rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-blue-400">
                        {contributionData
                          .filter(d => new Date(d.date).getFullYear() === selectedYear)
                          .reduce((sum, d) => sum + d.count, 0)}
                      </div>
                      <div className="text-gray-400 text-sm">Total</div>
                    </div>
                  </div>
                  
                  <div className="p-3 glass-base rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Current Streak</span>
                      <span className="text-white font-bold">23 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Longest Streak</span>
                      <span className="text-white font-bold">127 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Items List */}
          {viewMode === 'timeline' && (
            <Card className="glass-card border-white/20">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Timeline Items
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredData.map((item) => (
                    item.steps.map((step, stepIndex) => (
                      <button
                        key={`${item.time}-${stepIndex}`}
                        onClick={() => handleStepClick(item.time, stepIndex)}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          activeStep.time === item.time && activeStep.stepIndex === stepIndex
                            ? 'glass-card border border-blue-500/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 flex items-center justify-center">
                            {step.icon}
                          </div>
                          <span className="text-white font-medium text-sm">{item.time}</span>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2 ml-8">
                          {step.content}
                        </p>
                      </button>
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

export default ArcTimeline;