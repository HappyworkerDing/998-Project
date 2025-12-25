"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Server,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface Alert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: Date
  node?: number
}

export default function MonitoringDashboard() {
  const [isRunning, setIsRunning] = useState(false)
  const [networkHealth, setNetworkHealth] = useState(95)
  const [avgLatency, setAvgLatency] = useState(12.3)
  const [throughput, setThroughput] = useState(850)
  const [predictionAccuracy, setPredictionAccuracy] = useState(0.94)
  const [activeNodes, setActiveNodes] = useState(45)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metricsHistory, setMetricsHistory] = useState<any[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      health: 92 + Math.random() * 6,
      latency: 10 + Math.random() * 5,
      throughput: 800 + Math.random() * 200,
      accuracy: 0.9 + Math.random() * 0.08,
    }))
    setMetricsHistory(initialData)

    // Add some initial alerts
    setAlerts([
      {
        id: "1",
        type: "info",
        message: "System initialized successfully",
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: "2",
        type: "warning",
        message: "High traffic detected on Node 23",
        timestamp: new Date(Date.now() - 120000),
        node: 23,
      },
    ])

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const startMonitoring = () => {
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      // Update metrics with realistic variations
      const newHealth = Math.max(85, Math.min(100, networkHealth + (Math.random() - 0.5) * 3))
      const newLatency = Math.max(8, avgLatency + (Math.random() - 0.5) * 2)
      const newThroughput = Math.max(600, throughput + (Math.random() - 0.5) * 100)
      const newAccuracy = Math.max(0.85, Math.min(0.99, predictionAccuracy + (Math.random() - 0.5) * 0.03))

      setNetworkHealth(newHealth)
      setAvgLatency(newLatency)
      setThroughput(newThroughput)
      setPredictionAccuracy(newAccuracy)
      setActiveNodes(Math.floor(40 + Math.random() * 10))

      // Update history
      setMetricsHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: prev.length,
            health: newHealth,
            latency: newLatency,
            throughput: newThroughput,
            accuracy: newAccuracy,
          },
        ]
        return newHistory.slice(-30) // Keep last 30 points
      })

      // Randomly generate alerts
      if (Math.random() < 0.1) {
        const alertTypes: ("warning" | "error" | "info")[] = ["warning", "error", "info"]
        const messages = [
          "Traffic spike detected",
          "Prediction accuracy below threshold",
          "High latency on edge connections",
          "Node capacity reaching limit",
          "Network topology change detected",
        ]

        const newAlert: Alert = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          node: Math.floor(Math.random() * 50),
        }

        setAlerts((prev) => [newAlert, ...prev].slice(0, 10))
      }
    }, 2000)
  }

  const stopMonitoring = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const getHealthStatus = (health: number) => {
    if (health >= 95) return { label: "Excellent", color: "text-green-500", icon: CheckCircle2 }
    if (health >= 85) return { label: "Good", color: "text-blue-500", icon: Activity }
    if (health >= 70) return { label: "Fair", color: "text-yellow-500", icon: AlertTriangle }
    return { label: "Poor", color: "text-red-500", icon: AlertTriangle }
  }

  const healthStatus = getHealthStatus(networkHealth)
  const HealthIcon = healthStatus.icon

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
              <Activity className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold">Real-time Monitoring</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <div className="flex items-center gap-2 mr-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
                <Button onClick={stopMonitoring} variant="outline" size="sm">
                  Stop Monitoring
                </Button>
              </>
            ) : (
              <Button onClick={startMonitoring} size="sm">
                Start Monitoring
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Network Health</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{networkHealth.toFixed(1)}%</p>
                    <Badge variant="outline" className={healthStatus.color}>
                      <HealthIcon className="w-3 h-3 mr-1" />
                      {healthStatus.label}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Latency</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{avgLatency.toFixed(1)}</p>
                    <span className="text-sm text-muted-foreground">ms</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {avgLatency < 15 ? (
                      <TrendingDown className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${avgLatency < 15 ? "text-green-500" : "text-red-500"}`}>
                      {avgLatency < 15 ? "Low" : "High"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Throughput</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{Math.round(throughput)}</p>
                    <span className="text-sm text-muted-foreground">Mbps</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Real-time</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold">{(predictionAccuracy * 100).toFixed(1)}%</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activeNodes} active nodes</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Network Health & Accuracy</CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    dataKey="health"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    name="Health %"
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(142, 76%, 36%)"
                    fill="hsl(142, 76%, 36%)"
                    fillOpacity={0.2}
                    name="Accuracy"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Latency & Throughput</CardTitle>
              <CardDescription>Network performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={false}
                    name="Latency (ms)"
                  />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke="hsl(48, 96%, 53%)"
                    strokeWidth={2}
                    dot={false}
                    name="Throughput (Mbps)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No alerts. System running smoothly.</div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.type === "error"
                          ? "bg-red-500/5 border-red-500/20"
                          : alert.type === "warning"
                            ? "bg-yellow-500/5 border-yellow-500/20"
                            : "bg-blue-500/5 border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                alert.type === "error"
                                  ? "border-red-500 text-red-500"
                                  : alert.type === "warning"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-blue-500 text-blue-500"
                              }
                            >
                              {alert.type}
                            </Badge>
                            {alert.node !== undefined && (
                              <span className="text-xs text-muted-foreground">Node {alert.node}</span>
                            )}
                          </div>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">GNN Model</span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Pipeline</span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prediction Service</span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alert System</span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">CPU Usage</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Memory Usage</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "62%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
