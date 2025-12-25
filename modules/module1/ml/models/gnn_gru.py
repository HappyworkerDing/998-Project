"""
GNN+GRU Model for Network Traffic Prediction

This module implements a spatial-temporal model that combines:
1. Graph Neural Networks (GCN/GAT) for spatial feature extraction
2. Gated Recurrent Units (GRU) for temporal modeling
"""

import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv, GATConv
from typing import Literal, Tuple


class GNNGRU(nn.Module):
    """
    Graph Neural Network with GRU for traffic prediction.
    
    Architecture:
    1. GNN layers process each time step's graph independently
    2. GRU aggregates temporal information across time steps
    3. Final MLP predicts next time step features
    
    Args:
        node_features: Number of input features per node
        hidden_dim: Hidden dimension for GNN layers
        gnn_layers: Number of GNN layers
        gru_hidden_dim: Hidden dimension for GRU
        output_dim: Output dimension (predicted features per node)
        gnn_type: Type of GNN to use ('gcn' or 'gat')
        dropout: Dropout probability
    """
    
    def __init__(
        self,
        node_features: int,
        hidden_dim: int,
        gnn_layers: int,
        gru_hidden_dim: int,
        output_dim: int,
        gnn_type: Literal['gcn', 'gat'] = 'gcn',
        dropout: float = 0.2
    ):
        super().__init__()
        
        self.node_features = node_features
        self.hidden_dim = hidden_dim
        self.gnn_layers = gnn_layers
        self.gru_hidden_dim = gru_hidden_dim
        self.output_dim = output_dim
        self.gnn_type = gnn_type
        
        # Build GNN layers
        self.gnn_convs = nn.ModuleList()
        self.batch_norms = nn.ModuleList()
        
        for i in range(gnn_layers):
            in_channels = node_features if i == 0 else hidden_dim
            
            if gnn_type == 'gcn':
                self.gnn_convs.append(GCNConv(in_channels, hidden_dim))
            elif gnn_type == 'gat':
                # GAT with 4 attention heads
                heads = 4
                out_channels = hidden_dim // heads
                self.gnn_convs.append(
                    GATConv(in_channels, out_channels, heads=heads, concat=True)
                )
            else:
                raise ValueError(f"Unknown GNN type: {gnn_type}")
            
            self.batch_norms.append(nn.BatchNorm1d(hidden_dim))
        
        # GRU for temporal modeling
        self.gru = nn.GRU(
            input_size=hidden_dim,
            hidden_size=gru_hidden_dim,
            num_layers=2,
            batch_first=True,
            dropout=dropout if gnn_layers > 1 else 0
        )
        
        # Output projection
        self.output_projection = nn.Sequential(
            nn.Linear(gru_hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim)
        )
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(
        self,
        x: torch.Tensor,
        edge_index: torch.Tensor,
        batch_num_nodes: torch.Tensor
    ) -> torch.Tensor:
        """
        Forward pass.
        
        Args:
            x: Node features [batch_size * seq_len * num_nodes, node_features]
            edge_index: Graph connectivity [2, num_edges]
            batch_num_nodes: Number of nodes per graph in batch
            
        Returns:
            predictions: Predicted node features [batch_size * num_nodes, output_dim]
        """
        batch_size = len(batch_num_nodes)
        seq_len = x.size(0) // (batch_size * batch_num_nodes[0])
        num_nodes = batch_num_nodes[0].item()
        
        # Process each time step through GNN
        temporal_features = []
        
        for t in range(seq_len):
            # Extract features for current time step
            start_idx = t * batch_size * num_nodes
            end_idx = (t + 1) * batch_size * num_nodes
            x_t = x[start_idx:end_idx]
            
            # Apply GNN layers
            h = x_t
            for i, (conv, bn) in enumerate(zip(self.gnn_convs, self.batch_norms)):
                h = conv(h, edge_index)
                h = bn(h)
                h = torch.relu(h)
                if i < len(self.gnn_convs) - 1:
                    h = self.dropout(h)
            
            # Reshape to [batch_size, num_nodes, hidden_dim]
            h = h.view(batch_size, num_nodes, self.hidden_dim)
            temporal_features.append(h)
        
        # Stack temporal features: [batch_size, seq_len, num_nodes, hidden_dim]
        temporal_features = torch.stack(temporal_features, dim=1)
        
        # Process each node's temporal sequence through GRU
        predictions = []
        for node_idx in range(num_nodes):
            # Extract features for this node across all time steps
            # [batch_size, seq_len, hidden_dim]
            node_seq = temporal_features[:, :, node_idx, :]
            
            # GRU forward pass
            gru_out, _ = self.gru(node_seq)
            
            # Take last time step output: [batch_size, gru_hidden_dim]
            last_hidden = gru_out[:, -1, :]
            
            # Project to output space: [batch_size, output_dim]
            node_pred = self.output_projection(last_hidden)
            predictions.append(node_pred)
        
        # Stack predictions: [batch_size, num_nodes, output_dim]
        predictions = torch.stack(predictions, dim=1)
        
        # Reshape to [batch_size * num_nodes, output_dim]
        predictions = predictions.view(-1, self.output_dim)
        
        return predictions
    
    def predict_multi_step(
        self,
        x: torch.Tensor,
        edge_index: torch.Tensor,
        batch_num_nodes: torch.Tensor,
        num_steps: int = 1
    ) -> torch.Tensor:
        """
        Multi-step prediction (autoregressive).
        
        Args:
            x: Initial sequence
            edge_index: Graph connectivity
            batch_num_nodes: Number of nodes per graph
            num_steps: Number of future steps to predict
            
        Returns:
            predictions: [batch_size, num_steps, num_nodes, output_dim]
        """
        batch_size = len(batch_num_nodes)
        num_nodes = batch_num_nodes[0].item()
        
        all_predictions = []
        current_x = x
        
        for step in range(num_steps):
            # Predict next time step
            pred = self.forward(current_x, edge_index, batch_num_nodes)
            all_predictions.append(pred)
            
            # Update input sequence (rolling window)
            # Remove oldest time step, append prediction
            current_x = torch.cat([
                current_x[batch_size * num_nodes:],
                pred
            ], dim=0)
        
        # Stack predictions: [num_steps * batch_size * num_nodes, output_dim]
        all_predictions = torch.cat(all_predictions, dim=0)
        
        # Reshape to [batch_size, num_steps, num_nodes, output_dim]
        all_predictions = all_predictions.view(batch_size, num_steps, num_nodes, -1)
        
        return all_predictions
