import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Zap, GitCommit } from "lucide-react";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

const topContributors = [
  {
    rank: 1,
    name: "Alex Chen",
    avatar: avatar1,
    xp: 15420,
    level: 31,
    contributions: 89,
  earnings: "45.2 AVAX",
    speciality: "Blockchain",
    streak: 28,
    badge: "Quantum Coder"
  },
  {
    rank: 2,
    name: "Maya Patel",
    avatar: avatar2,
    xp: 13850,
    level: 28,
    contributions: 76,
  earnings: "38.7 AVAX",
    speciality: "AI/ML",
    streak: 21,
    badge: "Neural Architect"
  },
  {
    rank: 3,
    name: "Jordan Kim",
    avatar: avatar3,
    xp: 12940,
    level: 26,
    contributions: 68,
  earnings: "32.1 AVAX",
    speciality: "Frontend",
    streak: 15,
    badge: "UI Wizard"
  }
];

const leaderboardData = [
  ...topContributors,
  {
    rank: 4,
    name: "Sarah Wilson",
    avatar: avatar1,
    xp: 11200,
    level: 23,
    contributions: 54,
  earnings: "28.5 AVAX",
    speciality: "DevOps",
    streak: 12,
    badge: "Cloud Master"
  },
  {
    rank: 5,
    name: "David Rodriguez",
    avatar: avatar2,
    xp: 10850,
    level: 22,
    contributions: 47,
  earnings: "25.3 AVAX",
    speciality: "Security",
    streak: 18,
    badge: "Crypto Guardian"
  },
  {
    rank: 6,
    name: "Lisa Zhang",
    avatar: avatar3,
    xp: 9650,
    level: 20,
    contributions: 42,
  earnings: "22.1 AVAX",
    speciality: "Mobile",
    streak: 9,
    badge: "App Innovator"
  },
  {
    rank: 7,
    name: "Mike Johnson",
    avatar: avatar1,
    xp: 8940,
    level: 18,
    contributions: 38,
  earnings: "19.7 AVAX",
    speciality: "Backend",
    streak: 14,
    badge: "API Architect"
  },
  {
    rank: 8,
    name: "Emma Thompson",
    avatar: avatar2,
    xp: 8320,
    level: 17,
    contributions: 35,
  earnings: "17.4 AVAX",
    speciality: "Design",
    streak: 6,
    badge: "UX Pioneer"
  }
];

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</div>;
};

export function Leaderboard() {
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
            Global Leaderboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate the top contributors shaping the future of open source
          </p>
        </motion.div>

        {/* Podium for Top 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center items-end gap-4 mb-12"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card w-48 h-64 relative overflow-hidden group hover:shadow-glow transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4 flex flex-col items-center justify-center h-full relative z-10">
                <Medal className="h-8 w-8 text-gray-300 mb-3 animate-pulse" />
                <img 
                  src={topContributors[1].avatar} 
                  alt={topContributors[1].name}
                  className="w-16 h-16 rounded-full border-4 border-gray-300 mb-3 shadow-glow"
                />
                <h3 className="font-bold text-lg mb-1">{topContributors[1].name}</h3>
                <Badge variant="secondary" className="mb-2 text-xs">
                  {topContributors[1].badge}
                </Badge>
                <div className="text-primary font-bold text-xl mb-1">
                  Level {topContributors[1].level}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  <div>{topContributors[1].earnings}</div>
                  <div>{topContributors[1].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-8 bg-gradient-to-t from-gray-400/30 to-gray-400/10 border-t border-gray-400/50 -mt-0" />
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card w-52 h-72 relative overflow-hidden group hover:shadow-glow transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <Crown className="h-10 w-10 text-yellow-400 mb-3 animate-bounce" />
                <img 
                  src={topContributors[0].avatar} 
                  alt={topContributors[0].name}
                  className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-3 shadow-glow animate-pulse"
                />
                <h3 className="font-bold text-xl mb-1 gradient-text">{topContributors[0].name}</h3>
                <Badge variant="default" className="mb-2 animate-pulse">
                  {topContributors[0].badge}
                </Badge>
                <div className="text-primary font-bold text-2xl mb-1">
                  Level {topContributors[0].level}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  <div className="text-primary font-semibold">{topContributors[0].earnings}</div>
                  <div>{topContributors[0].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-12 bg-gradient-to-t from-yellow-400/30 to-yellow-400/10 border-t border-yellow-400/50 -mt-0" />
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card w-44 h-56 relative overflow-hidden group hover:shadow-glow transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-3 flex flex-col items-center justify-center h-full relative z-10">
                <Award className="h-7 w-7 text-amber-600 mb-2 animate-pulse" />
                <img 
                  src={topContributors[2].avatar} 
                  alt={topContributors[2].name}
                  className="w-14 h-14 rounded-full border-4 border-amber-600 mb-2 shadow-glow"
                />
                <h3 className="font-bold text-base mb-1">{topContributors[2].name}</h3>
                <Badge variant="outline" className="mb-2 text-xs">
                  {topContributors[2].badge}
                </Badge>
                <div className="text-primary font-bold text-lg mb-1">
                  Level {topContributors[2].level}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  <div>{topContributors[2].earnings}</div>
                  <div>{topContributors[2].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-6 bg-gradient-to-t from-amber-600/30 to-amber-600/10 border-t border-amber-600/50 -mt-0" />
          </motion.div>
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((contributor, index) => (
                  <motion.div
                    key={contributor.rank}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-glass/50 ${
                      contributor.rank <= 3 ? 'bg-gradient-primary/5 border border-primary/20' : 'bg-glass/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <RankIcon rank={contributor.rank} />
                      
                      <img 
                        src={contributor.avatar} 
                        alt={contributor.name}
                        className="w-10 h-10 rounded-full border-2 border-primary/50"
                      />
                      
                      <div>
                        <div className="font-semibold">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {contributor.speciality} • {contributor.streak} day streak
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-primary font-bold">Level {contributor.level}</div>
                        <div className="text-xs text-muted-foreground">{contributor.xp.toLocaleString()} XP</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <GitCommit className="h-4 w-4" />
                          <span className="font-semibold">{contributor.contributions}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">contributions</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <Zap className="h-4 w-4" />
                          <span>{contributor.earnings}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">earned</div>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs hidden md:block">
                      {contributor.badge}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}