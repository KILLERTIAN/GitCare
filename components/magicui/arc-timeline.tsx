"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ArcTimelineStep {
  icon: React.ReactNode;
  content: string;
}

export interface ArcTimelineItem {
  time: string;
  steps: ArcTimelineStep[];
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

  // Calculate total steps
  const totalSteps = data.reduce((acc, item) => acc + item.steps.length, 0);
  
  // Find current active item and step
  const activeItemIndex = data.findIndex(item => item.time === activeStep.time);
  const activeItem = data[activeItemIndex] || data[0];
  const activeStepData = activeItem?.steps[activeStep.stepIndex] || activeItem?.steps[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawArc();
    };

    const drawArc = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height + 200; // Position arc below visible area
      const radius = arcConfig.circleWidth / 2;
      
      // Draw main arc
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI * 0.8, Math.PI * 0.2, true);
      ctx.stroke();

      // Draw active arc segment
      ctx.strokeStyle = "rgba(147, 128, 255, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let currentStepCount = 0;
      for (let i = 0; i <= activeItemIndex; i++) {
        if (i === activeItemIndex) {
          currentStepCount += activeStep.stepIndex + 1;
        } else {
          currentStepCount += data[i].steps.length;
        }
      }
      
      const progressRatio = currentStepCount / totalSteps;
      const startAngle = Math.PI * 0.8;
      const endAngle = startAngle + (Math.PI * 0.6 * progressRatio);
      
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.stroke();

      // Draw step markers
      let stepCount = 0;
      data.forEach((item, itemIndex) => {
        item.steps.forEach((step, stepIndex) => {
          const angle = Math.PI * 0.8 + (Math.PI * 0.6 * stepCount / totalSteps);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          const isActive = itemIndex === activeItemIndex && stepIndex === activeStep.stepIndex;
          
          ctx.beginPath();
          ctx.arc(x, y, isActive ? 8 : 6, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? "#9f80ff" : stepCount < currentStepCount ? "#6b7280" : "rgba(255, 255, 255, 0.3)";
          ctx.fill();
          
          if (isActive) {
            ctx.strokeStyle = "#d4d4d4";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          
          stepCount++;
        });
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [data, activeStep, dimensions.width, dimensions.height, arcConfig, totalSteps]);

  const handleStepClick = (timeString: string, stepIndex: number) => {
    setActiveStep({ time: timeString, stepIndex });
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Canvas for the arc */}
      <div className="relative h-64 mb-8">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Timeline content */}
      <div className="flex flex-col items-center">
        {/* Time periods navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {data.map((item, itemIndex) => (
            <div key={item.time} className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(item.time, 0)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeItemIndex === itemIndex
                    ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300"
                }`}
              >
                {item.time}
              </button>
              
              {/* Step indicators for each time period */}
              <div className="flex gap-2 mt-2">
                {item.steps.map((_, stepIndex) => (
                  <button
                    key={stepIndex}
                    onClick={() => handleStepClick(item.time, stepIndex)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeItemIndex === itemIndex && activeStep.stepIndex === stepIndex
                        ? "bg-purple-500 scale-125"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeStep.time}-${activeStep.stepIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-600/20 border border-purple-500/30">
                  {activeStepData?.icon}
                </div>
              </div>
              
              <div className="text-sm font-medium text-purple-300 mb-2">
                {activeStep.time}
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                {activeStepData?.content}
              </p>
              
              {/* Navigation arrows */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    let newItemIndex = activeItemIndex;
                    let newStepIndex = activeStep.stepIndex - 1;
                    
                    if (newStepIndex < 0 && newItemIndex > 0) {
                      newItemIndex--;
                      newStepIndex = data[newItemIndex].steps.length - 1;
                    }
                    
                    if (newStepIndex >= 0) {
                      handleStepClick(data[newItemIndex].time, newStepIndex);
                    }
                  }}
                  disabled={activeItemIndex === 0 && activeStep.stepIndex === 0}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  ← Previous
                </button>
                
                <button
                  onClick={() => {
                    let newItemIndex = activeItemIndex;
                    let newStepIndex = activeStep.stepIndex + 1;
                    
                    if (newStepIndex >= data[newItemIndex].steps.length && newItemIndex < data.length - 1) {
                      newItemIndex++;
                      newStepIndex = 0;
                    }
                    
                    if (newItemIndex < data.length && newStepIndex < data[newItemIndex].steps.length) {
                      handleStepClick(data[newItemIndex].time, newStepIndex);
                    }
                  }}
                  disabled={
                    activeItemIndex === data.length - 1 && 
                    activeStep.stepIndex === data[data.length - 1].steps.length - 1
                  }
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { ArcTimeline as ArcTimelineItem };