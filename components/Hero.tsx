// components/hero.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Zap, Target } from 'lucide-react';
import { AnimatedBeamDemo } from './AnimatedBeamDemo';
import { signIn, useSession } from 'next-auth/react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      

     

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left side - Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-medium">Decentralized Developer Ecosystem</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    The Future of
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                    Developer
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    Networking
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed max-w-2xl"
              >
                <span className="text-white font-semibold">Connect, contribute, and earn in the decentralized ecosystem.</span>
                <br /><br />
                Join the revolution where developers network through blockchain-verified contributions,
                hunt bounties with transparent rewards, and build their reputation in the Web3 space.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                {!session ? (
                  <Button
                    onClick={() => signIn('github')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg shadow-blue-500/25"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    Start Building
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg shadow-green-500/25"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 hover:bg-white text-white px-8 py-3 rounded-full text-lg backdrop-blur-sm"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Explore Bounties
                </Button>
              </motion.div>

              
            </motion.div>

            {/* Right side - Animated Beam */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="flex justify-center items-center"
            >
              <motion.div
                variants={itemVariants}
                className="w-full max-w-lg"
              >
                <AnimatedBeamDemo />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}