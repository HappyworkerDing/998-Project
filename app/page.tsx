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
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <svg viewBox="0 0 400 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <rect
                        x="20"
                        y="20"
                        width="100"
                        height="50"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="70"
                        y="40"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Network
                      </text>
                      <text
                        x="70"
                        y="55"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Topology
                      </text>
                    </g>
                    <g>
                      <rect
                        x="20"
                        y="90"
                        width="100"
                        height="50"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="70"
                        y="110"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Historical
                      </text>
                      <text
                        x="70"
                        y="125"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Traffic Data
                      </text>
                    </g>
                    <g>
                      <rect
                        x="150"
                        y="20"
                        width="100"
                        height="120"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.15"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                      />
                      <text
                        x="200"
                        y="45"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        fontWeight="700"
                      >
                        GNN Layer
                      </text>
                      <text x="200" y="65" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        (GCN/GAT)
                      </text>
                      <circle cx="180" cy="90" r="8" fill="hsl(var(--primary))" fillOpacity="0.3" />
                      <circle cx="200" cy="105" r="8" fill="hsl(var(--primary))" fillOpacity="0.3" />
                      <circle cx="220" cy="90" r="8" fill="hsl(var(--primary))" fillOpacity="0.3" />
                      <line x1="180" y1="90" x2="200" y2="105" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                      <line x1="200" y1="105" x2="220" y2="90" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                      <line x1="220" y1="90" x2="180" y2="90" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                      <text x="200" y="130" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        Spatial
                      </text>
                    </g>
                    <g>
                      <rect
                        x="150"
                        y="160"
                        width="100"
                        height="100"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.15"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                      />
                      <text
                        x="200"
                        y="185"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        fontWeight="700"
                      >
                        GRU Layer
                      </text>
                      <text x="200" y="203" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        (Temporal)
                      </text>
                      <rect
                        x="170"
                        y="215"
                        width="12"
                        height="20"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.3"
                      />
                      <rect
                        x="185"
                        y="215"
                        width="12"
                        height="25"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.4"
                      />
                      <rect
                        x="200"
                        y="215"
                        width="12"
                        height="30"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.5"
                      />
                      <rect
                        x="215"
                        y="215"
                        width="12"
                        height="22"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.4"
                      />
                      <text x="200" y="253" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        Temporal
                      </text>
                    </g>
                    <g>
                      <rect
                        x="280"
                        y="100"
                        width="100"
                        height="60"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.2"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="330"
                        y="125"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Traffic
                      </text>
                      <text
                        x="330"
                        y="140"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Prediction
                      </text>
                      <text x="330" y="152" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        (Future Steps)
                      </text>
                    </g>
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                      </marker>
                    </defs>
                    <path
                      d="M 120 45 L 148 55"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <path
                      d="M 120 115 L 148 105"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <path
                      d="M 200 142 L 200 158"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <path
                      d="M 252 210 L 278 145"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
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
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <svg viewBox="0 0 400 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <rect
                        x="40"
                        y="30"
                        width="130"
                        height="80"
                        rx="8"
                        fill="hsl(var(--destructive))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--destructive))"
                        strokeWidth="2"
                      />
                      <text
                        x="105"
                        y="55"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        fontWeight="700"
                      >
                        Attacker Agent
                      </text>
                      <text x="105" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        WoLF-BSS-Q
                      </text>
                      <circle cx="105" cy="92" r="10" fill="hsl(var(--destructive))" fillOpacity="0.3" />
                      <text
                        x="105"
                        y="97"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        A
                      </text>
                    </g>
                    <g>
                      <rect
                        x="230"
                        y="30"
                        width="130"
                        height="80"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="295"
                        y="55"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        fontWeight="700"
                      >
                        Defender Agent
                      </text>
                      <text x="295" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        WoLF-BSS-Q
                      </text>
                      <circle cx="295" cy="92" r="10" fill="hsl(var(--primary))" fillOpacity="0.3" />
                      <text
                        x="295"
                        y="97"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        D
                      </text>
                    </g>
                    <g>
                      <rect
                        x="120"
                        y="140"
                        width="160"
                        height="70"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.15"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                      />
                      <text
                        x="200"
                        y="165"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="12"
                        fontWeight="700"
                      >
                        Markov Game
                      </text>
                      <text x="200" y="182" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        Environment
                      </text>
                      <text x="200" y="200" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        State, Reward, Transition
                      </text>
                    </g>
                    <g>
                      <rect
                        x="120"
                        y="235"
                        width="160"
                        height="35"
                        rx="6"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.2"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="200"
                        y="257"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Realistic Traffic Patterns
                      </text>
                    </g>
                    <defs>
                      <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                      </marker>
                      <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--destructive))" />
                      </marker>
                    </defs>
                    <path
                      d="M 105 110 L 145 138"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead3)"
                      strokeDasharray="4,2"
                    />
                    <path
                      d="M 295 110 L 255 138"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead2)"
                      strokeDasharray="4,2"
                    />
                    <path
                      d="M 155 140 Q 105 125 105 102"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#arrowhead2)"
                    />
                    <path
                      d="M 245 140 Q 295 125 295 102"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#arrowhead2)"
                    />
                    <path
                      d="M 200 210 L 200 233"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      fill="none"
                      markerEnd="url(#arrowhead2)"
                    />
                    <text x="125" y="128" fill="hsl(var(--muted-foreground))" fontSize="8">
                      Action
                    </text>
                    <text x="260" y="128" fill="hsl(var(--muted-foreground))" fontSize="8">
                      Action
                    </text>
                    <text x="75" y="120" fill="hsl(var(--muted-foreground))" fontSize="8">
                      Reward
                    </text>
                    <text x="310" y="120" fill="hsl(var(--muted-foreground))" fontSize="8">
                      Reward
                    </text>
                  </svg>
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
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <svg viewBox="0 0 400 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <rect
                        x="30"
                        y="20"
                        width="90"
                        height="40"
                        rx="6"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                      />
                      <text
                        x="75"
                        y="45"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        Network Traffic
                      </text>
                    </g>
                    <g>
                      <rect
                        x="30"
                        y="75"
                        width="90"
                        height="40"
                        rx="6"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                      />
                      <text
                        x="75"
                        y="100"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        System Logs
                      </text>
                    </g>
                    <g>
                      <rect
                        x="30"
                        y="130"
                        width="90"
                        height="40"
                        rx="6"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.1"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                      />
                      <text
                        x="75"
                        y="155"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        Host Behavior
                      </text>
                    </g>
                    <g>
                      <rect
                        x="145"
                        y="60"
                        width="100"
                        height="70"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.15"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <text
                        x="195"
                        y="85"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="700"
                      >
                        Data Collection
                      </text>
                      <text x="195" y="102" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        (Go-based)
                      </text>
                      <text x="195" y="118" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">
                        Timestamp Alignment
                      </text>
                    </g>
                    <g>
                      <rect
                        x="270"
                        y="60"
                        width="100"
                        height="70"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.2"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                      />
                      <text
                        x="320"
                        y="85"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="700"
                      >
                        Multi-Modal
                      </text>
                      <text
                        x="320"
                        y="100"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="700"
                      >
                        Fusion
                      </text>
                      <circle cx="305" cy="115" r="6" fill="hsl(var(--primary))" fillOpacity="0.4" />
                      <circle cx="320" cy="115" r="6" fill="hsl(var(--primary))" fillOpacity="0.5" />
                      <circle cx="335" cy="115" r="6" fill="hsl(var(--primary))" fillOpacity="0.4" />
                    </g>
                    <g>
                      <rect
                        x="270"
                        y="155"
                        width="100"
                        height="50"
                        rx="8"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.25"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                      />
                      <text
                        x="320"
                        y="177"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="11"
                        fontWeight="700"
                      >
                        AI Detection
                      </text>
                      <text x="320" y="193" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">
                        Deep Learning
                      </text>
                    </g>
                    <g>
                      <rect
                        x="270"
                        y="225"
                        width="100"
                        height="35"
                        rx="6"
                        fill="hsl(var(--destructive))"
                        fillOpacity="0.15"
                        stroke="hsl(var(--destructive))"
                        strokeWidth="2"
                      />
                      <text
                        x="320"
                        y="247"
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontWeight="600"
                      >
                        Intrusion Alert
                      </text>
                    </g>
                    <defs>
                      <marker id="arrowhead4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                      </marker>
                    </defs>
                    <path
                      d="M 120 40 L 143 75"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                    <path
                      d="M 120 95 L 143 95"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                    <path
                      d="M 120 150 L 143 115"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                    <path
                      d="M 245 95 L 268 95"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                    <path
                      d="M 320 130 L 320 153"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                    <path
                      d="M 320 205 L 320 223"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead4)"
                    />
                  </svg>
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
