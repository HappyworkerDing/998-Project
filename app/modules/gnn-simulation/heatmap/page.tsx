"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, ArrowLeft, Play, RotateCcw, Pause } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type FeatureType = "packet_rate" | "byte_rate" | "flow_count" | "avg_packet_size"

export default function HeatmapDashboard() {
  const [isRunning, setIsRunning] = useState(false)
  const [trafficData, setTrafficData] = useState<number[][]>([])
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>("packet_rate")
  const [numNodes, setNumNodes] = useState(30)
  const [timeSteps, setTimeSteps] = useState(50)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(100)

  const featureNames = {
    packet_rate: "Packet Rate (pps)",
    byte_rate: "Byte Rate (Bps)",
    flow_count: "Flow Count",
    avg_packet_size: "Avg Packet Size (bytes)",
  }

  // Generate synthetic traffic data
  const generateTrafficData = () => {
    const data: number[][] = []
    for (let t = 0; t < timeSteps; t++) {
      const timeData: number[] = []
      for (let n = 0; n < numNodes; n++) {
        // Create realistic traffic patterns
        const baseValue = Math.sin((t / timeSteps) * Math.PI * 2) * 0.3 + 0.5
        const nodeVariation = Math.sin((n / numNodes) * Math.PI * 4) * 0.2
        const noise = Math.random() * 0.3
        const value = Math.max(0, Math.min(1, baseValue + nodeVariation + noise))

        timeData.push(value)
      }
      data.push(timeData)
    }
    setTrafficData(data)
    setCurrentTime(0)
  }

  // Auto-play animation
  useEffect(() => {
    if (!isRunning || trafficData.length === 0) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= timeSteps - 1) {
          setIsRunning(false)
          return prev
        }
        return prev + 1
      })
    }, playbackSpeed)

    return () => clearInterval(interval)
  }, [isRunning, trafficData, timeSteps, playbackSpeed])

  // Get color based on traffic intensity
  const getColor = (value: number) => {
    const hue = 200 + value * 60 // Blue to cyan
    const saturation = 70 + value * 20
    const lightness = 30 + value * 40
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // Calculate statistics
  const getStatistics = () => {
    if (trafficData.length === 0 || currentTime >= trafficData.length) {
      return { avg: 0, max: 0, min: 0, stdDev: 0 }
    }

    const currentData = trafficData[currentTime]
    const avg = currentData.reduce((sum, val) => sum + val, 0) / currentData.length
    const max = Math.max(...currentData)
    const min = Math.min(...currentData)

    const variance = currentData.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / currentData.length
    const stdDev = Math.sqrt(variance)

    return { avg, max, min, stdDev }
  }

  const stats = getStatistics()

  // Get node ranking by traffic
  const getTopNodes = () => {
    if (trafficData.length === 0 || currentTime >= trafficData.length) return []

    const currentData = trafficData[currentTime]
    return currentData
      .map((value, index) => ({ node: index, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/modules/gnn-simulation">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Traffic Heatmap Dashboard</h1>
            </div>
          </div>
          <Badge variant="outline">Module 1 - Heatmap</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Temporal Traffic Heatmap</CardTitle>
            <CardDescription className="text-base">
              Visualize network traffic intensity across nodes and time with spatial-temporal patterns
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Heatmap */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Traffic Heatmap</CardTitle>
                    <CardDescription>
                      Time Step: {currentTime} / {timeSteps - 1}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRunning(!isRunning)}
                      disabled={trafficData.length === 0}
                      className="bg-transparent"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={generateTrafficData} className="bg-transparent">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {trafficData.length === 0 ? (
                  <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg border border-border/50">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">No data loaded</p>
                      <Button onClick={generateTrafficData}>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Traffic Data
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Timeline Slider */}
                    <div className="space-y-2">
                      <Label>Timeline Position: {currentTime}</Label>
                      <Slider
                        value={[currentTime]}
                        onValueChange={(v) => setCurrentTime(v[0])}
                        min={0}
                        max={timeSteps - 1}
                        step={1}
                        disabled={isRunning}
                      />
                    </div>

                    {/* Heatmap Grid */}
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <div className="flex gap-0.5">
                          {/* Time axis labels */}
                          <div className="flex flex-col justify-between pr-2">
                            <div className="text-xs text-muted-foreground text-right py-1">Node</div>
                            {Array.from({ length: Math.min(numNodes, 30) }).map((_, i) => (
                              <div
                                key={i}
                                className="text-xs text-muted-foreground text-right flex items-center justify-end"
                                style={{ height: "20px" }}
                              >
                                {i}
                              </div>
                            ))}
                          </div>

                          {/* Heatmap cells - show window around current time */}
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground text-center mb-1">Time Steps</div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: Math.min(50, timeSteps) }).map((_, t) => {
                                const timeIndex = Math.max(0, Math.min(timeSteps - 50, currentTime - 25)) + t
                                return (
                                  <div key={t} className="flex flex-col gap-0.5">
                                    {Array.from({ length: Math.min(numNodes, 30) }).map((_, n) => {
                                      const value = trafficData[timeIndex]?.[n] || 0
                                      const isCurrentTime = timeIndex === currentTime
                                      return (
                                        <div
                                          key={n}
                                          className={`transition-all ${isCurrentTime ? "ring-2 ring-primary" : ""}`}
                                          style={{
                                            width: "12px",
                                            height: "20px",
                                            backgroundColor: getColor(value),
                                            opacity: isCurrentTime ? 1 : 0.7,
                                          }}
                                          title={`Time: ${timeIndex}, Node: ${n}, Value: ${value.toFixed(3)}`}
                                        />
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Legend */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Traffic Intensity:</span>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <div
                          className="flex-1 h-6 rounded"
                          style={{
                            background:
                              "linear-gradient(to right, hsl(200, 70%, 30%), hsl(220, 80%, 50%), hsl(240, 90%, 60%), hsl(260, 90%, 70%))",
                          }}
                        />
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            {trafficData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Average Traffic</p>
                    <p className="text-2xl font-bold text-primary">{(stats.avg * 100).toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Max Traffic</p>
                    <p className="text-2xl font-bold text-primary">{(stats.max * 100).toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Min Traffic</p>
                    <p className="text-2xl font-bold text-primary">{(stats.min * 100).toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Std Deviation</p>
                    <p className="text-2xl font-bold text-primary">{(stats.stdDev * 100).toFixed(1)}%</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Configuration */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Traffic Feature</Label>
                  <Select value={selectedFeature} onValueChange={(v) => setSelectedFeature(v as FeatureType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="packet_rate">Packet Rate</SelectItem>
                      <SelectItem value="byte_rate">Byte Rate</SelectItem>
                      <SelectItem value="flow_count">Flow Count</SelectItem>
                      <SelectItem value="avg_packet_size">Packet Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Nodes: {numNodes}</Label>
                  <Slider
                    value={[numNodes]}
                    onValueChange={(v) => setNumNodes(v[0])}
                    min={10}
                    max={50}
                    step={5}
                    disabled={isRunning}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Steps: {timeSteps}</Label>
                  <Slider
                    value={[timeSteps]}
                    onValueChange={(v) => setTimeSteps(v[0])}
                    min={20}
                    max={100}
                    step={10}
                    disabled={isRunning}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Playback Speed: {playbackSpeed}ms</Label>
                  <Slider
                    value={[playbackSpeed]}
                    onValueChange={(v) => setPlaybackSpeed(v[0])}
                    min={50}
                    max={500}
                    step={50}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top Nodes */}
            {trafficData.length > 0 && (
              <Card className="border-border/50 bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Highest Traffic Nodes</CardTitle>
                  <CardDescription>Top 5 at current time step</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getTopNodes().map((item, idx) => (
                    <div key={item.node} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 text-center">
                          {idx + 1}
                        </Badge>
                        <span className="font-medium">Node {item.node}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-16 h-2 rounded-full"
                          style={{
                            background: `linear-gradient(to right, transparent ${100 - item.value * 100}%, ${getColor(item.value)} ${100 - item.value * 100}%)`,
                          }}
                        />
                        <span className="text-muted-foreground w-12 text-right">{(item.value * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="border-border/50 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  This heatmap visualizes network traffic patterns across spatial (nodes) and temporal (time)
                  dimensions.
                </p>
                <p className="text-xs">
                  Colors represent traffic intensity, with brighter colors indicating higher traffic loads.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
