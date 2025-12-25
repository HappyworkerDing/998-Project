"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface TrafficFeatures {
  packet_rate: number[]
  byte_rate: number[]
  flow_count: number[]
  avg_packet_size: number[]
}

export default function FeatureAnalysisPage() {
  const [features, setFeatures] = useState<TrafficFeatures | null>(null)
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([])

  const featureNames = ["packet_rate", "byte_rate", "flow_count", "avg_packet_size"]
  const featureLabels = ["Packet Rate", "Byte Rate", "Flow Count", "Avg Packet Size"]

  // Generate synthetic feature data
  const generateFeatureData = () => {
    const n = 100 // Number of samples

    const packet_rate = Array.from({ length: n }, () => Math.random() * 1000 + 500)
    const byte_rate = packet_rate.map((pr) => pr * (1200 + Math.random() * 400)) // Correlated with packet rate
    const flow_count = Array.from({ length: n }, () => Math.random() * 50 + 10)
    const avg_packet_size = byte_rate.map((br, i) => br / packet_rate[i] + Math.random() * 100)

    const data: TrafficFeatures = {
      packet_rate,
      byte_rate,
      flow_count,
      avg_packet_size,
    }

    setFeatures(data)
    calculateCorrelations(data)
  }

  // Calculate correlation matrix
  const calculateCorrelations = (data: TrafficFeatures) => {
    const featureArrays = [data.packet_rate, data.byte_rate, data.flow_count, data.avg_packet_size]

    const matrix: number[][] = []

    for (let i = 0; i < 4; i++) {
      const row: number[] = []
      for (let j = 0; j < 4; j++) {
        const corr = pearsonCorrelation(featureArrays[i], featureArrays[j])
        row.push(corr)
      }
      matrix.push(row)
    }

    setCorrelationMatrix(matrix)
  }

  // Pearson correlation coefficient
  const pearsonCorrelation = (x: number[], y: number[]) => {
    const n = x.length
    const sum_x = x.reduce((a, b) => a + b, 0)
    const sum_y = y.reduce((a, b) => a + b, 0)
    const sum_xy = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sum_x2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sum_y2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sum_xy - sum_x * sum_y
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y))

    return denominator === 0 ? 0 : numerator / denominator
  }

  // Get color for correlation value
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue > 0.7) return "hsl(220, 90%, 50%)" // Strong correlation - blue
    if (absValue > 0.4) return "hsl(200, 70%, 60%)" // Moderate correlation - light blue
    return "hsl(220, 20%, 80%)" // Weak correlation - gray
  }

  // Prepare scatter plot data for feature pairs
  const getScatterData = (feature1: keyof TrafficFeatures, feature2: keyof TrafficFeatures) => {
    if (!features) return []
    return features[feature1].map((val, i) => ({
      x: val,
      y: features[feature2][i],
    }))
  }

  // Prepare distribution data (histogram)
  const getDistributionData = (featureName: keyof TrafficFeatures) => {
    if (!features) return []

    const data = features[featureName]
    const min = Math.min(...data)
    const max = Math.max(...data)
    const bins = 15
    const binWidth = (max - min) / bins

    const histogram = Array(bins).fill(0)
    data.forEach((val) => {
      const binIndex = Math.min(Math.floor((val - min) / binWidth), bins - 1)
      histogram[binIndex]++
    })

    return histogram.map((count, i) => ({
      range: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
      count,
      midpoint: min + (i + 0.5) * binWidth,
    }))
  }

  // Calculate summary statistics
  const getStatistics = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b)
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const median = sorted[Math.floor(sorted.length / 2)]
    const q1 = sorted[Math.floor(sorted.length * 0.25)]
    const q3 = sorted[Math.floor(sorted.length * 0.75)]

    return { mean, stdDev, min, max, median, q1, q3 }
  }

  // Initialize data on mount
  useEffect(() => {
    generateFeatureData()
  }, [])

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
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Feature Analysis</h1>
            </div>
          </div>
          <Badge variant="outline">Module 1 - Analysis</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Traffic Feature Analysis</CardTitle>
                <CardDescription className="text-base">
                  Correlation analysis and statistical distribution of network traffic features
                </CardDescription>
              </div>
              <Button onClick={generateFeatureData} variant="outline" className="bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Correlation Matrix */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Feature Correlation Matrix</CardTitle>
            <CardDescription>Pearson correlation coefficients between traffic features</CardDescription>
          </CardHeader>
          <CardContent>
            {correlationMatrix.length > 0 && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="inline-flex flex-col gap-1 min-w-full">
                    {/* Header row */}
                    <div className="flex gap-1">
                      <div className="w-32" />
                      {featureLabels.map((label) => (
                        <div key={label} className="w-32 text-xs font-semibold text-center text-muted-foreground p-2">
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Data rows */}
                    {correlationMatrix.map((row, i) => (
                      <div key={i} className="flex gap-1">
                        <div className="w-32 text-xs font-semibold text-right text-muted-foreground p-2 flex items-center justify-end">
                          {featureLabels[i]}
                        </div>
                        {row.map((value, j) => (
                          <div
                            key={j}
                            className="w-32 h-16 rounded flex items-center justify-center text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
                            style={{
                              backgroundColor: getCorrelationColor(value),
                              color: Math.abs(value) > 0.4 ? "white" : "hsl(220, 20%, 40%)",
                            }}
                            title={`${featureLabels[i]} vs ${featureLabels[j]}: ${value.toFixed(3)}`}
                          >
                            {value.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">Correlation strength:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(220, 20%, 80%)" }} />
                      <span className="text-xs text-muted-foreground">Weak (0-0.4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(200, 70%, 60%)" }} />
                      <span className="text-xs text-muted-foreground">Moderate (0.4-0.7)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(220, 90%, 50%)" }} />
                      <span className="text-xs text-muted-foreground">Strong (0.7+)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Pair Scatter Plots */}
        <Tabs defaultValue="pair1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pair1">Packet Rate vs Byte Rate</TabsTrigger>
            <TabsTrigger value="pair2">Packet Rate vs Flow Count</TabsTrigger>
            <TabsTrigger value="pair3">Byte Rate vs Packet Size</TabsTrigger>
          </TabsList>

          <TabsContent value="pair1">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Packet Rate vs Byte Rate</CardTitle>
                <CardDescription>Scatter plot showing relationship between features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="x" name="Packet Rate" label={{ value: "Packet Rate (pps)", position: "bottom" }} />
                    <YAxis dataKey="y" name="Byte Rate" label={{ value: "Byte Rate (Bps)", angle: -90 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={getScatterData("packet_rate", "byte_rate")} fill="hsl(220, 90%, 50%)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pair2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Packet Rate vs Flow Count</CardTitle>
                <CardDescription>Scatter plot showing relationship between features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="x" name="Packet Rate" label={{ value: "Packet Rate (pps)", position: "bottom" }} />
                    <YAxis dataKey="y" name="Flow Count" label={{ value: "Flow Count", angle: -90 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={getScatterData("packet_rate", "flow_count")} fill="hsl(200, 80%, 55%)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pair3">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Byte Rate vs Average Packet Size</CardTitle>
                <CardDescription>Scatter plot showing relationship between features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="x" name="Byte Rate" label={{ value: "Byte Rate (Bps)", position: "bottom" }} />
                    <YAxis
                      dataKey="y"
                      name="Avg Packet Size"
                      label={{ value: "Avg Packet Size (bytes)", angle: -90 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={getScatterData("byte_rate", "avg_packet_size")} fill="hsl(180, 70%, 50%)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Distribution Analysis */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Feature Distributions</CardTitle>
            <CardDescription>Histogram and statistical summary for each traffic feature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features &&
                (Object.keys(features) as Array<keyof TrafficFeatures>).map((featureName, idx) => {
                  const stats = getStatistics(features[featureName])
                  const distData = getDistributionData(featureName)

                  return (
                    <div key={featureName} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{featureLabels[idx]}</h3>
                        <Badge variant="outline">n = {features[featureName].length}</Badge>
                      </div>

                      {/* Histogram */}
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={distData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                        <div>
                          <span className="text-muted-foreground">Mean:</span>
                          <span className="font-semibold ml-2">{stats.mean.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Std Dev:</span>
                          <span className="font-semibold ml-2">{stats.stdDev.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Min:</span>
                          <span className="font-semibold ml-2">{stats.min.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max:</span>
                          <span className="font-semibold ml-2">{stats.max.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Median:</span>
                          <span className="font-semibold ml-2">{stats.median.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">IQR:</span>
                          <span className="font-semibold ml-2">{(stats.q3 - stats.q1).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-border/50 bg-muted/30">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Strong correlation</strong> between Packet Rate and Byte Rate indicates consistent packet size
                  patterns
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Flow Count</strong> shows relatively independent behavior, suggesting diverse traffic sources
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Average Packet Size</strong> distribution reveals typical network application patterns
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Understanding these relationships helps in designing more accurate{" "}
                  <strong>GNN prediction models</strong>
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
