"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, Shield, Braces, Mail } from "lucide-react"
import Link from "next/link"

export default function ResearchProjectPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold text-foreground text-balance leading-tight max-w-2xl">
            Deep Learning–Based Cyber Range for Network Attack and Defense
          </h1>
          <nav className="hidden md:flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("overview")}>
              Overview
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("modules")}>
              Modules
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection("team")}>
              Team
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Project Overview Card */}
        <section id="overview" className="scroll-mt-24">
          <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-lg leading-relaxed">
                This project builds an intelligent system that integrates graph neural network modeling, game-driven
                simulation, and multi-modal security detection to simulate network traffic and detect intrusions. It
                aims to improve the accuracy of network behavior modeling and enhance practical cyber-defense
                capabilities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  GNN
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Game Theory
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Intrusion Detection
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Multi-Modal Learning
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Modules Area */}
        <section id="modules" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-semibold text-center mb-8">Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1 */}
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-5 h-5 text-primary" />
                  <Badge variant="outline">Module 1</Badge>
                </div>
                <CardTitle className="text-xl">Graph Neural Network Traffic Simulation</CardTitle>
                <CardDescription className="text-base">Topology-aware network traffic simulation</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Leverages graph neural networks (e.g., GCN/GAT) combined with GRU to jointly model
                      spatial–temporal patterns of network traffic.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Customizes the model for computer network traffic characteristics.</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-border/50 min-h-[80px] flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center">Diagram placeholder</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex-col gap-3 items-stretch">
                <p className="text-sm font-medium">
                  Lead: <span className="text-primary">Xinlong Li</span>
                </p>
                <Link href="/modules/gnn-simulation">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Module
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Module 2 */}
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Braces className="w-5 h-5 text-primary" />
                  <Badge variant="outline">Module 2</Badge>
                </div>
                <CardTitle className="text-xl">Game-Driven Traffic Behavior Simulation</CardTitle>
                <CardDescription className="text-base">Markov game–based multi-agent simulation</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Builds a multi-agent Markov game framework for intelligent attack–defense interactions.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Uses the WoLF-BSS-Q strategy optimization algorithm.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Generates realistic attack and defense traffic with evolving strategies to support cyber-range
                      exercises.
                    </span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-border/50 min-h-[80px] flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center">Diagram placeholder</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex-col gap-3 items-stretch">
                <p className="text-sm font-medium">
                  Lead: <span className="text-primary">Yanqing Lv</span>
                </p>
                <Link href="/modules/game-simulation">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Module
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Module 3 */}
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border/50 flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <Badge variant="outline">Module 3</Badge>
                </div>
                <CardTitle className="text-xl">Multi-Modal Network Intrusion Detection</CardTitle>
                <CardDescription className="text-base">
                  Multi-source data collection and AI-based detection
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Constructs a deployable, multi-modal data–driven intrusion detection system.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Implements high-performance data collection components in Go.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Collects heterogeneous data such as network traffic, system logs, and host behaviors.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Aligns time stamps, standardizes formats, and synchronizes streams to achieve temporal alignment
                      across modalities.
                    </span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-border/50 min-h-[80px] flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center">Diagram placeholder</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex-col gap-3 items-stretch">
                <p className="text-sm font-medium">
                  Lead: <span className="text-primary">Shaowen Ding</span>
                </p>
                <Link href="/modules/intrusion-detection">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Module
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="scroll-mt-24">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">System Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Network className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-sm">Modeling</p>
                </div>
                <div className="hidden md:block text-4xl text-muted-foreground">→</div>
                <div className="md:hidden text-4xl text-muted-foreground rotate-90">→</div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Braces className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-sm">Simulation</p>
                </div>
                <div className="hidden md:block text-4xl text-muted-foreground">→</div>
                <div className="md:hidden text-4xl text-muted-foreground rotate-90">→</div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-sm">Detection & Alerting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section id="team" className="scroll-mt-24">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Research Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                    XL
                  </div>
                  <h3 className="font-semibold">Xinlong Li</h3>
                  <p className="text-sm text-muted-foreground text-center">Module 1 Lead</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                    YL
                  </div>
                  <h3 className="font-semibold">Yanqing Lv</h3>
                  <p className="text-sm text-muted-foreground text-center">Module 2 Lead</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                    SD
                  </div>
                  <h3 className="font-semibold">Shaowen Ding</h3>
                  <p className="text-sm text-muted-foreground text-center">Module 3 Lead</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Deep Learning–Based Cyber Range for Network Attack and Defense</p>
          <p className="mt-2">© 2025 Research Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
