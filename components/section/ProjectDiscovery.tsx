import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const projects = [
  {
    id: 1,
    title: "Neural DeFi Protocol",
    description: "AI-powered decentralized finance protocol with quantum security",
    tags: ["DeFi", "AI", "Blockchain"],
    stars: 2840,
    forks: 456,
    maintainers: 12,
    difficulty: "Advanced",
  bounty: "5.2 AVAX",
    status: "Active"
  },
  {
    id: 2,
    title: "Quantum Chat SDK",
    description: "End-to-end encrypted messaging with quantum-resistant cryptography",
    tags: ["Security", "SDK", "TypeScript"],
    stars: 1923,
    forks: 289,
    maintainers: 8,
    difficulty: "Intermediate",
  bounty: "2.8 AVAX",
    status: "Hot"
  },
  {
    id: 3,
    title: "MetaVerse Builder",
    description: "No-code platform for creating immersive 3D virtual worlds",
    tags: ["3D", "WebGL", "React"],
    stars: 3567,
    forks: 678,
    maintainers: 15,
    difficulty: "Beginner",
  bounty: "1.5 AVAX",
    status: "New"
  },
  {
    id: 4,
    title: "Blockchain Analytics",
    description: "Advanced analytics dashboard for multi-chain data visualization",
    tags: ["Analytics", "Web3", "Data"],
    stars: 1456,
    forks: 234,
    maintainers: 6,
    difficulty: "Advanced",
  bounty: "4.1 AVAX",
    status: "Active"
  },
  {
    id: 5,
    title: "AI Code Review Bot",
    description: "Machine learning bot that provides intelligent code reviews",
    tags: ["AI", "DevOps", "Python"],
    stars: 2156,
    forks: 345,
    maintainers: 9,
    difficulty: "Intermediate",
  bounty: "3.0 AVAX",
    status: "Active"
  },
  {
    id: 6,
    title: "Holographic UI Kit",
    description: "Next-gen UI components with holographic effects and animations",
    tags: ["UI/UX", "React", "CSS"],
    stars: 4235,
    forks: 892,
    maintainers: 18,
    difficulty: "Beginner",
  bounty: "2.2 AVAX",
    status: "Hot"
  }
];

const filters = ["All", "Beginner", "Intermediate", "Advanced"];

export function ProjectDiscovery() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project => {
    const matchesFilter = selectedFilter === "All" || project.difficulty === selectedFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            Discover Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find cutting-edge open source projects and contribute to the future of technology
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "outline-neon" : "glass"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="min-w-[80px]"
              >
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card variant="glass" className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={project.status === "Hot" ? "destructive" : project.status === "New" ? "glass-neon" : "glass"}
                      className={project.status === "Hot" ? "animate-pulse" : ""}
                    >
                      {project.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{project.bounty}</div>
                      <div className="text-xs text-muted-foreground">{project.difficulty}</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="glass" className="text-xs hover:scale-105 transition-transform duration-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-yellow-400 transition-colors duration-300">
                        <Star className="h-4 w-4" />
                        <span>{project.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-blue-400 transition-colors duration-300">
                        <GitFork className="h-4 w-4" />
                        <span>{project.forks}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-green-400 transition-colors duration-300">
                        <Users className="h-4 w-4" />
                        <span>{project.maintainers}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline-neon" className="w-full group">
                    View Details
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}