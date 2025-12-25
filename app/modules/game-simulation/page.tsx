"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Braces, ArrowLeft, Swords, Target, Award, Brain, TrendingUp, Activity, Zap, Play, Pause, RotateCcw, Shield } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"

type TrainingData = {
  episode: number
  reward: number
  qValue: number
  attention: number
}

type DecisionLog = {
  id: string
  episode: number
  action: string
  reward: number
  timestamp: number
}

export default function GameSimulationPage() {
  const [training, setTraining] = useState(false)
  const [episode, setEpisode] = useState(0)
  const [trainingPhase, setTrainingPhase] = useState<"pretrain" | "independent" | "joint">("independent")
  
  // Q-learning metrics
  const [avgQValue, setAvgQValue] = useState(45.67)
  const [learningRate, setLearningRate] = useState(0.0087)
  const [explorationRate, setExplorationRate] = useState(0.12)
  const [wolfMode, setWolfMode] = useState<"win" | "lose">("win")
  
  // WoLF metrics
  const [policyValue, setPolicyValue] = useState(52.3)
  const [avgPolicyValue, setAvgPolicyValue] = useState(48.7)
  const [winStreak, setWinStreak] = useState(8)
  
  // BSS metrics
  const [attackerType, setAttackerType] = useState<"APT" | "DDoS" | "Ransomware" | "Mixed">("Mixed")
  const [typeBeliefs, setTypeBeliefs] = useState({
    APT: 0.25,
    DDoS: 0.15,
    Ransomware: 0.20,
    Mixed: 0.40
  })
  
  // Attention metrics
  const [attentionAccuracy, setAttentionAccuracy] = useState(0.82)
  const [topKNodes, setTopKNodes] = useState(10)
  
  // Reward scores
  const [attackerReward, setAttackerReward] = useState(0)
  const [defenderReward, setDefenderReward] = useState(0)
  
  // Training data
  const [trainingData, setTrainingData] = useState<TrainingData[]>([])
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([])
  
  // Network nodes (simplified)
  const [nodes, setNodes] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      attention: Math.random() * 0.3 + 0.1,
      risk: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
    }))
  )
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const avgQValueRef = useRef(avgQValue)
  const attentionAccuracyRef = useRef(attentionAccuracy)

  const startTraining = () => {
    setTraining(true)
    setEpisode(0)
    setTrainingData([])
    setDecisionLogs([])
    
    intervalRef.current = setInterval(() => {
      setEpisode((prev: number) => {
        const newEpisode = prev + 1
        
        // Update metrics with realistic variations
        setAvgQValue((v: number) => v + (Math.random() - 0.4) * 2)
        setLearningRate((lr: number) => Math.max(0.001, lr + (Math.random() - 0.5) * 0.0005))
        setExplorationRate((er: number) => Math.max(0.01, er * 0.998))
        setPolicyValue((pv: number) => pv + (Math.random() - 0.3) * 1.5)
        setAvgPolicyValue((apv: number) => apv + (Math.random() - 0.4) * 1)
        setAttentionAccuracy((acc: number) => Math.min(0.95, acc + (Math.random() - 0.4) * 0.02))
        
        // Update reward scores based on training progress
        setAttackerReward((prev) => {
          const change = (Math.random() - 0.5) * 10;
          return Math.max(0, prev + change);
        });
        setDefenderReward((prev) => {
          const change = (Math.random() - 0.5) * 10;
          return Math.max(0, prev - change); // Defender reward is inverse to attacker in zero-sum game
        });
        
        // Toggle WoLF mode occasionally
        if (Math.random() > 0.85) {
          setWolfMode((mode: "win" | "lose") => mode === "win" ? "lose" : "win")
        }
        
        // Update win streak
        if (Math.random() > 0.7) {
          setWinStreak((ws: number) => ws + 1)
        } else if (Math.random() > 0.8) {
          setWinStreak(0)
        }
        
        // Add training data point
        setTrainingData((data: TrainingData[]) => {
          const currentQ = avgQValueRef.current
          const currentAcc = attentionAccuracyRef.current
          const newReward = 50 + Math.random() * 30 + newEpisode * 0.5
          const newQValue = currentQ + (Math.random() - 0.5) * 5
          const newAttention = (currentAcc + (Math.random() - 0.5) * 0.1) * 100 // Scale to 0-100 for visibility
          const newData = [
            ...data,
            {
              episode: newEpisode,
              reward: newReward,
              qValue: newQValue,
              attention: newAttention
            }
          ]
          return newData.slice(-50) // Keep last 50 points
        })
        
        // Add decision log
        if (newEpisode % 5 === 0) {
          const actions = [
            "Firewall Update - Node 5",
            "IDS Deep Scan - Node 8",
            "Traffic Redirect - Node 12",
            "Patch Deployment - Node 3",
            "Honeypot Deploy - Node 15"
          ]
          setDecisionLogs((logs: DecisionLog[]) => [
            {
              id: `log-${newEpisode}`,
              episode: newEpisode,
              action: actions[Math.floor(Math.random() * actions.length)],
              reward: Math.floor(Math.random() * 20) + 10,
              timestamp: Date.now()
            },
            ...logs
          ].slice(0, 5))
        }
        
        // Update node attention weights
        setNodes((ns: typeof nodes) => 
          ns.map((n: typeof nodes[0]) => ({
            ...n,
            attention: Math.max(0.05, n.attention + (Math.random() - 0.5) * 0.1)
          }))
        )
        
        return newEpisode
      })
    }, 1000)
  }

  const stopTraining = () => {
    setTraining(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resetTraining = () => {
    stopTraining()
    setEpisode(0)
    setTrainingData([])
    setDecisionLogs([])
    setAvgQValue(45.67)
    setLearningRate(0.0087)
    setExplorationRate(0.12)
    setPolicyValue(52.3)
    setAvgPolicyValue(0)
    setAttentionAccuracy(0)
    setWinStreak(0)
    setAttackerReward(0)
    setDefenderReward(0)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const chartConfig = {
    reward: {
      label: "Cumulative Reward",
      color: "#22c55e", // green-500
    },
    qValue: {
      label: "Average Q-Value",
      color: "#3b82f6", // blue-500
    },
    attention: {
      label: "Attention Accuracy",
      color: "#f97316", // orange-500
    },
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
              <h1 className="text-lg md:text-xl font-semibold text-foreground">AE-WoLF-BSS-Q Defense Module</h1>
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
            <CardTitle className="text-2xl">Attention-Enhanced WoLF-BSS-Q Framework</CardTitle>
            <CardDescription className="text-base">
              Intelligent defense decision-making with attention-based state compression and adaptive learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Algorithm</p>
                      <p className="font-semibold">AE-WoLF-BSS-Q</p>
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
                      <p className="text-sm text-muted-foreground">Training Phase</p>
                      <p className="font-semibold capitalize">{trainingPhase}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Training Control */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Training Control</CardTitle>
            <CardDescription>Start, pause, or reset the AE-WoLF-BSS-Q training process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={startTraining} disabled={training} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Training
              </Button>
              <Button onClick={stopTraining} variant="outline" disabled={!training} className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button onClick={resetTraining} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <div className="ml-auto flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Episode: <span className="font-semibold text-foreground">{episode}</span>
                </div>
                {training && (
                  <Badge variant="outline" className="animate-pulse">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Training
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attacker Reward Card */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-500" />
                Attacker Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-red-500">{attackerReward.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Current attack effectiveness</div>
            </CardContent>
          </Card>

          {/* Defender Reward Card */}
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Defender Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold text-green-500">{defenderReward.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Current defense effectiveness</div>
            </CardContent>
          </Card>

          {/* Q-Learning Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Q-Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Avg Q-Value</p>
                <p className="text-2xl font-bold">{avgQValue.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Learning Rate</span>
                <span className="font-medium">{learningRate.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Exploration (ε)</span>
                <span className="font-medium">{(explorationRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={wolfMode === "win" ? "default" : "secondary"} className="text-xs">
                  WoLF: {wolfMode.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* WoLF Card */}
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                WoLF Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Policy Value</p>
                <p className="text-2xl font-bold">{policyValue.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Avg Policy</span>
                <span className="font-medium">{avgPolicyValue.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Win Streak</span>
                <span className="font-medium">{winStreak}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BSS Card */}
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                BSS Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Dominant Type</p>
                <p className="text-xl font-bold">{attackerType}</p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APT:</span>
                  <span className="font-medium">{(typeBeliefs.APT * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DDoS:</span>
                  <span className="font-medium">{(typeBeliefs.DDoS * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mixed:</span>
                  <span className="font-medium">{(typeBeliefs.Mixed * 100).toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attention Card */}
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Accuracy@10</p>
                <p className="text-2xl font-bold">{(attentionAccuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Top-K Nodes</span>
                <span className="font-medium">{topKNodes}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${attentionAccuracy * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Curves */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Real-time training metrics visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart
                data={trainingData.length > 0 ? trainingData : [{ episode: 0, reward: 0, qValue: 0, attention: 0 }]}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="episode"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="reward"
                  stroke="var(--color-reward)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="qValue"
                  stroke="var(--color-qValue)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="attention"
                  stroke="var(--color-attention)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Network Nodes & Decision Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Nodes Visualization */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Network Topology (Attention Weights)</CardTitle>
              <CardDescription>Top-K critical nodes highlighted by attention mechanism</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {nodes
                  .sort((a: typeof nodes[0], b: typeof nodes[0]) => b.attention - a.attention)
                  .slice(0, 15)
                  .map((node: typeof nodes[0]) => (
                    <div
                      key={node.id}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                        node.attention > 0.25
                          ? "bg-primary/20 border-primary scale-110"
                          : node.attention > 0.15
                          ? "bg-orange-500/10 border-orange-500"
                          : "bg-muted/30 border-border/50"
                      }`}
                      style={{
                        opacity: node.attention * 2 + 0.3,
                      }}
                      title={`Node ${node.id}: Attention ${(node.attention * 100).toFixed(1)}%`}
                    >
                      {node.id}
                    </div>
                  ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>High Attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted"></div>
                  <span>Low</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Logs */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Decisions</CardTitle>
              <CardDescription>Latest defense actions and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {decisionLogs.length > 0 ? (
                <div className="space-y-3">
                  {decisionLogs.map((log: DecisionLog) => (
                    <div
                      key={log.id}
                      className="p-3 bg-muted/30 rounded-lg border border-border/50 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Episode {log.episode}</span>
                        <Badge variant={log.reward > 20 ? "default" : "secondary"}>
                          +{log.reward}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] bg-muted/30 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No decisions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
