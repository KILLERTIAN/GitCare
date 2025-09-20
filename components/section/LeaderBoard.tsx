import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Zap, GitCommit } from "lucide-react";

// Using reliable placeholder avatars from UI Avatars
const getAvatarUrl = (name: string, seed: number) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=random&color=fff&format=png&rounded=true&seed=${seed}`;

const topContributors = [
  {
    rank: 1,
    name: "Alex Chen",
    avatar: getAvatarUrl("Alex Chen", 1),
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
    avatar: getAvatarUrl("Maya Patel", 2),
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
    avatar: getAvatarUrl("Jordan Kim", 3),
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
    avatar: getAvatarUrl("Sarah Wilson", 4),
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
    avatar: getAvatarUrl("David Rodriguez", 5),
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
    avatar: getAvatarUrl("Lisa Zhang", 6),
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
    avatar: getAvatarUrl("Mike Johnson", 7),
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
    avatar: getAvatarUrl("Emma Thompson", 8),
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text text-shadow-medium">
            Global Leaderboard
          </h2>
          <p className="text-xl text-accessible max-w-2xl mx-auto">
            Celebrate the top contributors shaping the future of open source
          </p>
        </motion.div>

        {/* Podium for Top 3 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center items-end gap-6 mb-12"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card-primary w-48 h-64 relative overflow-hidden group hover-lift transition-all duration-500 border-2 border-gray-300/30">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300/15 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-300/5 to-gray-500/10" />
              <CardContent className="p-4 flex flex-col items-center justify-center h-full relative z-10">
                <Medal className="h-8 w-8 text-gray-300 mb-3 drop-shadow-lg" />
                <div className="relative mb-3">
                  <img 
                    src={topContributors[1].avatar} 
                    alt={topContributors[1].name}
                    className="w-16 h-16 rounded-full border-3 border-gray-300/80 backdrop-blur-sm shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-gray-300/30 animate-pulse" />
                </div>
                <h3 className="font-bold text-lg mb-1 text-high-contrast">{topContributors[1].name}</h3>
                <Badge className="glass-button mb-2 text-xs border-gray-300/40 text-high-contrast">
                  {topContributors[1].badge}
                </Badge>
                <div className="text-high-contrast font-bold text-xl mb-1">
                  Level {topContributors[1].level}
                </div>
                <div className="text-xs text-medium-contrast text-center">
                  <div className="font-semibold">{topContributors[1].earnings}</div>
                  <div>{topContributors[1].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-8 glass-base border-t-2 border-gray-300/50 bg-gradient-to-t from-gray-300/20 to-gray-300/5 backdrop-blur-md" />
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card-primary w-52 h-72 relative overflow-hidden group hover-lift transition-all duration-500 border-2 border-yellow-400/40 glow-blue">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-400/8 to-red-500/5" />
              <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                <Crown className="h-10 w-10 text-yellow-400 mb-3 drop-shadow-lg animate-pulse" />
                <div className="relative mb-3">
                  <img 
                    src={topContributors[0].avatar} 
                    alt={topContributors[0].name}
                    className="w-20 h-20 rounded-full border-4 border-yellow-400/90 backdrop-blur-sm shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-yellow-400/10 animate-pulse" />
                </div>
                <h3 className="font-bold text-xl mb-1 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-shadow-strong">{topContributors[0].name}</h3>
                <Badge className="glass-button-primary mb-2 border-yellow-400/50 text-high-contrast animate-pulse">
                  {topContributors[0].badge}
                </Badge>
                <div className="text-high-contrast font-bold text-2xl mb-1">
                  Level {topContributors[0].level}
                </div>
                <div className="text-sm text-medium-contrast text-center">
                  <div className="text-high-contrast font-semibold text-base">{topContributors[0].earnings}</div>
                  <div>{topContributors[0].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-12 glass-base border-t-2 border-yellow-400/60 bg-gradient-to-t from-yellow-400/25 to-yellow-400/8 backdrop-blur-md glow-blue" />
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="glass-card-primary w-44 h-56 relative overflow-hidden group hover-lift transition-all duration-500 border-2 border-amber-600/30">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-600/15 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/8 via-orange-500/5 to-red-600/3" />
              <CardContent className="p-3 flex flex-col items-center justify-center h-full relative z-10">
                <Award className="h-7 w-7 text-amber-600 mb-2 drop-shadow-lg" />
                <div className="relative mb-2">
                  <img 
                    src={topContributors[2].avatar} 
                    alt={topContributors[2].name}
                    className="w-14 h-14 rounded-full border-3 border-amber-600/80 backdrop-blur-sm shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-amber-600/30 animate-pulse" />
                </div>
                <h3 className="font-bold text-base mb-1 text-high-contrast">{topContributors[2].name}</h3>
                <Badge className="glass-button mb-2 text-xs border-amber-600/40 text-high-contrast">
                  {topContributors[2].badge}
                </Badge>
                <div className="text-high-contrast font-bold text-lg mb-1">
                  Level {topContributors[2].level}
                </div>
                <div className="text-xs text-medium-contrast text-center">
                  <div className="font-semibold">{topContributors[2].earnings}</div>
                  <div>{topContributors[2].contributions} contributions</div>
                </div>
              </CardContent>
            </Card>
            <div className="h-6 glass-base border-t-2 border-amber-600/50 bg-gradient-to-t from-amber-600/20 to-amber-600/5 backdrop-blur-md" />
          </motion.div>
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card-primary border-2 border-white/10">
            <CardHeader className="border-b border-white/10 bg-gradient-to-r from-blue-500/5 to-purple-600/5">
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-md">
                <Trophy className="h-5 w-5 text-yellow-400 drop-shadow-lg" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {leaderboardData.map((contributor, index) => {
                  const isTopThree = contributor.rank <= 3;
                  const rankColors = {
                    1: 'from-yellow-400/15 to-orange-500/10 border-yellow-400/30 hover:border-yellow-400/50',
                    2: 'from-gray-300/15 to-gray-500/10 border-gray-300/30 hover:border-gray-300/50',
                    3: 'from-amber-600/15 to-orange-600/10 border-amber-600/30 hover:border-amber-600/50'
                  };
                  
                  return (
                    <motion.div
                      key={contributor.rank}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`
                        flex items-center gap-4 p-4 mx-2 my-1 rounded-lg 
                        transition-all duration-300 cursor-pointer group
                        backdrop-blur-sm border
                        ${isTopThree 
                          ? `bg-gradient-to-r ${rankColors[contributor.rank as keyof typeof rankColors]} hover:shadow-lg hover:scale-[1.02]`
                          : 'glass-base hover:bg-white/10 border-white/10 hover:border-white/20 hover:shadow-md hover:scale-[1.01]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <RankIcon rank={contributor.rank} />
                          {isTopThree && (
                            <div className="absolute inset-0 animate-pulse opacity-50">
                              <RankIcon rank={contributor.rank} />
                            </div>
                          )}
                        </div>
                        
                        <div className="relative">
                          <img 
                            src={contributor.avatar} 
                            alt={contributor.name}
                            className={`
                              w-10 h-10 rounded-full border-2 backdrop-blur-sm shadow-lg
                              transition-all duration-300 group-hover:scale-110
                              ${isTopThree 
                                ? contributor.rank === 1 ? 'border-yellow-400/80 group-hover:border-yellow-400' 
                                : contributor.rank === 2 ? 'border-gray-300/80 group-hover:border-gray-300'
                                : 'border-amber-600/80 group-hover:border-amber-600'
                                : 'border-blue-400/50 group-hover:border-blue-400/80'
                              }
                            `}
                          />
                          {isTopThree && (
                            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-30" />
                          )}
                        </div>
                        
                        <div>
                          <div className={`font-semibold transition-colors duration-300 ${
                            isTopThree ? 'text-high-contrast' : 'text-medium-contrast group-hover:text-high-contrast'
                          }`}>
                            {contributor.name}
                          </div>
                          <div className="text-xs text-accessible group-hover:text-medium-contrast transition-colors duration-300">
                            {contributor.speciality} • {contributor.streak} day streak
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className={`font-bold transition-colors duration-300 ${
                            isTopThree 
                              ? contributor.rank === 1 ? 'text-yellow-400' 
                              : contributor.rank === 2 ? 'text-gray-300'
                              : 'text-amber-600'
                              : 'text-blue-400 group-hover:text-blue-300'
                          }`}>
                            Level {contributor.level}
                          </div>
                          <div className="text-xs text-accessible group-hover:text-medium-contrast transition-colors duration-300">
                            {contributor.xp.toLocaleString()} XP
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-medium-contrast group-hover:text-high-contrast transition-colors duration-300">
                            <GitCommit className="h-4 w-4" />
                            <span className="font-semibold">{contributor.contributions}</span>
                          </div>
                          <div className="text-xs text-accessible group-hover:text-medium-contrast transition-colors duration-300">
                            contributions
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`flex items-center gap-1 font-bold transition-colors duration-300 ${
                            isTopThree 
                              ? contributor.rank === 1 ? 'text-yellow-400 text-shadow-medium' 
                              : contributor.rank === 2 ? 'text-gray-300 text-shadow-medium'
                              : 'text-amber-600 text-shadow-medium'
                              : 'text-blue-400 group-hover:text-blue-300 text-shadow-light'
                          }`}>
                            <Zap className="h-4 w-4" />
                            <span>{contributor.earnings}</span>
                          </div>
                          <div className="text-xs text-accessible group-hover:text-medium-contrast transition-colors duration-300">
                            earned
                          </div>
                        </div>
                      </div>

                      <Badge className={`
                        text-xs hidden md:block transition-all duration-300
                        glass-button border backdrop-blur-sm
                        ${isTopThree 
                          ? contributor.rank === 1 ? 'border-yellow-400/50 text-yellow-100 group-hover:border-yellow-400' 
                          : contributor.rank === 2 ? 'border-gray-300/50 text-gray-100 group-hover:border-gray-300'
                          : 'border-amber-600/50 text-amber-100 group-hover:border-amber-600'
                          : 'border-blue-400/50 text-blue-100 group-hover:border-blue-400'
                        }
                      `}>
                        {contributor.badge}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}