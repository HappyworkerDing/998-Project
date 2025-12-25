"""
PyTorch Dataset for network traffic data.
"""

import torch
from torch.utils.data import Dataset
from typing import Tuple, Optional
import numpy as np


class TrafficDataset(Dataset):
    """
    Dataset for network traffic prediction.
    
    Each sample consists of:
    - Input: sequence of T time steps of node features
    - Target: next time step (or multiple steps) of node features
    - Graph structure: edge_index (shared across all samples)
    
    Args:
        X: Input sequences [num_samples, seq_len, num_nodes, num_features]
        y: Target values [num_samples, pred_steps, num_nodes, num_features]
        edge_index: Graph connectivity [2, num_edges]
        normalize: Whether to normalize features
    """
    
    def __init__(
        self,
        X: torch.Tensor,
        y: torch.Tensor,
        edge_index: torch.Tensor,
        normalize: bool = True
    ):
        self.X = X
        self.y = y
        self.edge_index = edge_index
        
        if normalize:
            self.X, self.x_mean, self.x_std = self._normalize(self.X)
            self.y, self.y_mean, self.y_std = self._normalize(self.y)
        else:
            self.x_mean = self.x_std = None
            self.y_mean = self.y_std = None
    
    def _normalize(self, data: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Normalize data to zero mean and unit variance.
        
        Args:
            data: Input tensor
            
        Returns:
            normalized_data, mean, std
        """
        mean = data.mean(dim=(0, 1, 2), keepdim=True)
        std = data.std(dim=(0, 1, 2), keepdim=True) + 1e-8
        normalized = (data - mean) / std
        return normalized, mean.squeeze(), std.squeeze()
    
    def denormalize_predictions(self, predictions: torch.Tensor) -> torch.Tensor:
        """
        Denormalize predictions back to original scale.
        
        Args:
            predictions: Normalized predictions
            
        Returns:
            Denormalized predictions
        """
        if self.y_mean is not None and self.y_std is not None:
            return predictions * self.y_std + self.y_mean
        return predictions
    
    def __len__(self) -> int:
        return len(self.X)
    
    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Get a single sample.
        
        Returns:
            x: Input sequence [seq_len, num_nodes, num_features]
            y: Target values [pred_steps, num_nodes, num_features]
            edge_index: Graph connectivity [2, num_edges]
        """
        return self.X[idx], self.y[idx], self.edge_index


def collate_traffic_data(batch):
    """
    Custom collate function for batching traffic data.
    
    Args:
        batch: List of tuples (x, y, edge_index)
        
    Returns:
        Batched data ready for model input
    """
    x_batch = []
    y_batch = []
    edge_indices = []
    batch_num_nodes = []
    
    for i, (x, y, edge_index) in enumerate(batch):
        # x: [seq_len, num_nodes, num_features]
        # y: [pred_steps, num_nodes, num_features]
        seq_len, num_nodes, num_features = x.shape
        
        # Flatten temporal and spatial dimensions
        # [seq_len * num_nodes, num_features]
        x_flat = x.reshape(-1, num_features)
        x_batch.append(x_flat)
        
        # Flatten target: [pred_steps * num_nodes, num_features]
        y_flat = y.reshape(-1, num_features)
        y_batch.append(y_flat)
        
        # Adjust edge indices for batching (add offset)
        offset = i * num_nodes * seq_len
        edge_index_offset = edge_index + offset
        edge_indices.append(edge_index_offset)
        
        batch_num_nodes.append(num_nodes)
    
    # Concatenate all samples
    x_batched = torch.cat(x_batch, dim=0)
    y_batched = torch.cat(y_batch, dim=0)
    
    # For edge_index, we need to replicate for each time step
    # Since the graph structure is the same across time
    edge_index_batched = []
    for i, edge_index in enumerate(edge_indices):
        for t in range(seq_len):
            # Offset for this time step
            offset = i * num_nodes * seq_len + t * num_nodes
            edge_index_t = edge_index - i * num_nodes * seq_len + offset
            edge_index_batched.append(edge_index_t)
    
    edge_index_batched = torch.cat(edge_index_batched, dim=1)
    batch_num_nodes = torch.tensor(batch_num_nodes)
    
    return {
        'x': x_batched,
        'y': y_batched,
        'edge_index': edge_index_batched,
        'batch_num_nodes': batch_num_nodes,
        'seq_len': seq_len,
        'num_nodes': num_nodes
    }
