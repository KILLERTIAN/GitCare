'use client'

import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BountyManager } from '@/components/bounty'

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

export default function BountiesPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <BountyManager showStats={true} />
        </main>
        <Footer />
      </div>
    </div>
  )
}