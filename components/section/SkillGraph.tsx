import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target } from "lucide-react";

const skillData = [
  { skill: "Frontend", current: 85, target: 95, label: "React, Vue, Angular" },
  { skill: "Backend", current: 75, target: 88, label: "Node.js, Python, Go" },
  { skill: "Blockchain", current: 65, target: 90, label: "Solidity, Web3, DeFi" },
  { skill: "AI/ML", current: 45, target: 80, label: "PyTorch, TensorFlow" },
  { skill: "DevOps", current: 60, target: 85, label: "Docker, K8s, AWS" },
  { skill: "Security", current: 55, target: 75, label: "Cryptography, Auditing" },
  { skill: "Mobile", current: 40, target: 70, label: "React Native, Flutter" },
  { skill: "Design", current: 50, target: 65, label: "UI/UX, Figma" }
];

const recommendations = [
  {
    id: 1,
    skill: "AI/ML",
    project: "AI Code Review Bot",
    xpGain: "+300 XP",
    difficulty: "Intermediate",
    description: "Perfect project to boost your machine learning skills"
  },
  {
    id: 2,
    skill: "Mobile",
    project: "Quantum Chat SDK",
    xpGain: "+450 XP",
    difficulty: "Advanced",
    description: "Build React Native app and level up mobile development"
  },
  {
    id: 3,
    skill: "Security",
    project: "Neural DeFi Protocol",
    xpGain: "+600 XP",
    difficulty: "Expert",
    description: "Implement zero-knowledge proofs for security mastery"
  }
];

export function SkillGraph() {
  const averageSkill = skillData.reduce((sum, skill) => sum + skill.current, 0) / skillData.length;

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
            Skill Matrix
          </h2>
          <p className="text-xl text-accessible max-w-2xl mx-auto">
            Visualize your technical expertise and discover growth opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card-primary hover-lift h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-high-contrast">
                  <Target className="h-5 w-5 text-blue-300" />
                  Your Tech Stack
                </CardTitle>
                <div className="text-sm text-medium-contrast">
                  Overall Skill Level: <span className="text-high-contrast font-semibold">{averageSkill.toFixed(1)}%</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Enhanced chart container with better background for readability */}
                <div className="h-80 p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillData}>
                      <PolarGrid 
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1}
                      />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ 
                          fontSize: 12, 
                          fill: "rgba(255, 255, 255, 0.9)",
                          fontWeight: 600
                        }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ 
                          fontSize: 10, 
                          fill: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 500
                        }}
                      />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#60a5fa"
                        fill="#60a5fa"
                        fillOpacity={0.3}
                        strokeWidth={3}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke="#a78bfa"
                        fill="#a78bfa"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        strokeDasharray="8 4"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-6 mt-4 text-sm text-medium-contrast">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-sm"></div>
                    <span className="font-medium">Current Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-purple-400 rounded-full border-dashed"></div>
                    <span className="font-medium">Target Level</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Details & Recommendations */}
          <div className="space-y-6">
            {/* Skill Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-high-contrast">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Skill Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillData.slice(0, 4).map((skill, index) => (
                      <motion.div
                        key={skill.skill}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-medium-contrast group-hover:text-high-contrast transition-colors">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-400/30 text-high-contrast">
                              {skill.current}%
                            </Badge>
                          </div>
                          <div className="text-xs text-accessible">
                            {skill.label}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-300 group-hover:text-blue-200 transition-colors text-shadow-light">
                            Target: {skill.target}%
                          </div>
                          <div className="text-xs text-accessible">
                            +{skill.target - skill.current} to go
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-high-contrast">
                    <Zap className="h-5 w-5 text-yellow-400 drop-shadow-sm" />
                    AI Recommendations
                  </CardTitle>
                  <p className="text-sm text-accessible">
                    Projects tailored to boost your weakest skills
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-gradient-to-r border-orange-400/20 hover:from-orange-500/20 hover:via-purple-500/20 hover:to-blue-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm text-medium-contrast group-hover:text-high-contrast transition-colors">
                              {rec.project}
                            </div>
                            <div className="text-xs text-accessible group-hover:text-medium-contrast transition-colors">
                              Focus: <span className="text-orange-300 font-medium text-shadow-light">{rec.skill}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default" className="text-xs bg-gradient-to-r from-orange-500/30 to-purple-500/30 border-orange-400/30 text-high-contrast hover:from-orange-500/40 hover:to-purple-500/40 transition-all">
                              {rec.xpGain}
                            </Badge>
                            <div className="text-xs text-accessible mt-1 group-hover:text-medium-contrast transition-colors">
                              {rec.difficulty}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-accessible group-hover:text-medium-contrast transition-colors">
                          {rec.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}