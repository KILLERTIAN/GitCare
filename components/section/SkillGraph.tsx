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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
            Skill Matrix
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your Tech Stack
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Overall Skill Level: <span className="text-primary font-semibold">{averageSkill.toFixed(1)}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillData}>
                      <PolarGrid 
                        stroke="hsl(var(--border))"
                        className="opacity-30"
                      />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ 
                          fontSize: 12, 
                          fill: "hsl(var(--foreground))",
                          fontWeight: 500
                        }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ 
                          fontSize: 10, 
                          fill: "hsl(var(--muted-foreground))"
                        }}
                      />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke="hsl(var(--secondary))"
                        fill="hsl(var(--secondary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Current Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-secondary rounded-full border-dashed"></div>
                    <span>Target Level</span>
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
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
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
                        className="flex items-center justify-between p-3 rounded-lg bg-glass/30 hover:bg-glass/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.current}%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {skill.label}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold text-primary">
                            Target: {skill.target}%
                          </div>
                          <div className="text-xs text-muted-foreground">
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
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    AI Recommendations
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
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
                        className="p-3 rounded-lg bg-gradient-primary/5 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {rec.project}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Focus: {rec.skill}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default" className="text-xs">
                              {rec.xpGain}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {rec.difficulty}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
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