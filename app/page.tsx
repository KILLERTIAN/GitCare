'use client';

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { ProjectDiscovery } from '@/components/section/ProjectDiscovery';
import { RewardsBounties } from '@/components/section/RewardsBounties';
import { SkillGraph } from '@/components/section/SkillGraph';
import { Leaderboard } from '@/components/section/LeaderBoard';

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ProjectDiscovery />
        <RewardsBounties />
        <SkillGraph />
        <Footer />
      </div>
    </div>
  );
}
