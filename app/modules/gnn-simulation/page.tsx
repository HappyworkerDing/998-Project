"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, ArrowLeft, Play, RotateCcw, TrendingUp, Activity, Zap } from "lucide-react"
import Link from "next/link"

export default function GNNSimulationPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const startSimulation = () => {
    setIsSimulating(true)
    setSimulationProgress(0)
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSimulating(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setSimulationProgress(0)
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
            <CardDescription>Run and monitor GNN-based network traffic simulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Button onClick={startSimulation} disabled={isSimulating} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Simulation
              </Button>
              <Button onClick={resetSimulation} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Simulation Progress</span>
                <span className="font-medium">{simulationProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>

            {simulationProgress > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Network Nodes Processed</p>
                    <p className="text-2xl font-bold text-primary">{Math.floor(simulationProgress * 1.2)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Traffic Flows Generated</p>
                    <p className="text-2xl font-bold text-primary">{Math.floor(simulationProgress * 3.5)}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="min-h-[300px] bg-muted/30 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
              <p className="text-muted-foreground">Network Topology Visualization</p>
            </div>
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
