"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Braces, ArrowLeft, Swords, Target, Award } from "lucide-react"
import Link from "next/link"

export default function GameSimulationPage() {
  const [gameRunning, setGameRunning] = useState(false)
  const [rounds, setRounds] = useState(0)
  const [attackerScore, setAttackerScore] = useState(0)
  const [defenderScore, setDefenderScore] = useState(0)

  const startGame = () => {
    setGameRunning(true)
    setRounds(0)
    setAttackerScore(0)
    setDefenderScore(0)

    const interval = setInterval(() => {
      setRounds((prev) => {
        const nextRound = prev + 1
        if (nextRound >= 10) {
          clearInterval(interval)
          setGameRunning(false)
        }
        return nextRound
      })
      setAttackerScore((prev) => prev + Math.floor(Math.random() * 15) + 5)
      setDefenderScore((prev) => prev + Math.floor(Math.random() * 15) + 5)
    }, 800)
  }

  const stopGame = () => {
    setGameRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Braces className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Game-Driven Simulation</h1>
            </div>
          </div>
          <Badge variant="outline">Module 2</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Multi-Agent Markov Game Framework</CardTitle>
            <CardDescription className="text-base">
              Intelligent attack-defense interaction using WoLF-BSS-Q strategy optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Swords className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Framework</p>
                      <p className="font-semibold">Markov Game</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lead Researcher</p>
                      <p className="font-semibold">Yanqing Lv</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Algorithm</p>
                      <p className="font-semibold">WoLF-BSS-Q</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Game Environment */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Attack-Defense Game Simulation</CardTitle>
            <CardDescription>Simulate multi-agent interactions in cyber-range scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Button onClick={startGame} disabled={gameRunning} className="flex items-center gap-2">
                <Swords className="w-4 h-4" />
                Start Game
              </Button>
              <Button
                onClick={stopGame}
                variant="outline"
                disabled={!gameRunning}
                className="flex items-center gap-2 bg-transparent"
              >
                Stop
              </Button>
              <div className="ml-auto text-sm text-muted-foreground">
                Round: <span className="font-semibold text-foreground">{rounds}/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-destructive/10 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Swords className="w-5 h-5 text-destructive" />
                    Attacker Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Score</p>
                    <p className="text-3xl font-bold text-destructive">{attackerScore}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Strategy Learning Progress</p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive transition-all duration-500"
                        style={{ width: `${Math.min((rounds / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  {rounds > 0 && (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Recent Actions:</p>
                      <div className="space-y-1">
                        <p className="text-xs">• Port Scanning</p>
                        <p className="text-xs">• Exploit Attempt</p>
                        <p className="text-xs">• Lateral Movement</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Defender Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Score</p>
                    <p className="text-3xl font-bold text-primary">{defenderScore}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Defense Adaptation</p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min((rounds / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  {rounds > 0 && (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Recent Actions:</p>
                      <div className="space-y-1">
                        <p className="text-xs">• Firewall Update</p>
                        <p className="text-xs">• Anomaly Detection</p>
                        <p className="text-xs">• Traffic Filtering</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="min-h-[300px] bg-muted/30 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
              <p className="text-muted-foreground">Game State Visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Tabs defaultValue="framework" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="framework">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Markov Game Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2">State Space</h3>
                    <p className="text-sm text-muted-foreground">
                      Represents the current network configuration, compromised nodes, active defenses, and traffic
                      patterns. Both agents observe the state to make decisions.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2">Action Space</h3>
                    <p className="text-sm text-muted-foreground">
                      Attackers can scan, exploit, or move laterally. Defenders can block, monitor, patch, or deploy
                      honeypots. Each action affects the environment and opponent.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2">Reward Function</h3>
                    <p className="text-sm text-muted-foreground">
                      Zero-sum game where attacker gains are defender losses. Rewards based on compromise depth,
                      detection evasion, and defense effectiveness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="algorithm">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>WoLF-BSS-Q Algorithm</CardTitle>
                <CardDescription>Win or Learn Fast with Best Strategy Selection Q-Learning</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Adaptive Learning Rate</p>
                      <p className="text-sm text-muted-foreground">
                        Agents learn faster when losing and slower when winning, enabling dynamic strategy adaptation
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Best Strategy Selection</p>
                      <p className="text-sm text-muted-foreground">
                        Maintains a repertoire of strategies and selects the best response to opponent behavior
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Nash Equilibrium Convergence</p>
                      <p className="text-sm text-muted-foreground">
                        Guarantees convergence to Nash equilibrium in multi-agent competitive settings
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Policy Gradient Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Combines Q-learning with policy gradients for smooth strategy updates
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Cyber-Range Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">APT Campaign</h3>
                      <Badge>Advanced</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sophisticated multi-stage attack with persistence mechanisms and data exfiltration
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">DDoS Defense</h3>
                      <Badge>Intermediate</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Distributed attack scenarios requiring adaptive traffic filtering and load balancing
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Insider Threat</h3>
                      <Badge>Advanced</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Simulates authorized user exploiting access privileges and evading behavioral analytics
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Ransomware Outbreak</h3>
                      <Badge>Intermediate</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Rapid encryption attack requiring quick isolation and backup recovery strategies
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
