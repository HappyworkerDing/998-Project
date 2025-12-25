import { type NextRequest, NextResponse } from "next/server"

interface SimulationRequest {
  num_nodes: number
  history_length: number
  scenario: string
  prediction_steps: number
}

// Generate synthetic network topology
function generateNetworkTopology(numNodes: number) {
  const edges: [number, number][] = []
  const avgDegree = Math.floor(Math.random() * 3) + 3 // 3-5 average degree

  for (let i = 0; i < numNodes; i++) {
    const numConnections = Math.floor(Math.random() * 3) + Math.max(1, avgDegree - 1)
    for (let j = 0; j < numConnections; j++) {
      const target = Math.floor(Math.random() * numNodes)
      if (target !== i && !edges.some(([a, b]) => (a === i && b === target) || (a === target && b === i))) {
        edges.push([i, target])
      }
    }
  }

  return {
    num_nodes: numNodes,
    num_edges: edges.length,
    avg_degree: (edges.length * 2) / numNodes,
    edge_list: edges,
  }
}

// Generate synthetic traffic data based on scenario
function generateTrafficData(numNodes: number, historyLength: number, scenario: string) {
  const features: number[][][] = []
  const numFeatures = 4 // packet_rate, byte_rate, flow_count, avg_packet_size

  for (let t = 0; t < historyLength; t++) {
    const timeStep: number[][] = []
    for (let n = 0; n < numNodes; n++) {
      const nodeFeatures: number[] = []

      switch (scenario) {
        case "periodic":
          // Periodic pattern with sinusoidal waves
          nodeFeatures.push(
            Math.sin((t * Math.PI) / 5 + n * 0.1) * 50 + 100, // packet_rate
            Math.sin((t * Math.PI) / 5 + n * 0.1) * 500 + 1000, // byte_rate
            Math.sin((t * Math.PI) / 5 + n * 0.1) * 10 + 20, // flow_count
            Math.sin((t * Math.PI) / 5 + n * 0.1) * 200 + 500, // avg_packet_size
          )
          break

        case "bursty":
          // Bursty traffic with random spikes
          const isBurst = Math.random() > 0.7
          const multiplier = isBurst ? Math.random() * 3 + 2 : 1
          nodeFeatures.push(
            (Math.random() * 50 + 50) * multiplier, // packet_rate
            (Math.random() * 500 + 500) * multiplier, // byte_rate
            (Math.random() * 10 + 10) * multiplier, // flow_count
            Math.random() * 200 + 400, // avg_packet_size
          )
          break

        case "random":
        default:
          // Random walk pattern
          const baseValue = 100 + Math.random() * 50
          nodeFeatures.push(
            baseValue + (Math.random() - 0.5) * 20, // packet_rate
            baseValue * 10 + (Math.random() - 0.5) * 200, // byte_rate
            baseValue / 5 + (Math.random() - 0.5) * 5, // flow_count
            500 + (Math.random() - 0.5) * 100, // avg_packet_size
          )
          break
      }

      timeStep.push(nodeFeatures)
    }
    features.push(timeStep)
  }

  return features
}

// Generate predictions (simulate GNN+GRU prediction with slight variations)
function generatePredictions(historical: number[][][], numNodes: number, predictionSteps: number, scenario: string) {
  const lastStep = historical[historical.length - 1]
  const predictions: number[][][] = []

  for (let step = 0; step < predictionSteps; step++) {
    const predStep: number[][] = []
    for (let n = 0; n < numNodes; n++) {
      const lastValues = lastStep[n]
      const predValues: number[] = []

      // Add slight variations and trend continuation
      for (let f = 0; f < lastValues.length; f++) {
        let predicted = lastValues[f]

        switch (scenario) {
          case "periodic":
            // Continue the periodic pattern
            predicted += Math.sin(((historical.length + step) * Math.PI) / 5 + n * 0.1) * 5
            break
          case "bursty":
            // Random variations for bursty
            predicted += (Math.random() - 0.5) * lastValues[f] * 0.2
            break
          case "random":
          default:
            // Random walk continuation
            predicted += (Math.random() - 0.5) * 10
            break
        }

        predValues.push(predicted)
      }
      predStep.push(predValues)
    }
    predictions.push(predStep)
  }

  return predictionSteps === 1 ? predictions[0] : predictions
}

// Calculate metrics
function calculateMetrics(historical: number[][][], predictions: number[][] | number[][][]) {
  const lastStep = historical[historical.length - 1]
  const firstPred = Array.isArray(predictions[0][0]) ? (predictions as number[][][])[0] : (predictions as number[][])

  let mse = 0
  let mae = 0
  let count = 0

  for (let n = 0; n < lastStep.length; n++) {
    for (let f = 0; f < lastStep[n].length; f++) {
      const actual = lastStep[n][f]
      const pred = firstPred[n][f]
      const error = actual - pred

      mse += error * error
      mae += Math.abs(error)
      count++
    }
  }

  return {
    mse: mse / count,
    mae: mae / count,
    num_predictions: count,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json()
    const { num_nodes, history_length, scenario, prediction_steps } = body

    // Validate input
    if (num_nodes < 10 || num_nodes > 200) {
      return NextResponse.json({ error: "num_nodes must be between 10 and 200" }, { status: 400 })
    }

    if (history_length < 5 || history_length > 50) {
      return NextResponse.json({ error: "history_length must be between 5 and 50" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate synthetic data
    const graph = generateNetworkTopology(num_nodes)
    const historical = generateTrafficData(num_nodes, history_length, scenario)
    const predictions = generatePredictions(historical, num_nodes, prediction_steps, scenario)
    const metrics = calculateMetrics(historical, predictions)

    const response = {
      predictions,
      historical_features: historical,
      metrics,
      graph,
      metadata: {
        scenario,
        sequence_length: history_length,
        prediction_steps,
        num_features: 4,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
