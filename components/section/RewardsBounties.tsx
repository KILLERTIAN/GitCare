import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Clock, Users, Flame, Star, ArrowRight } from "lucide-react";

const bounties = [
  {
    id: 1,
    title: "Implement Zero-Knowledge Proof Verification",
    project: "Neural DeFi Protocol",
  reward: "8.5 AVAX",
    usdValue: "$20,400",
    difficulty: "Expert",
    timeEstimate: "2-3 weeks",
    applicants: 5,
    tags: ["Cryptography", "Solidity", "ZK-Proofs"],
    priority: "High",
    status: "Hot"
  },
  {
    id: 2,
    title: "Build React Native Mobile App",
    project: "Quantum Chat SDK",
  reward: "6.2 AVAX",
    usdValue: "$14,880",
    difficulty: "Advanced",
    timeEstimate: "3-4 weeks",
    applicants: 12,
    tags: ["React Native", "TypeScript", "Mobile"],
    priority: "Medium",
    status: "New"
  },
  {
    id: 3,
    title: "Create 3D Avatar System",
    project: "MetaVerse Builder",
  reward: "4.8 AVAX",
    usdValue: "$11,520",
    difficulty: "Intermediate",
    timeEstimate: "2 weeks",
    applicants: 8,
    tags: ["Three.js", "WebGL", "3D"],
    priority: "High",
    status: "Active"
  },
  {
    id: 4,
    title: "Design Analytics Dashboard UI",
    project: "Blockchain Analytics",
  reward: "3.5 AVAX",
    usdValue: "$8,400",
    difficulty: "Intermediate",
    timeEstimate: "1-2 weeks",
    applicants: 15,
    tags: ["UI/UX", "React", "D3.js"],
    priority: "Low",
    status: "Active"
  },
  {
    id: 5,
    title: "Optimize ML Model Performance",
    project: "AI Code Review Bot",
  reward: "7.1 AVAX",
    usdValue: "$17,040",
    difficulty: "Expert",
    timeEstimate: "2-3 weeks",
    applicants: 3,
    tags: ["Machine Learning", "Python", "Optimization"],
    priority: "High",
    status: "Urgent"
  },
  {
    id: 6,
    title: "Create Animation Library",
    project: "Holographic UI Kit",
  reward: "5.0 AVAX",
    usdValue: "$12,000",
    difficulty: "Advanced",
    timeEstimate: "2 weeks",
    applicants: 10,
    tags: ["CSS", "Animation", "JavaScript"],
    priority: "Medium",
    status: "Hot"
  }
];

const difficultyColors: Record<string, string> = {
  "Beginner": "text-green-400 border-green-400/30 bg-green-400/10",
  "Intermediate": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "Advanced": "text-orange-400 border-orange-400/30 bg-orange-400/10",
  "Expert": "text-red-400 border-red-400/30 bg-red-400/10"
};

const priorityColors: Record<string, string> = {
  "Low": "text-gray-400",
  "Medium": "text-yellow-400",
  "High": "text-orange-400",
  "Urgent": "text-red-400"
};

export function RewardsBounties() {
  const [filter, setFilter] = useState("All");
  
  const totalRewards = bounties.reduce((sum, bounty) => 
    sum + parseFloat(bounty.reward.replace(" AVAX", "")), 0
  );

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
            Rewards & Bounties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Earn crypto rewards by solving real-world development challenges
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary">
                {totalRewards.toFixed(1)} AVAX
              </div>
              <div className="text-sm text-muted-foreground">Total Available</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-secondary">
                {bounties.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Bounties</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-neon-pink">
                53
              </div>
              <div className="text-sm text-muted-foreground">Active Hunters</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bounty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty, index) => (
            <motion.div
              key={bounty.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="glass-card hover-lift h-full relative overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={bounty.status === "Hot" ? "destructive" : 
                            bounty.status === "New" ? "default" : 
                            bounty.status === "Urgent" ? "destructive" : "secondary"}
                    className={`animate-pulse ${bounty.status === "Urgent" ? "animate-bounce" : ""}`}
                  >
                    {bounty.status === "Hot" && <Flame className="h-3 w-3 mr-1" />}
                    {bounty.status === "Urgent" && <Star className="h-3 w-3 mr-1" />}
                    {bounty.status}
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {bounty.project}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors pr-16">
                    {bounty.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Reward */}
                  <div className="text-center p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {bounty.reward}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ {bounty.usdValue} USD
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={difficultyColors[bounty.difficulty]}>
                        {bounty.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{bounty.applicants} hunters</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{bounty.timeEstimate}</span>
                    </div>
                    
                    <div className={`flex items-center gap-1 ${priorityColors[bounty.priority]}`}>
                      <Star className="h-4 w-4" />
                      <span>{bounty.priority}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {bounty.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button variant="outline-neon" className="w-full group">
                    Apply for Bounty
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="glass-primary" size="lg">
            View All Bounties
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}