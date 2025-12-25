"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Download, Play } from "lucide-react"
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

export default function TrainingHistoryPage() {
  const [selectedModel, setSelectedModel] = useState("model_v3")

  // Generate training data
  const generateTrainingData = (epochs: number) => {
    const data = []
    for (let i = 1; i <= epochs; i++) {
      const trainLoss = Math.exp(-i / 30) * 0.5 + Math.random() * 0.05 + 0.05
      const valLoss = Math.exp(-i / 30) * 0.5 + Math.random() * 0.08 + 0.08
      const trainAcc = 1 - trainLoss * 0.8
      const valAcc = 1 - valLoss * 0.8

      data.push({
        epoch: i,
        trainLoss,
        valLoss,
        trainAccuracy: trainAcc,
        valAccuracy: valAcc,
        learningRate: 0.001 * Math.pow(0.95, Math.floor(i / 10)),
      })
    }
    return data
  }

  const trainingData = generateTrainingData(100)

  const models = [
    {
      id: "model_v3",
      name: "GNN-GRU v3.0",
      status: "deployed",
      epochs: 100,
      bestEpoch: 87,
      trainLoss: 0.082,
      valLoss: 0.095,
      accuracy: 0.94,
      timestamp: "2025-01-15 14:30",
    },
    {
      id: "model_v2",
      name: "GNN-GRU v2.1",
      status: "archived",
      epochs: 80,
      bestEpoch: 72,
      trainLoss: 0.105,
      valLoss: 0.118,
      accuracy: 0.91,
      timestamp: "2025-01-10 09:15",
    },
    {
      id: "model_v1",
      name: "GNN-GRU v1.5",
      status: "archived",
      epochs: 60,
      bestEpoch: 55,
      trainLoss: 0.142,
      valLoss: 0.165,
      accuracy: 0.87,
      timestamp: "2025-01-05 16:45",
    },
  ]

  const selectedModelData = models.find((m) => m.id === selectedModel) || models[0]

  const checkpoints = [
    { epoch: 10, loss: 0.245, accuracy: 0.78, size: "45.2 MB" },
    { epoch: 25, loss: 0.185, accuracy: 0.85, size: "45.3 MB" },
    { epoch: 50, loss: 0.132, accuracy: 0.89, size: "45.4 MB" },
    { epoch: 75, loss: 0.098, accuracy: 0.92, size: "45.5 MB" },
    { epoch: 87, loss: 0.082, accuracy: 0.94, size: "45.6 MB", isBest: true },
    { epoch: 100, loss: 0.089, accuracy: 0.93, size: "45.7 MB" },
  ]

  const hyperparameters = {
    architecture: {
      gnn_layers: 3,
      gnn_hidden_dim: 128,
      gru_layers: 2,
      gru_hidden_dim: 64,
      dropout: 0.2,
    },
    training: {
      batch_size: 32,
      learning_rate: 0.001,
      optimizer: "Adam",
      scheduler: "StepLR",
      weight_decay: 0.0001,
    },
    data: {
      train_samples: 12500,
      val_samples: 2500,
      test_samples: 2500,
      sequence_length: 20,
    },
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
              <TrendingUp className="w-5 h-5 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold">Training History</h1>
            </div>
          </div>
          <Button size="sm">
            <Play className="w-4 h-4 mr-2" />
            New Training Run
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Model Selection */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Model Versions</CardTitle>
            <CardDescription>Compare training history across different model versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedModel === model.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-muted/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{model.name}</h3>
                    <Badge
                      variant={model.status === "deployed" ? "default" : "secondary"}
                      className={model.status === "deployed" ? "bg-green-500" : ""}
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Accuracy: {(model.accuracy * 100).toFixed(1)}%</p>
                    <p>Val Loss: {model.valLoss.toFixed(4)}</p>
                    <p className="text-xs">{model.timestamp}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Epochs</p>
              <p className="text-3xl font-bold">{selectedModelData.epochs}</p>
              <p className="text-xs text-muted-foreground mt-1">Best at epoch {selectedModelData.bestEpoch}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Final Accuracy</p>
              <p className="text-3xl font-bold">{(selectedModelData.accuracy * 100).toFixed(1)}%</p>
              <p className="text-xs text-green-500 mt-1">+3.2% from v2.1</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Train Loss</p>
              <p className="text-3xl font-bold">{selectedModelData.trainLoss.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground mt-1">Validation: {selectedModelData.valLoss.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Training Time</p>
              <p className="text-3xl font-bold">6.2h</p>
              <p className="text-xs text-muted-foreground mt-1">On Tesla V100</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="curves" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curves">Training Curves</TabsTrigger>
            <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="curves" className="space-y-6 mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Loss Curves</CardTitle>
                <CardDescription>Training and validation loss over epochs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="epoch"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Loss", angle: -90, position: "insideLeft" }}
                    />
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
                      dataKey="trainLoss"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      dot={false}
                      name="Training Loss"
                    />
                    <Line
                      type="monotone"
                      dataKey="valLoss"
                      stroke="hsl(0, 72%, 51%)"
                      strokeWidth={2}
                      dot={false}
                      name="Validation Loss"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Accuracy Curves</CardTitle>
                <CardDescription>Training and validation accuracy progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="epoch"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0.7, 1]}
                      label={{ value: "Accuracy", angle: -90, position: "insideLeft" }}
                    />
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
                      dataKey="trainAccuracy"
                      stroke="hsl(142, 76%, 36%)"
                      fill="hsl(142, 76%, 36%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Training Accuracy"
                    />
                    <Area
                      type="monotone"
                      dataKey="valAccuracy"
                      stroke="hsl(48, 96%, 53%)"
                      fill="hsl(48, 96%, 53%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Validation Accuracy"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Learning Rate Schedule</CardTitle>
                <CardDescription>Learning rate decay over training</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="epoch"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Learning Rate", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="learningRate"
                      stroke="hsl(280, 100%, 70%)"
                      strokeWidth={2}
                      dot={false}
                      name="Learning Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkpoints" className="space-y-6 mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Model Checkpoints</CardTitle>
                <CardDescription>Saved model states during training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checkpoints.map((checkpoint) => (
                    <div
                      key={checkpoint.epoch}
                      className={`p-4 rounded-lg border transition-all ${
                        checkpoint.isBest
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-muted/20 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Epoch {checkpoint.epoch}</h3>
                            {checkpoint.isBest && (
                              <Badge variant="default" className="bg-green-500">
                                Best Model
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Loss</p>
                              <p className="font-medium">{checkpoint.loss.toFixed(4)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Accuracy</p>
                              <p className="font-medium">{(checkpoint.accuracy * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Size</p>
                              <p className="font-medium">{checkpoint.size}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {checkpoint.isBest && (
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Load
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Architecture</CardTitle>
                  <CardDescription>Model structure and layers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(hyperparameters.architecture).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-mono font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Training Configuration</CardTitle>
                  <CardDescription>Optimization parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(hyperparameters.training).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-mono font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                  <CardDescription>Training data statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(hyperparameters.data).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-mono font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Training Environment</CardTitle>
                  <CardDescription>Hardware and software setup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">GPU</span>
                      <span className="font-mono font-medium">NVIDIA Tesla V100</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Framework</span>
                      <span className="font-mono font-medium">PyTorch 2.0.1</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">CUDA Version</span>
                      <span className="font-mono font-medium">11.8</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Python</span>
                      <span className="font-mono font-medium">3.10.12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Model Version Comparison</CardTitle>
                <CardDescription>Performance metrics across different versions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-semibold">Model</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Accuracy</th>
                        <th className="text-left p-3 font-semibold">Train Loss</th>
                        <th className="text-left p-3 font-semibold">Val Loss</th>
                        <th className="text-left p-3 font-semibold">Epochs</th>
                        <th className="text-left p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model) => (
                        <tr key={model.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-3 font-medium">{model.name}</td>
                          <td className="p-3">
                            <Badge
                              variant={model.status === "deployed" ? "default" : "secondary"}
                              className={model.status === "deployed" ? "bg-green-500" : ""}
                            >
                              {model.status}
                            </Badge>
                          </td>
                          <td className="p-3 font-mono">{(model.accuracy * 100).toFixed(1)}%</td>
                          <td className="p-3 font-mono">{model.trainLoss.toFixed(4)}</td>
                          <td className="p-3 font-mono">{model.valLoss.toFixed(4)}</td>
                          <td className="p-3 font-mono">{model.epochs}</td>
                          <td className="p-3 text-sm text-muted-foreground">{model.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Performance Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold mb-2 text-green-500">v3.0 vs v2.1</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Accuracy improved by 3.2% (0.91 to 0.94)
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Validation loss reduced by 19.5% (0.118 to 0.095)
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Training time increased by 15% due to deeper architecture
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold mb-2 text-blue-500">v2.1 vs v1.5</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Accuracy improved by 4.6% (0.87 to 0.91)
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Validation loss reduced by 28.5% (0.165 to 0.118)
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Added attention mechanism in GNN layers
                      </li>
                    </ul>
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
