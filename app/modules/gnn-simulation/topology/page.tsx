"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, ArrowLeft, Play, Pause, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  traffic: number
  degree: number
}

interface Edge {
  source: number
  target: number
  weight: number
}

interface NetworkData {
  nodes: Node[]
  edges: Edge[]
}

export default function TopologyVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const networkDataRef = useRef<NetworkData | null>(null)
  const [, setRenderTrigger] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [zoom, setZoom] = useState(1)
  const [numNodes, setNumNodes] = useState(30)
  const animationRef = useRef<number>()

  const generateNetwork = () => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const width = 800
    const height = 600

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        traffic: Math.random() * 100,
        degree: 0,
      })
    }

    for (let i = 0; i < numNodes; i++) {
      const numConnections = Math.floor(Math.random() * 3) + 2
      for (let j = 0; j < numConnections; j++) {
        const target = Math.floor(Math.random() * numNodes)
        if (target !== i && !edges.some((e) => e.source === i && e.target === target)) {
          edges.push({
            source: i,
            target,
            weight: Math.random(),
          })
          nodes[i].degree++
          nodes[target].degree++
        }
      }
    }

    networkDataRef.current = { nodes, edges }
    setRenderTrigger((t) => t + 1)
    setIsRunning(true)
  }

  useEffect(() => {
    generateNetwork()
  }, [])

  const simulateForces = () => {
    if (!networkDataRef.current || !isRunning) return

    const { nodes, edges } = networkDataRef.current
    const width = 800
    const height = 600
    const repulsionStrength = 2000
    const attractionStrength = 0.01
    const damping = 0.8

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x
        const dy = nodes[j].y - nodes[i].y
        const distance = Math.sqrt(dx * dx + dy * dy) || 1
        const force = repulsionStrength / (distance * distance)

        nodes[i].vx -= (dx / distance) * force
        nodes[i].vy -= (dy / distance) * force
        nodes[j].vx += (dx / distance) * force
        nodes[j].vy += (dy / distance) * force
      }
    }

    edges.forEach((edge) => {
      const source = nodes[edge.source]
      const target = nodes[edge.target]
      const dx = target.x - source.x
      const dy = target.y - source.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      const force = distance * attractionStrength

      source.vx += dx * force
      source.vy += dy * force
      target.vx -= dx * force
      target.vy -= dy * force
    })

    nodes.forEach((node) => {
      node.x += node.vx
      node.y += node.vy
      node.vx *= damping
      node.vy *= damping

      node.x = Math.max(50, Math.min(width - 50, node.x))
      node.y = Math.max(50, Math.min(height - 50, node.y))
    })

    nodes.forEach((node) => {
      node.traffic += (Math.random() - 0.5) * 5
      node.traffic = Math.max(0, Math.min(100, node.traffic))
    })
  }

  const renderNetwork = () => {
    const canvas = canvasRef.current
    if (!canvas || !networkDataRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(zoom, zoom)

    const { nodes, edges } = networkDataRef.current

    ctx.strokeStyle = "rgba(100, 116, 139, 0.3)"
    ctx.lineWidth = 1
    edges.forEach((edge) => {
      const source = nodes[edge.source]
      const target = nodes[edge.target]
      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)
      ctx.lineWidth = 1 + edge.weight * 2
      ctx.stroke()
    })

    nodes.forEach((node) => {
      const radius = 5 + (node.traffic / 100) * 10
      const hue = 200 + (node.traffic / 100) * 60

      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = selectedNode?.id === node.id ? "#f59e0b" : "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1.5
      ctx.stroke()

      ctx.fillStyle = "#fff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.id.toString(), node.x, node.y + 3)
    })

    ctx.restore()
  }

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        simulateForces()
        renderNetwork()
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      renderNetwork()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, zoom, selectedNode])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !networkDataRef.current) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const clicked = networkDataRef.current.nodes.find((node) => {
      const dx = x - node.x
      const dy = y - node.y
      const radius = 5 + (node.traffic / 100) * 10
      return Math.sqrt(dx * dx + dy * dy) < radius
    })

    setSelectedNode(clicked || null)
  }

  const networkData = networkDataRef.current

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
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
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Network Topology Visualization</h1>
            </div>
          </div>
          <Badge variant="outline">Module 1 - Topology</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Interactive Network Graph</CardTitle>
            <CardDescription className="text-base">
              Force-directed layout visualization of network topology with real-time traffic flow
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Network Graph</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="bg-transparent"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                      className="bg-transparent"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRunning(!isRunning)}
                      className="bg-transparent"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={generateNetwork} className="bg-transparent">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>Click nodes to view details • Zoom: {(zoom * 100).toFixed(0)}%</CardDescription>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onClick={handleCanvasClick}
                  className="w-full border border-border/50 rounded-lg bg-muted/20 cursor-pointer"
                />
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Low Traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-400" />
                    <span className="text-muted-foreground">Medium Traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-teal-300" />
                    <span className="text-muted-foreground">High Traffic</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Number of Nodes: {numNodes}</Label>
                  <Slider
                    value={[numNodes]}
                    onValueChange={(v) => setNumNodes(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    disabled={isRunning}
                  />
                </div>

                <Button onClick={generateNetwork} className="w-full" disabled={isRunning}>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Network
                </Button>

                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="font-medium mb-1">Visualization Features:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Node size = traffic volume</li>
                    <li>• Node color = traffic intensity</li>
                    <li>• Edge thickness = connection weight</li>
                    <li>• Force-directed layout</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {selectedNode && (
              <Card className="border-border/50 animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Node {selectedNode.id}</CardTitle>
                  <CardDescription>Detailed information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Traffic Load</p>
                      <p className="text-xl font-bold text-primary">{selectedNode.traffic.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Connections</p>
                      <p className="text-xl font-bold text-primary">{selectedNode.degree}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Position X</p>
                      <p className="font-mono text-sm">{selectedNode.x.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Position Y</p>
                      <p className="font-mono text-sm">{selectedNode.y.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Status:{" "}
                      {selectedNode.traffic > 70 ? "High Load" : selectedNode.traffic > 40 ? "Normal" : "Low Load"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {networkData && (
              <Card className="border-border/50 bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Network Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Nodes</span>
                    <span className="font-semibold">{networkData.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Edges</span>
                    <span className="font-semibold">{networkData.edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Degree</span>
                    <span className="font-semibold">
                      {(networkData.nodes.reduce((sum, n) => sum + n.degree, 0) / networkData.nodes.length).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Traffic</span>
                    <span className="font-semibold">
                      {(networkData.nodes.reduce((sum, n) => sum + n.traffic, 0) / networkData.nodes.length).toFixed(1)}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
