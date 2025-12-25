"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, Database, Server } from "lucide-react"
import Link from "next/link"

export default function IntrusionDetectionPage() {
  const [monitoring, setMonitoring] = useState(false)
  const [threatsDetected, setThreatsDetected] = useState(0)
  const [eventsProcessed, setEventsProcessed] = useState(0)

  const startMonitoring = () => {
    setMonitoring(true)
    setThreatsDetected(0)
    setEventsProcessed(0)

    const interval = setInterval(() => {
      setEventsProcessed((prev) => prev + Math.floor(Math.random() * 50) + 20)
      if (Math.random() > 0.7) {
        setThreatsDetected((prev) => prev + 1)
      }
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)
      setMonitoring(false)
    }, 10000)
  }

  const stopMonitoring = () => {
    setMonitoring(false)
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
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Intrusion Detection System</h1>
            </div>
          </div>
          <Badge variant="outline">Module 3</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Multi-Modal Network Intrusion Detection</CardTitle>
            <CardDescription className="text-base">
              AI-powered detection system with multi-source data collection and temporal alignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data Sources</p>
                      <p className="font-semibold">Multi-Modal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Server className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lead Researcher</p>
                      <p className="font-semibold">Shaowen Ding</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Implementation</p>
                      <p className="font-semibold">Go + Python</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Monitoring Dashboard */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Real-Time Threat Detection</CardTitle>
            <CardDescription>Monitor network activity and detect intrusions in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Button onClick={startMonitoring} disabled={monitoring} className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Start Monitoring
              </Button>
              <Button
                onClick={stopMonitoring}
                variant="outline"
                disabled={!monitoring}
                className="flex items-center gap-2 bg-transparent"
              >
                Stop
              </Button>
              {monitoring && (
                <Badge variant="outline" className="ml-auto animate-pulse">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Active
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <p className="font-medium">Events Processed</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary">{eventsProcessed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Network traffic, logs, host behaviors</p>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <p className="font-medium">Threats Detected</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-destructive">{threatsDetected}</p>
                  <p className="text-xs text-muted-foreground mt-1">Anomalies requiring investigation</p>
                </CardContent>
              </Card>
            </div>

            {threatsDetected > 0 && (
              <Card className="bg-destructive/5 border-destructive/20 animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: Math.min(threatsDetected, 3) }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {["Port Scan Detected", "SQL Injection Attempt", "Unusual Traffic Pattern"][i % 3]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {["192.168.1.45", "10.0.0.123", "172.16.5.89"][i % 3]} • Just now
                          </p>
                        </div>
                        <Badge variant="destructive">High</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="min-h-[300px] bg-muted/30 rounded-lg border border-dashed border-border/50 flex items-center justify-center">
              <p className="text-muted-foreground">Network Traffic Visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="detection">Detection Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">1.</span> Data Collection Layer (Go)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      High-performance collectors written in Go capture network packets, system logs, and host behaviors
                      with minimal overhead. Supports distributed deployment across network segments.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">2.</span> Data Preprocessing Pipeline
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Timestamp alignment, format standardization, and stream synchronization ensure temporal coherence
                      across heterogeneous data sources for accurate multi-modal analysis.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">3.</span> AI Detection Engine
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Deep learning models (CNN, RNN, Transformer) trained on multi-modal features detect known and
                      zero-day attacks. Ensemble methods improve robustness and reduce false positives.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-primary">4.</span> Alert & Response System
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time alerting with severity classification, automated response actions, and integration with
                      SIEM platforms for comprehensive security operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Multi-Modal Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Network Traffic</h3>
                      <Badge variant="secondary">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Packet-level capture with flow metadata: IPs, ports, protocols, payload patterns
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        TCP/UDP
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        HTTP/HTTPS
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        DNS
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">System Logs</h3>
                      <Badge variant="secondary">Secondary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Authentication attempts, system calls, service status, error messages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        Syslog
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Windows Events
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Application Logs
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Host Behaviors</h3>
                      <Badge variant="secondary">Tertiary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Process execution, file system changes, registry modifications, memory usage
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        Process Monitor
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        File Integrity
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Resource Usage
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detection">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Detection Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Signature-Based Detection</p>
                      <p className="text-sm text-muted-foreground">
                        Pattern matching against known attack signatures and indicators of compromise (IoCs)
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Anomaly Detection</p>
                      <p className="text-sm text-muted-foreground">
                        Statistical and ML-based models identify deviations from baseline normal behavior
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Behavioral Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Monitors sequences of actions and correlates events across data sources for advanced threats
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Deep Learning Classification</p>
                      <p className="text-sm text-muted-foreground">
                        Neural networks trained on labeled attack data classify traffic into benign/malicious categories
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-primary font-bold">•</span>
                    <div>
                      <p className="font-medium">Temporal Correlation</p>
                      <p className="text-sm text-muted-foreground">
                        Aligns multi-modal events in time to detect multi-stage attacks and kill chain progression
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
