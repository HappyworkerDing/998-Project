# Module 1: GNN-Based Network Traffic Simulation

## Overview

This module implements a graph neural network (GNN) based network traffic simulation system. It combines spatial graph features using GCN/GAT with temporal modeling using GRU to predict network traffic patterns.

## Architecture

### Components

1. **ML Module** (`ml/`): PyTorch + PyTorch Geometric models for traffic prediction
2. **Backend API** (`backend/`): FastAPI server for model inference
3. **Frontend** (`frontend/`): React + TypeScript UI for visualization
4. **Scripts** (`scripts/`): Utilities for data generation and model training

### Tech Stack

- **Deep Learning**: PyTorch, PyTorch Geometric (PyG)
- **Backend**: FastAPI, Uvicorn
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Visualization**: Recharts

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- pip and npm

### 1. Python Environment Setup

```bash
# Create virtual environment
cd modules/module1
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Generate Synthetic Data

```bash
# Generate synthetic network traffic dataset
python scripts/generate_synthetic_data.py
```

This creates a synthetic graph dataset in `data/synthetic/` with:
- Network topology (nodes and edges)
- Time-series traffic features
- Train/validation/test splits

### 3. Train the Model

```bash
# Train GNN+GRU model on synthetic data
python ml/train.py --config ml/config.yaml
```

Training outputs:
- Model checkpoints in `checkpoints/`
- Training logs and metrics
- Visualization of predictions

### 4. Start the Backend Server

```bash
# Start FastAPI backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 5. Start the Frontend

```bash
# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints

### POST /simulate

Runs traffic simulation on a given network.

**Request Body:**
```json
{
  "num_nodes": 50,
  "history_length": 10,
  "scenario": "periodic"
}
```

**Response:**
```json
{
  "predictions": [...],
  "metrics": {
    "mse": 0.012,
    "mae": 0.089
  },
  "graph": {
    "nodes": 50,
    "edges": 120
  }
}
```

## Configuration

Edit `ml/config.yaml` to adjust:
- Model architecture (GCN/GAT, hidden dimensions)
- Training hyperparameters (learning rate, batch size)
- Dataset parameters (sequence length, train/test split)

## Project Structure

```
module1/
├── ml/                          # Machine learning components
│   ├── models/                  # Model definitions
│   │   ├── gnn_gru.py          # GNN+GRU architecture
│   │   └── layers.py           # Custom layers
│   ├── data/                    # Data loading and preprocessing
│   │   ├── dataset.py          # PyTorch dataset classes
│   │   └── preprocessing.py    # Data preprocessing utilities
│   ├── train.py                # Training script
│   ├── evaluate.py             # Evaluation script
│   └── config.yaml             # Model configuration
├── backend/                     # FastAPI backend
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Pydantic models
│   ├── inference.py            # Model inference logic
│   └── config.py               # Backend configuration
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── App.tsx             # Main app component
│   ├── package.json
│   └── vite.config.ts
├── scripts/                     # Utility scripts
│   └── generate_synthetic_data.py
├── data/                        # Data directory
├── checkpoints/                 # Model checkpoints
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## Development

### Running Tests

```bash
# Run Python tests
pytest ml/tests/

# Run frontend tests
cd frontend && npm test
```

### Extending the Model

To add multi-step prediction:
1. Modify `ml/models/gnn_gru.py` to output multiple time steps
2. Update training loop in `ml/train.py`
3. Adjust API response format in `backend/main.py`

## References

- PyTorch Geometric: https://pytorch-geometric.readthedocs.io/
- FastAPI: https://fastapi.tiangolo.com/
- Graph Neural Networks: Kipf & Welling, 2017 (GCN)
