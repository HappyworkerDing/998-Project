"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Network,
  ArrowLeft,
  Play,
  RotateCcw,
  TrendingUp,
  Activity,
  Zap,
  AlertCircle,
  Eye,
  BarChart3,
  GitBranch,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

interface SimulationResult {
  predictions: number[][][]
  historical_features: number[][][]
  metrics: {
    mse: number
    mae: number
    num_predictions: number
  }
  graph: {
    num_nodes: number
    num_edges: number
    avg_degree: number
    edge_list: [number, number][]
  }
  metadata: {
    scenario: string
    sequence_length: number
    prediction_steps: number
    num_features: number
  }
}

export default function GNNSimulationPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Simulation parameters
  const [numNodes, setNumNodes] = useState(50)
  const [historyLength, setHistoryLength] = useState(10)
  const [scenario, setScenario] = useState("periodic")
  const [predictionSteps, setPredictionSteps] = useState(5)

  const startSimulation = async () => {
    setIsSimulating(true)
    setError(null)

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_nodes: numNodes,
          history_length: historyLength,
          scenario: scenario,
          prediction_steps: predictionSteps,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Simulation failed: ${response.statusText}`)
      }

      const data = await response.json()
      setSimulationResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed")
      console.error("[v0] Simulation error:", err)
    } finally {
      setIsSimulating(false)
    }
  }

  const resetSimulation = () => {
    setSimulationResult(null)
    setError(null)
  }

  const prepareChartData = () => {
    if (!simulationResult) return []

    const historical = simulationResult.historical_features
    const predictions = simulationResult.predictions

    // Use first node, first feature for visualization
    const chartData = []

    // Historical data
    for (let t = 0; t < historical.length; t++) {
      chartData.push({
        time: t,
        historical: historical[t][0][0],
        type: "historical",
      })
    }

    // Predictions
    const predArray = predictionSteps === 1 ? [predictions] : predictions
    for (let t = 0; t < predArray.length; t++) {
      chartData.push({
        time: historical.length + t,
        prediction: predArray[t][0][0],
        type: "prediction",
      })
    }

    return chartData
  }

  const prepareScatterData = () => {
    if (!simulationResult) return []

    const historical = simulationResult.historical_features
    const lastStep = historical[historical.length - 1]
    const predictions = simulationResult.predictions

    const firstPred = predictionSteps === 1 ? predictions : predictions[0]

    const scatterData = []
    for (let i = 0; i < Math.min(lastStep.length, 50); i++) {
      scatterData.push({
        actual: lastStep[i][0],
        predicted: firstPred[i][0],
      })
    }

    return scatterData
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
              <Network className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold text-foreground">GNN Traffic Simulation</h1>
            </div>
          </div>
          <Badge variant="outline">Module 1</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Graph Neural Network Traffic Simulation</CardTitle>
            <CardDescription className="text-base">
              Topology-aware network traffic modeling using GCN/GAT with temporal GRU
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-3 text-foreground">Advanced Visualizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link href="/modules/gnn-simulation/topology">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Network Topology
                  </Button>
                </Link>
                <Link href="/modules/gnn-simulation/heatmap">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <Eye className="w-4 h-4 mr-2" />
                    Traffic Heatmap
                  </Button>
                </Link>
                <Link href="/modules/gnn-simulation/analysis">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Feature Analysis
                  </Button>
                </Link>
              </div>
              <h3 className="font-semibold mb-3 mt-6 text-foreground">System Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link href="/modules/gnn-simulation/monitor">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <Activity className="w-4 h-4 mr-2" />
                    Real-time Monitor
                  </Button>
                </Link>
                <Link href="/modules/gnn-simulation/anomaly">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Anomaly Detection
                  </Button>
                </Link>
                <Link href="/modules/gnn-simulation/training">
                  <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Training History
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Model Type</p>
                      <p className="font-semibold">GCN/GAT + GRU</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lead Researcher</p>
                      <p className="font-semibold">Xinlong Li</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-primary">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Simulation */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Traffic Simulation Dashboard</CardTitle>
            <CardDescription>Configure and run GNN-based network traffic simulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Simulation Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numNodes">Number of Nodes</Label>
                <Input
                  id="numNodes"
                  type="number"
                  min={10}
                  max={200}
                  value={numNodes}
                  onChange={(e) => setNumNodes(Number.parseInt(e.target.value))}
                  disabled={isSimulating}
                />
                <p className="text-xs text-muted-foreground">Network size (10-200 nodes)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="historyLength">History Length</Label>
                <Input
                  id="historyLength"
                  type="number"
                  min={5}
                  max={50}
                  value={historyLength}
                  onChange={(e) => setHistoryLength(Number.parseInt(e.target.value))}
                  disabled={isSimulating}
                />
                <p className="text-xs text-muted-foreground">Historical time steps (5-50)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario">Traffic Pattern</Label>
                <Select value={scenario} onValueChange={setScenario} disabled={isSimulating}>
                  <SelectTrigger id="scenario">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="periodic">Periodic</SelectItem>
                    <SelectItem value="bursty">Bursty</SelectItem>
                    <SelectItem value="random">Random Walk</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Synthetic traffic pattern type</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="predictionSteps">Prediction Steps</Label>
                <Input
                  id="predictionSteps"
                  type="number"
                  min={1}
                  max={10}
                  value={predictionSteps}
                  onChange={(e) => setPredictionSteps(Number.parseInt(e.target.value))}
                  disabled={isSimulating}
                />
                <p className="text-xs text-muted-foreground">Future steps to predict (1-10)</p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <Button onClick={startSimulation} disabled={isSimulating} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                {isSimulating ? "Running..." : "Start Simulation"}
              </Button>
              <Button onClick={resetSimulation} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Simulation Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {simulationResult && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30 border-border/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Mean Squared Error</p>
                      <p className="text-2xl font-bold text-primary">{simulationResult.metrics.mse.toFixed(6)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30 border-border/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Mean Absolute Error</p>
                      <p className="text-2xl font-bold text-primary">{simulationResult.metrics.mae.toFixed(6)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30 border-border/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Network Edges</p>
                      <p className="text-2xl font-bold text-primary">{simulationResult.graph.num_edges}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Time Series Chart */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Traffic Prediction Timeline</CardTitle>
                    <CardDescription>Historical data vs predicted values (Node 0, Feature 0)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" label={{ value: "Time Step", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Traffic Value", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="historical"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Historical"
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="prediction"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Prediction"
                          dot={{ r: 4 }}
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Scatter Plot */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
                    <CardDescription>Actual vs predicted values across all nodes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="actual"
                          name="Actual"
                          label={{ value: "Actual Values", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis
                          dataKey="predicted"
                          name="Predicted"
                          label={{ value: "Predicted Values", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Predictions" data={prepareScatterData()} fill="#3b82f6" />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Perfect Prediction"
                          dot={false}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Graph Info */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Network Topology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nodes</p>
                        <p className="text-xl font-bold">{simulationResult.graph.num_nodes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Edges</p>
                        <p className="text-xl font-bold">{simulationResult.graph.num_edges}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Degree</p>
                        <p className="text-xl font-bold">{simulationResult.graph.avg_degree.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pattern</p>
                        <p className="text-xl font-bold capitalize">{simulationResult.metadata.scenario}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Model Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">1.</span> Spatial Feature Extraction
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Graph Convolutional Networks (GCN) or Graph Attention Networks (GAT) capture the spatial
                      dependencies between network nodes based on topology structure.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">2.</span> Temporal Modeling
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gated Recurrent Units (GRU) model the temporal evolution of traffic patterns, capturing
                      time-series dependencies in network flows.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">3.</span> Traffic Generation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The combined spatial-temporal representations are used to generate realistic network traffic flows
                      that respect topology constraints and temporal patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Topology-Aware Modeling</p>
                      <p className="text-sm text-muted-foreground">
                        Leverages network topology information to improve traffic prediction accuracy
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Spatial-Temporal Joint Learning</p>
                      <p className="text-sm text-muted-foreground">
                        Combines spatial graph features with temporal sequence modeling
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Scalable Architecture</p>
                      <p className="text-sm text-muted-foreground">
                        Efficiently handles large-scale network topologies with hundreds of nodes
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Real-Time Simulation</p>
                      <p className="text-sm text-muted-foreground">
                        Generates traffic patterns in real-time for dynamic cyber range scenarios
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Training & Evaluation Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">CAIDA Traffic Traces</h3>
                      <Badge variant="secondary">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      High-volume backbone network traffic with diverse topology configurations
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">UNSW-NB15</h3>
                      <Badge variant="secondary">Secondary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Contemporary network traffic dataset with labeled attack patterns
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Custom Enterprise Network</h3>
                      <Badge variant="secondary">Validation</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-world enterprise network traces for model validation
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
