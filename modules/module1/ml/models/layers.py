"""
Custom layers and utilities for GNN models.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import MessagePassing
from torch_geometric.utils import add_self_loops, degree


class TemporalAttention(nn.Module):
    """
    Temporal attention mechanism for weighting different time steps.
    
    This allows the model to focus on more important time steps
    when making predictions.
    """
    
    def __init__(self, hidden_dim: int):
        super().__init__()
        self.attention = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, 1)
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            x: [batch_size, seq_len, hidden_dim]
            
        Returns:
            Weighted sum: [batch_size, hidden_dim]
        """
        # Compute attention scores: [batch_size, seq_len, 1]
        scores = self.attention(x)
        
        # Softmax over sequence dimension
        weights = F.softmax(scores, dim=1)
        
        # Weighted sum: [batch_size, hidden_dim]
        output = (x * weights).sum(dim=1)
        
        return output


class ResidualGCNLayer(nn.Module):
    """
    GCN layer with residual connection and layer normalization.
    """
    
    def __init__(self, in_channels: int, out_channels: int, dropout: float = 0.2):
        super().__init__()
        from torch_geometric.nn import GCNConv
        
        self.conv = GCNConv(in_channels, out_channels)
        self.norm = nn.LayerNorm(out_channels)
        self.dropout = nn.Dropout(dropout)
        
        # Projection for residual if dimensions don't match
        self.residual_proj = None
        if in_channels != out_channels:
            self.residual_proj = nn.Linear(in_channels, out_channels)
    
    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        """
        Forward pass with residual connection.
        
        Args:
            x: Node features [num_nodes, in_channels]
            edge_index: Graph connectivity [2, num_edges]
            
        Returns:
            Output features [num_nodes, out_channels]
        """
        identity = x
        
        # GCN convolution
        out = self.conv(x, edge_index)
        out = self.norm(out)
        out = F.relu(out)
        out = self.dropout(out)
        
        # Residual connection
        if self.residual_proj is not None:
            identity = self.residual_proj(identity)
        
        return out + identity


class EdgePredictor(nn.Module):
    """
    Predicts edge-level features from node embeddings.
    
    Useful for predicting link-level traffic metrics.
    """
    
    def __init__(self, node_dim: int, edge_dim: int):
        super().__init__()
        self.edge_mlp = nn.Sequential(
            nn.Linear(node_dim * 2, node_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(node_dim, edge_dim)
        )
    
    def forward(
        self,
        node_embeddings: torch.Tensor,
        edge_index: torch.Tensor
    ) -> torch.Tensor:
        """
        Predict edge features.
        
        Args:
            node_embeddings: [num_nodes, node_dim]
            edge_index: [2, num_edges]
            
        Returns:
            Edge predictions: [num_edges, edge_dim]
        """
        # Get source and target node embeddings
        src_nodes = edge_index[0]
        dst_nodes = edge_index[1]
        
        src_emb = node_embeddings[src_nodes]  # [num_edges, node_dim]
        dst_emb = node_embeddings[dst_nodes]  # [num_edges, node_dim]
        
        # Concatenate source and target embeddings
        edge_features = torch.cat([src_emb, dst_emb], dim=1)
        
        # Predict edge-level features
        edge_pred = self.edge_mlp(edge_features)
        
        return edge_pred


def masked_mae_loss(pred: torch.Tensor, target: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
    """
    Masked Mean Absolute Error loss.
    
    Args:
        pred: Predictions
        target: Ground truth
        mask: Binary mask (1 = compute loss, 0 = ignore)
        
    Returns:
        MAE loss
    """
    error = torch.abs(pred - target)
    
    if mask is not None:
        error = error * mask
        return error.sum() / (mask.sum() + 1e-8)
    
    return error.mean()


def masked_mse_loss(pred: torch.Tensor, target: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
    """
    Masked Mean Squared Error loss.
    
    Args:
        pred: Predictions
        target: Ground truth
        mask: Binary mask (1 = compute loss, 0 = ignore)
        
    Returns:
        MSE loss
    """
    error = (pred - target) ** 2
    
    if mask is not None:
        error = error * mask
        return error.sum() / (mask.sum() + 1e-8)
    
    return error.mean()
