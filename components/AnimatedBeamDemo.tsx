"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import React, { forwardRef, useRef } from "react";
import { Github, Wallet, Trophy, Users, Code, GitBranch, Star, Mountain } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref} className="border-blue-400/50">
            <Github className="h-6 w-6 text-blue-400" />
          </Circle>
          <Circle ref={div5Ref} className="border-purple-400/50">
            <Code className="h-6 w-6 text-purple-400" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} className="border-green-400/50">
            <GitBranch className="h-6 w-6 text-green-400" />
          </Circle>
          <Circle ref={div4Ref} className="h-16 w-16 border-orange-400/50">
            <Mountain className="h-8 w-8 text-orange-400" />
          </Circle>
          <Circle ref={div6Ref} className="border-yellow-400/50">
            <Star className="h-6 w-6 text-yellow-400" />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} className="border-red-400/50">
            <Trophy className="h-6 w-6 text-red-400" />
          </Circle>
          <Circle ref={div7Ref} className="border-cyan-400/50">
            <Users className="h-6 w-6 text-cyan-400" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        gradientStartColor="#3b82f6"
        gradientStopColor="#8b5cf6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        gradientStartColor="#10b981"
        gradientStopColor="#f59e0b"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={10}
        gradientStartColor="#ef4444"
        gradientStopColor="#8b5cf6"
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={-10}
        gradientStartColor="#8b5cf6"
        gradientStopColor="#f97316"
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={10}
        gradientStartColor="#eab308"
        gradientStopColor="#06b6d4"
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        gradientStartColor="#06b6d4"
        gradientStopColor="#8b5cf6"
        reverse
      />
    </div>
  );
}