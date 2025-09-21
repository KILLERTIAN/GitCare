"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Award, TrendingUp, GitCommit, Star, Zap } from "lucide-react";

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
  totalReward?: string;
  description?: string;
}

interface ArcTimelineProps {
  data: ArcTimelineItem[];
  defaultActiveStep?: { time: string; stepIndex: number };
  arcConfig?: {
    circleWidth: number;
    angleBetweenMinorSteps: number;
    lineCountFillBetweenSteps: number;
    boundaryPlaceholderLinesCount: number;
  };
  className?: string;
}

export function ArcTimeline({
  data,
  defaultActiveStep,
  arcConfig = {
    circleWidth: 4500,
    angleBetweenMinorSteps: 0.4,
    lineCountFillBetweenSteps: 8,
    boundaryPlaceholderLinesCount: 50,
  },
  className = "",
}: ArcTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(defaultActiveStep || { time: data[0]?.time || "", stepIndex: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<{ time: string; stepIndex: number } | null>(null);

  // Calculate total steps
  const totalSteps = data.reduce((acc, item) => acc + item.steps.length, 0);
  
  // Find current active item and step
  const activeItemIndex = data.findIndex(item => item.time === activeStep.time);
  const activeItem = data[activeItemIndex] || data[0];
  const activeStepData = activeItem?.steps[activeStep.stepIndex] || activeItem?.steps[0];

  // Handle initial canvas setup and resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      let newItemIndex = activeItemIndex;
      let newStepIndex = activeStep.stepIndex + 1;
      
      if (newStepIndex >= data[newItemIndex].steps.length) {
        if (newItemIndex < data.length - 1) {
          newItemIndex++;
          newStepIndex = 0;
        } else {
          setIsAutoPlaying(false);
          return;
        }
      }
      
      setActiveStep({ time: data[newItemIndex].time, stepIndex: newStepIndex });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeStep, activeItemIndex, data]);

  // Handle canvas drawing with enhanced visuals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const drawArc = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height + 150;
      const radius = Math.min(dimensions.width * 0.8, 400);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.05)");
      gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.05)");
      gradient.addColorStop(1, "rgba(236, 72, 153, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Main arc with glow effect
      ctx.shadowColor = "rgba(147, 51, 234, 0.3)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 0.25, true);
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Progress arc with animated gradient
      let currentStepCount = 0;
      for (let i = 0; i <= activeItemIndex; i++) {
        if (i === activeItemIndex) {
          currentStepCount += activeStep.stepIndex + 1;
        } else {
          currentStepCount += data[i].steps.length;
        }
      }
      
      const progressRatio = currentStepCount / totalSteps;
      const startAngle = Math.PI * 0.75;
      const endAngle = startAngle + (Math.PI * 0.5 * progressRatio);
      
      const progressGradient = ctx.createLinearGradient(
        centerX - radius, centerY,
        centerX + radius, centerY
      );
      progressGradient.addColorStop(0, "#3b82f6");
      progressGradient.addColorStop(0.5, "#8b5cf6");
      progressGradient.addColorStop(1, "#ec4899");
      
      ctx.strokeStyle = progressGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.stroke();

      // Enhanced step markers with different styles
      let stepCount = 0;
      data.forEach((item, itemIndex) => {
        item.steps.forEach((step, stepIndex) => {
          const angle = Math.PI * 0.75 + (Math.PI * 0.5 * stepCount / totalSteps);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          const isActive = itemIndex === activeItemIndex && stepIndex === activeStep.stepIndex;
          const isCompleted = stepCount < currentStepCount;
          const isHovered = hoveredStep?.time === item.time && hoveredStep?.stepIndex === stepIndex;
          
          // Outer ring for active/hovered
          if (isActive || isHovered) {
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.strokeStyle = isActive ? "#8b5cf6" : "#6b7280";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          
          // Main marker
          ctx.beginPath();
          ctx.arc(x, y, isActive ? 8 : 6, 0, Math.PI * 2);
          
          if (isActive) {
            const activeGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
            activeGradient.addColorStop(0, "#a855f7");
            activeGradient.addColorStop(1, "#7c3aed");
            ctx.fillStyle = activeGradient;
          } else if (isCompleted) {
            ctx.fillStyle = "#22c55e";
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          }
          
          ctx.fill();
          
          // Add difficulty indicator
          if (step.difficulty) {
            const difficultyColors = {
              'Easy': '#22c55e',
              'Medium': '#f59e0b',
              'Hard': '#f97316',
              'Expert': '#dc2626'
            };
            
            ctx.beginPath();
            ctx.arc(x + 8, y - 8, 3, 0, Math.PI * 2);
            ctx.fillStyle = difficultyColors[step.difficulty];
            ctx.fill();
          }
          
          stepCount++;
        });
      });
      
      // Add sparkle effects for completed steps
      if (isAutoPlaying) {
        const time = Date.now() * 0.005;
        for (let i = 0; i < currentStepCount; i++) {
          const angle = Math.PI * 0.75 + (Math.PI * 0.5 * i / totalSteps);
          const x = centerX + Math.cos(angle) * radius + Math.sin(time + i) * 15;
          const y = centerY + Math.sin(angle) * radius + Math.cos(time + i) * 10;
          
          ctx.beginPath();
          ctx.arc(x, y, 1 + Math.sin(time * 2 + i) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
          ctx.fill();
        }
      }
    };

    drawArc();
  }, [data, activeStep, arcConfig, totalSteps, activeItemIndex, dimensions.width, dimensions.height, hoveredStep, isAutoPlaying]);

  const handleStepClick = (timeString: string, stepIndex: number) => {
    setActiveStep({ time: timeString, stepIndex });
    setIsAutoPlaying(false);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Hard': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Expert': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const navigateToStep = (direction: 'prev' | 'next') => {
    let newItemIndex = activeItemIndex;
    let newStepIndex = activeStep.stepIndex;
    
    if (direction === 'prev') {
      newStepIndex--;
      if (newStepIndex < 0 && newItemIndex > 0) {
        newItemIndex--;
        newStepIndex = data[newItemIndex].steps.length - 1;
      }
    } else {
      newStepIndex++;
      if (newStepIndex >= data[newItemIndex].steps.length && newItemIndex < data.length - 1) {
        newItemIndex++;
        newStepIndex = 0;
      }
    }
    
    if (newStepIndex >= 0 && newItemIndex >= 0 && 
        newItemIndex < data.length && newStepIndex < data[newItemIndex].steps.length) {
      handleStepClick(data[newItemIndex].time, newStepIndex);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Contribution Journey
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{totalSteps} total milestones</span>
            <span>•</span>
            <span className="text-green-400">
              {data.reduce((acc, item) => {
                let count = 0;
                for (let i = 0; i <= activeItemIndex; i++) {
                  count += i === activeItemIndex ? activeStep.stepIndex + 1 : data[i].steps.length;
                }
                return count;
              }, 0)} completed
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              isAutoPlaying
                ? "bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30"
                : "bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30"
            }`}
          >
            {isAutoPlaying ? "Pause" : "Auto Play"}
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
          </button>
        </div>
      </div>

      {/* Enhanced Canvas */}
      <div className="relative h-80 mb-8 glass-card rounded-2xl border border-white/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Progress indicator overlay */}
        <div className="absolute top-4 left-4 glass-base px-4 py-2 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400">Progress</div>
          <div className="text-lg font-bold text-white">
            {Math.round((data.reduce((acc, item, i) => {
              return acc + (i < activeItemIndex ? item.steps.length : 
                           i === activeItemIndex ? activeStep.stepIndex + 1 : 0);
            }, 0) / totalSteps) * 100)}%
          </div>
        </div>

        {/* Current period indicator */}
        <div className="absolute top-4 right-4 glass-base px-4 py-2 rounded-lg border border-white/10">
          <div className="text-sm text-gray-400">Current Period</div>
          <div className="text-lg font-bold text-purple-400">{activeStep.time}</div>
        </div>
      </div>

      {/* Enhanced Time Periods Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {data.map((item, itemIndex) => {
          const isActive = activeItemIndex === itemIndex;
          const completedSteps = itemIndex < activeItemIndex 
            ? item.steps.length 
            : itemIndex === activeItemIndex 
              ? activeStep.stepIndex + 1 
              : 0;
          
          return (
            <motion.div
              key={item.time}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glass-card p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                isActive 
                  ? "border-purple-500/50 bg-purple-600/20" 
                  : "border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
              onClick={() => handleStepClick(item.time, 0)}
            >
              <div className="text-center">
                <div className={`text-lg font-bold mb-2 ${isActive ? "text-purple-300" : "text-white"}`}>
                  {item.time}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-400 mb-3">{item.description}</div>
                )}
                
                {/* Progress bar for this period */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{completedSteps}/{item.steps.length}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedSteps / item.steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                
                {item.totalReward && (
                  <div className="text-amber-400 text-sm font-medium">
                    {item.totalReward}
                  </div>
                )}
                
                {/* Step indicators */}
                <div className="flex justify-center gap-1 mt-3">
                  {item.steps.map((step, stepIndex) => (
                    <button
                      key={stepIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepClick(item.time, stepIndex);
                      }}
                      onMouseEnter={() => setHoveredStep({ time: item.time, stepIndex })}
                      onMouseLeave={() => setHoveredStep(null)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        itemIndex === activeItemIndex && activeStep.stepIndex === stepIndex
                          ? "bg-purple-500 scale-150"
                          : completedSteps > stepIndex
                            ? "bg-green-500"
                            : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Active Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStep.time}-${activeStep.stepIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30">
                    {activeStepData?.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-purple-300 bg-purple-600/20 px-3 py-1 rounded-full">
                        {activeStep.time}
                      </span>
                      {activeStepData?.difficulty && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyColor(activeStepData.difficulty)}`}>
                          {activeStepData.difficulty}
                        </span>
                      )}
                      {activeStepData?.category && (
                        <span className="text-xs text-gray-400 bg-gray-600/20 px-2 py-1 rounded-full">
                          {activeStepData.category}
                        </span>
                      )}
                    </div>
                    
                    {activeStepData?.achievement && (
                      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-400" />
                        {activeStepData.achievement}
                      </h4>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {activeStepData?.content}
                </p>
                
                {/* Stats */}
                {activeStepData?.stats && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {activeStepData.stats.commits && (
                      <div className="text-center p-3 glass-base rounded-lg border border-white/5">
                        <GitCommit className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{activeStepData.stats.commits}</div>
                        <div className="text-xs text-gray-400">Commits</div>
                      </div>
                    )}
                    {activeStepData.stats.impact && (
                      <div className="text-center p-3 glass-base rounded-lg border border-white/5">
                        <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{activeStepData.stats.impact}%</div>
                        <div className="text-xs text-gray-400">Impact</div>
                      </div>
                    )}
                    {activeStepData.stats.collaborators && (
                      <div className="text-center p-3 glass-base rounded-lg border border-white/5">
                        <Star className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{activeStepData.stats.collaborators}</div>
                        <div className="text-xs text-gray-400">Collaborators</div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Reward */}
                {activeStepData?.reward && (
                  <div className="glass-base p-4 rounded-lg border border-amber-500/30 bg-amber-600/10 mb-6">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-amber-400" />
                      <div>
                        <div className="text-sm text-amber-300">Reward Earned</div>
                        <div className="text-lg font-bold text-amber-400">{activeStepData.reward}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeStepData?.date && (
                  <div className="text-sm text-gray-400 mb-4">
                    Completed on {activeStepData.date}
                  </div>
                )}
                
                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigateToStep('prev')}
                    disabled={activeItemIndex === 0 && activeStep.stepIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="text-sm text-gray-400">
                    Step {data.reduce((acc, item, i) => acc + (i < activeItemIndex ? item.steps.length : i === activeItemIndex ? activeStep.stepIndex + 1 : 0), 0)} of {totalSteps}
                  </div>
                  
                  <button
                    onClick={() => navigateToStep('next')}
                    disabled={
                      activeItemIndex === data.length - 1 && 
                      activeStep.stepIndex === data[data.length - 1].steps.length - 1
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar - Period Overview */}
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              {activeItem?.time} Overview
            </h4>
            
            {activeItem?.description && (
              <p className="text-gray-400 text-sm mb-4">{activeItem.description}</p>
            )}
            
            <div className="space-y-3">
              {activeItem?.steps.map((step, stepIndex) => (
                <motion.button
                  key={stepIndex}
                  onClick={() => handleStepClick(activeItem.time, stepIndex)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                    stepIndex === activeStep.stepIndex
                      ? "bg-purple-600/20 border border-purple-500/30"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      stepIndex === activeStep.stepIndex
                        ? "bg-purple-600/30"
                        : "bg-white/10"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      {step.achievement && (
                        <div className="text-sm font-medium text-white mb-1">
                          {step.achievement}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 line-clamp-2">
                        {step.content}
                      </div>
                      {step.reward && (
                        <div className="text-xs text-amber-400 mt-1">{step.reward}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {activeItem?.totalReward && (
              <div className="mt-4 p-3 glass-base rounded-lg border border-amber-500/30 bg-amber-600/10">
                <div className="text-sm text-amber-300">Total Period Reward</div>
                <div className="text-lg font-bold text-amber-400">{activeItem.totalReward}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ArcTimeline as ArcTimelineItem };