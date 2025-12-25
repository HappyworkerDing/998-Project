"""
Model inference utilities.
"""

import torch
import numpy as np
import networkx as nx
from typing import Dict, Any, Tuple
import sys
from pathlib import Path

# Add ml module to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'ml'))

from models import GNNGRU
from utils import load_config


class ModelInference:
    """
    Handles model loading and inference.
    """
    
    def __init__(self, checkpoint_path: str, config_path: str, device: str = 'cpu'):
        """
        Initialize inference engine.
        
        Args:
            checkpoint_path: Path to model checkpoint
            config_path: Path to model config
            device: Device to run inference on
        """
        self.device = torch.device(device)
        self.config = load_config(config_path)
        
        # Load model
        self.model = self._load_model(checkpoint_path)
        self.model.eval()
        
        print(f"Model loaded successfully on {self.device}")
    
    def _load_model(self, checkpoint_path: str) -> GNNGRU:
        """Load model from checkpoint."""
        model = GNNGRU(
            node_features=self.config['model']['node_features'],
            hidden_dim=self.config['model']['hidden_dim'],
            gnn_layers=self.config['model']['gnn_layers'],
            gru_hidden_dim=self.config['model']['gru_hidden_dim'],
            output_dim=self.config['model']['output_dim'],
            gnn_type=self.config['model']['gnn_type'],
            dropout=0.0  # No dropout during inference
        ).to(self.device)
        
        checkpoint = torch.load(checkpoint_path, map_location=self.device)
        model.load_state_dict(checkpoint['model_state_dict'])
        
        return model
    
    def generate_synthetic_scenario(
        self,
        num_nodes: int,
        sequence_length: int,
        scenario: str = 'periodic'
    ) -> Tuple[torch.Tensor, torch.Tensor, nx.Graph]:
        """
        Generate synthetic network and traffic data.
        
        Args:
            num_nodes: Number of nodes
            sequence_length: Length of historical sequence
            scenario: Traffic pattern type
            
        Returns:
            features, edge_index, graph
        """
        # Generate graph
        m = 4  # Average degree
        G = nx.barabasi_albert_graph(num_nodes, m)
        
        # Convert to edge_index
        edges = list(G.edges())
        edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
        edge_index = torch.cat([edge_index, edge_index.flip(0)], dim=1)
        
        # Generate traffic features
        num_features = self.config['model']['node_features']
        features = np.zeros((sequence_length, num_nodes, num_features))
        
        for node_idx in range(num_nodes):
            for feat_idx in range(num_features):
                if scenario == 'periodic':
                    freq = np.random.uniform(0.01, 0.1)
                    phase = np.random.uniform(0, 2 * np.pi)
                    amplitude = np.random.uniform(0.5, 1.5)
                    t = np.arange(sequence_length)
                    signal = amplitude * np.sin(2 * np.pi * freq * t + phase)
                    
                elif scenario == 'bursty':
                    signal = np.random.exponential(0.3, sequence_length)
                    burst_prob = 0.1
                    burst_mask = np.random.rand(sequence_length) < burst_prob
                    signal[burst_mask] *= np.random.uniform(5, 10, burst_mask.sum())
                    
                elif scenario == 'random':
                    signal = np.cumsum(np.random.randn(sequence_length) * 0.1)
                    
                else:
                    raise ValueError(f"Unknown scenario: {scenario}")
                
                # Add noise
                noise = np.random.randn(sequence_length) * 0.1
                signal += noise
                
                # Normalize to [0, 1]
                if signal.max() - signal.min() > 1e-8:
                    signal = (signal - signal.min()) / (signal.max() - signal.min())
                
                features[:, node_idx, feat_idx] = signal
        
        features = torch.FloatTensor(features)
        
        return features, edge_index, G
    
    def predict(
        self,
        num_nodes: int,
        sequence_length: int,
        scenario: str = 'periodic',
        prediction_steps: int = 1
    ) -> Dict[str, Any]:
        """
        Run prediction on generated scenario.
        
        Args:
            num_nodes: Number of nodes
            sequence_length: Length of historical sequence
            scenario: Traffic pattern type
            prediction_steps: Number of steps to predict
            
        Returns:
            Dictionary with predictions and metadata
        """
        # Generate scenario
        features, edge_index, G = self.generate_synthetic_scenario(
            num_nodes, sequence_length, scenario
        )
        
        # Prepare for inference
        features = features.to(self.device)
        edge_index = edge_index.to(self.device)
        
        # Flatten features for model input
        # [seq_len, num_nodes, num_features] -> [seq_len * num_nodes, num_features]
        num_features = features.shape[-1]
        features_flat = features.reshape(-1, num_features)
        batch_num_nodes = torch.tensor([num_nodes]).to(self.device)
        
        # Run inference
        with torch.no_grad():
            if prediction_steps == 1:
                predictions = self.model(features_flat, edge_index, batch_num_nodes)
                predictions = predictions.reshape(num_nodes, num_features)
            else:
                # Multi-step prediction
                predictions = self.model.predict_multi_step(
                    features_flat, edge_index, batch_num_nodes, prediction_steps
                )
                # [1, num_steps, num_nodes, num_features] -> [num_steps, num_nodes, num_features]
                predictions = predictions.squeeze(0)
        
        # Convert to numpy
        predictions_np = predictions.cpu().numpy()
        features_np = features.cpu().numpy()
        
        # Compute simple metrics (comparing last historical step to prediction)
        last_step = features_np[-1]  # [num_nodes, num_features]
        first_pred = predictions_np[0] if prediction_steps > 1 else predictions_np
        
        mse = np.mean((first_pred - last_step) ** 2)
        mae = np.mean(np.abs(first_pred - last_step))
        
        # Prepare response
        result = {
            'predictions': predictions_np.tolist(),
            'historical_features': features_np.tolist(),
            'metrics': {
                'mse': float(mse),
                'mae': float(mae),
                'num_predictions': int(prediction_steps)
            },
            'graph': {
                'num_nodes': num_nodes,
                'num_edges': G.number_of_edges(),
                'avg_degree': float(sum(dict(G.degree()).values()) / num_nodes),
                'edge_list': [[int(u), int(v)] for u, v in G.edges()]
            },
            'metadata': {
                'scenario': scenario,
                'sequence_length': sequence_length,
                'prediction_steps': prediction_steps,
                'num_features': num_features
            }
        }
        
        return result
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information."""
        num_params = sum(p.numel() for p in self.model.parameters())
        
        return {
            'architecture': 'GNN+GRU',
            'gnn_type': self.config['model']['gnn_type'],
            'parameters': num_params,
            'hidden_dim': self.config['model']['hidden_dim'],
            'gru_hidden_dim': self.config['model']['gru_hidden_dim'],
            'node_features': self.config['model']['node_features'],
            'output_dim': self.config['model']['output_dim']
        }
