'use client';

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

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
      </div>
    </div>
  );
}
