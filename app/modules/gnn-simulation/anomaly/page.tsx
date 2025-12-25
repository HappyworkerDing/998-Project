"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  AlertTriangle,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Clock,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface Anomaly {
  id: string
  timestamp: Date
  node: number
  type: "traffic_spike" | "prediction_error" | "connection_anomaly" | "ddos_pattern"
  severity: "low" | "medium" | "high" | "critical"
  metric: string
  value: number
  threshold: number
  description: string
}

export default function AnomalyDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [detectionRate, setDetectionRate] = useState(0)
  const [totalAnomalies, setTotalAnomalies] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const anomalyTypes = [
    { type: "traffic_spike", label: "Traffic Spike", color: "text-yellow-500", count: 0 },
    { type: "prediction_error", label: "Prediction Error", color: "text-red-500", count: 0 },
    { type: "connection_anomaly", label: "Connection Anomaly", color: "text-orange-500", count: 0 },
    { type: "ddos_pattern", label: "DDoS Pattern", color: "text-purple-500", count: 0 },
  ]

  const [typeStats, setTypeStats] = useState(anomalyTypes)

  useEffect(() => {
    // Generate some sample anomalies
    const sampleAnomalies: Anomaly[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000),
        node: 15,
        type: "traffic_spike",
        severity: "high",
        metric: "packet_rate",
        value: 15000,
        threshold: 10000,
        description: "Sudden 150% increase in packet rate detected",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 2400000),
        node: 23,
        type: "prediction_error",
        severity: "medium",
        metric: "prediction_accuracy",
        value: 0.65,
        threshold: 0.85,
        description: "Prediction accuracy dropped below threshold",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 1800000),
        node: 8,
        type: "ddos_pattern",
        severity: "critical",
        metric: "connection_rate",
        value: 50000,
        threshold: 5000,
        description: "Potential DDoS attack pattern detected",
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 900000),
        node: 42,
        type: "connection_anomaly",
        severity: "medium",
        metric: "edge_activity",
        value: 25,
        threshold: 15,
        description: "Unusual connection pattern to external nodes",
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 300000),
        node: 31,
        type: "traffic_spike",
        severity: "low",
        metric: "byte_rate",
        value: 3500,
        threshold: 3000,
        description: "Moderate increase in data transmission rate",
      },
    ]

    setAnomalies(sampleAnomalies)
    setTotalAnomalies(sampleAnomalies.length)
    setDetectionRate(94.5)

    // Update type stats
    const stats = anomalyTypes.map((type) => ({
      ...type,
      count: sampleAnomalies.filter((a) => a.type === type.type).length,
    }))
    setTypeStats(stats)
  }, [])

  const startDetection = () => {
    setIsDetecting(true)

    const interval = setInterval(() => {
      // Simulate anomaly detection
      if (Math.random() < 0.3) {
        const types: Anomaly["type"][] = ["traffic_spike", "prediction_error", "connection_anomaly", "ddos_pattern"]
        const severities: Anomaly["severity"][] = ["low", "medium", "high", "critical"]
        const descriptions = {
          traffic_spike: "Sudden increase in traffic volume detected",
          prediction_error: "Model prediction diverged from actual values",
          connection_anomaly: "Unusual network connection behavior observed",
          ddos_pattern: "Distributed denial of service pattern identified",
        }

        const randomType = types[Math.floor(Math.random() * types.length)]
        const newAnomaly: Anomaly = {
          id: Date.now().toString(),
          timestamp: new Date(),
          node: Math.floor(Math.random() * 50),
          type: randomType,
          severity: severities[Math.floor(Math.random() * severities.length)],
          metric: "network_metric",
          value: Math.random() * 10000,
          threshold: Math.random() * 5000,
          description: descriptions[randomType],
        }

        setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 20))
        setTotalAnomalies((prev) => prev + 1)

        // Update type stats
        setTypeStats((prev) =>
          prev.map((stat) => (stat.type === randomType ? { ...stat, count: stat.count + 1 } : stat)),
        )
      }

      setDetectionRate(92 + Math.random() * 6)
    }, 3000)

    return () => clearInterval(interval)
  }

  const stopDetection = () => {
    setIsDetecting(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-500/10 text-red-500"
      case "high":
        return "border-orange-500 bg-orange-500/10 text-orange-500"
      case "medium":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-500"
      case "low":
        return "border-blue-500 bg-blue-500/10 text-blue-500"
      default:
        return "border-border bg-muted/10"
    }
  }

  const prepareTimelineData = () => {
    const now = Date.now()
    const data = []

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * 3600000)
      const hourAnomalies = anomalies.filter((a) => {
        const diff = now - a.timestamp.getTime()
        return diff >= i * 3600000 && diff < (i + 1) * 3600000
      })

      data.push({
        hour: hour.getHours() + ":00",
        count: hourAnomalies.length,
        critical: hourAnomalies.filter((a) => a.severity === "critical").length,
        high: hourAnomalies.filter((a) => a.severity === "high").length,
      })
    }

    return data
  }

  const prepareNodeDistribution = () => {
    const nodeMap = new Map<number, number>()

    anomalies.forEach((a) => {
      nodeMap.set(a.node, (nodeMap.get(a.node) || 0) + 1)
    })

    return Array.from(nodeMap.entries())
      .map(([node, count]) => ({ node, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
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
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold">Anomaly Detection</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDetecting ? (
              <>
                <div className="flex items-center gap-2 mr-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Scanning</span>
                </div>
                <Button onClick={stopDetection} variant="outline" size="sm">
                  Stop Detection
                </Button>
              </>
            ) : (
              <Button onClick={startDetection} size="sm">
                <Search className="w-4 h-4 mr-2" />
                Start Detection
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Anomalies</p>
                  <p className="text-3xl font-bold mt-1">{totalAnomalies}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertOctagon className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Detection Rate</p>
                  <p className="text-3xl font-bold mt-1">{detectionRate.toFixed(1)}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">Optimal</span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-3xl font-bold mt-1">{anomalies.filter((a) => a.severity === "critical").length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold mt-1">1.8s</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-500">Fast</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomaly Type Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Anomaly Type Distribution</CardTitle>
            <CardDescription>Breakdown by detection category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {typeStats.map((stat) => (
                <div
                  key={stat.type}
                  className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                    <Badge variant="outline">{stat.count}</Badge>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.color.replace("text-", "bg-")}`}
                      style={{ width: `${(stat.count / totalAnomalies) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Recent Anomalies */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Anomalies</span>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </CardTitle>
                <CardDescription>Latest detected anomalies across the network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {anomalies.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No anomalies detected. System running normally.</p>
                    </div>
                  ) : (
                    anomalies.map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                                {anomaly.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary">Node {anomaly.node}</Badge>
                              <span className="text-xs text-muted-foreground">{anomaly.type.replace("_", " ")}</span>
                            </div>
                            <p className="font-medium mb-1">{anomaly.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Metric: <span className="font-mono">{anomaly.metric}</span>
                              </span>
                              <span>
                                Value: <span className="font-mono">{anomaly.value.toFixed(2)}</span>
                              </span>
                              <span>
                                Threshold: <span className="font-mono">{anomaly.threshold.toFixed(2)}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{formatTimestamp(anomaly.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6 mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Anomaly Timeline</CardTitle>
                <CardDescription>Hourly distribution of detected anomalies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={prepareTimelineData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="critical"
                      stackId="2"
                      stroke="hsl(0, 72%, 51%)"
                      fill="hsl(0, 72%, 51%)"
                      fillOpacity={0.6}
                      name="Critical"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Top Affected Nodes</CardTitle>
                <CardDescription>Nodes with the most anomaly detections</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={prepareNodeDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="node"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Node ID", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Anomaly Count", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Detection Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      High Risk Nodes
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Nodes 8, 15, and 23 show repeated anomalies and require immediate attention.
                    </p>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Pattern Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Traffic spike anomalies show a periodic pattern every 6 hours, suggesting scheduled processes.
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Threshold
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Model Performance
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      GNN model maintains 94.5% detection accuracy with minimal false positives.
                    </p>
                    <Button variant="outline" size="sm">
                      Training Metrics
                    </Button>
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

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}
