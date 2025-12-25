"""
Generate synthetic network traffic data for training and evaluation.

This script creates:
1. A random graph topology (Barabási-Albert or Erdős-Rényi)
2. Synthetic traffic features over time with configurable patterns
3. Train/validation/test splits
"""

import os
import numpy as np
import networkx as nx
import torch
from pathlib import Path
import argparse


def generate_graph(num_nodes: int, avg_degree: int, graph_type: str = 'barabasi_albert'):
    """
    Generate a random graph.
    
    Args:
        num_nodes: Number of nodes in the graph
        avg_degree: Average degree of nodes
        graph_type: Type of graph ('barabasi_albert' or 'erdos_renyi')
        
    Returns:
        edge_index: Edge connectivity [2, num_edges]
        G: NetworkX graph object
    """
    if graph_type == 'barabasi_albert':
        m = avg_degree // 2
        G = nx.barabasi_albert_graph(num_nodes, m)
    elif graph_type == 'erdos_renyi':
        p = avg_degree / (num_nodes - 1)
        G = nx.erdos_renyi_graph(num_nodes, p)
    else:
        raise ValueError(f"Unknown graph type: {graph_type}")
    
    # Convert to edge_index format
    edges = list(G.edges())
    edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
    
    # Make undirected (add reverse edges)
    edge_index = torch.cat([edge_index, edge_index.flip(0)], dim=1)
    
    return edge_index, G


def generate_traffic_features(
    num_nodes: int,
    num_time_steps: int,
    num_features: int = 8,
    pattern: str = 'periodic',
    noise_level: float = 0.1
):
    """
    Generate synthetic traffic features over time.
    
    Args:
        num_nodes: Number of nodes
        num_time_steps: Number of time steps
        num_features: Number of features per node
        pattern: Traffic pattern type ('periodic', 'bursty', 'random')
        noise_level: Std deviation of Gaussian noise
        
    Returns:
        features: [num_time_steps, num_nodes, num_features]
    """
    features = np.zeros((num_time_steps, num_nodes, num_features))
    
    for node_idx in range(num_nodes):
        for feat_idx in range(num_features):
            if pattern == 'periodic':
                # Periodic pattern with random frequency
                freq = np.random.uniform(0.01, 0.1)
                phase = np.random.uniform(0, 2 * np.pi)
                amplitude = np.random.uniform(0.5, 1.5)
                
                t = np.arange(num_time_steps)
                signal = amplitude * np.sin(2 * np.pi * freq * t + phase)
                
            elif pattern == 'bursty':
                # Bursty pattern with random bursts
                signal = np.random.exponential(0.3, num_time_steps)
                burst_prob = 0.1
                burst_mask = np.random.rand(num_time_steps) < burst_prob
                signal[burst_mask] *= np.random.uniform(5, 10, burst_mask.sum())
                
            elif pattern == 'random':
                # Random walk
                signal = np.cumsum(np.random.randn(num_time_steps) * 0.1)
                
            else:
                raise ValueError(f"Unknown pattern: {pattern}")
            
            # Add noise
            noise = np.random.randn(num_time_steps) * noise_level
            signal += noise
            
            # Normalize to [0, 1]
            signal = (signal - signal.min()) / (signal.max() - signal.min() + 1e-8)
            
            features[:, node_idx, feat_idx] = signal
    
    return features


def create_sequences(features, sequence_length: int, prediction_steps: int = 1):
    """
    Create input-output sequences for supervised learning.
    
    Args:
        features: [num_time_steps, num_nodes, num_features]
        sequence_length: Length of input sequence
        prediction_steps: Number of future steps to predict
        
    Returns:
        X: Input sequences [num_samples, sequence_length, num_nodes, num_features]
        y: Target values [num_samples, prediction_steps, num_nodes, num_features]
    """
    num_time_steps = features.shape[0]
    num_samples = num_time_steps - sequence_length - prediction_steps + 1
    
    X = []
    y = []
    
    for i in range(num_samples):
        X.append(features[i:i + sequence_length])
        y.append(features[i + sequence_length:i + sequence_length + prediction_steps])
    
    X = np.array(X)
    y = np.array(y)
    
    return X, y


def main():
    parser = argparse.ArgumentParser(description='Generate synthetic network traffic data')
    parser.add_argument('--num_nodes', type=int, default=50, help='Number of nodes')
    parser.add_argument('--num_time_steps', type=int, default=1000, help='Number of time steps')
    parser.add_argument('--sequence_length', type=int, default=10, help='Sequence length')
    parser.add_argument('--graph_type', type=str, default='barabasi_albert', 
                        choices=['barabasi_albert', 'erdos_renyi'])
    parser.add_argument('--pattern', type=str, default='periodic',
                        choices=['periodic', 'bursty', 'random'])
    parser.add_argument('--output_dir', type=str, default='data/synthetic')
    parser.add_argument('--seed', type=int, default=42)
    
    args = parser.parse_args()
    
    # Set random seeds
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    
    print("Generating synthetic network traffic data...")
    print(f"Nodes: {args.num_nodes}, Time steps: {args.num_time_steps}")
    print(f"Graph type: {args.graph_type}, Pattern: {args.pattern}")
    
    # Generate graph topology
    print("\n1. Generating graph topology...")
    edge_index, G = generate_graph(args.num_nodes, avg_degree=4, graph_type=args.graph_type)
    print(f"   Generated graph with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")
    
    # Generate traffic features
    print("\n2. Generating traffic features...")
    features = generate_traffic_features(
        num_nodes=args.num_nodes,
        num_time_steps=args.num_time_steps,
        num_features=8,
        pattern=args.pattern,
        noise_level=0.1
    )
    print(f"   Generated features with shape: {features.shape}")
    
    # Create sequences
    print("\n3. Creating sequences...")
    X, y = create_sequences(features, sequence_length=args.sequence_length, prediction_steps=1)
    print(f"   Input sequences: {X.shape}")
    print(f"   Target sequences: {y.shape}")
    
    # Train/val/test split
    print("\n4. Splitting data...")
    num_samples = X.shape[0]
    train_size = int(0.7 * num_samples)
    val_size = int(0.15 * num_samples)
    
    X_train = X[:train_size]
    y_train = y[:train_size]
    X_val = X[train_size:train_size + val_size]
    y_val = y[train_size:train_size + val_size]
    X_test = X[train_size + val_size:]
    y_test = y[train_size + val_size:]
    
    print(f"   Train: {X_train.shape[0]} samples")
    print(f"   Val: {X_val.shape[0]} samples")
    print(f"   Test: {X_test.shape[0]} samples")
    
    # Save data
    print("\n5. Saving data...")
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save as PyTorch tensors
    torch.save({
        'edge_index': edge_index,
        'X_train': torch.FloatTensor(X_train),
        'y_train': torch.FloatTensor(y_train),
        'X_val': torch.FloatTensor(X_val),
        'y_val': torch.FloatTensor(y_val),
        'X_test': torch.FloatTensor(X_test),
        'y_test': torch.FloatTensor(y_test),
        'metadata': {
            'num_nodes': args.num_nodes,
            'num_features': 8,
            'sequence_length': args.sequence_length,
            'graph_type': args.graph_type,
            'pattern': args.pattern
        }
    }, output_dir / 'traffic_data.pt')
    
    print(f"   Saved to {output_dir / 'traffic_data.pt'}")
    print("\nDone!")


if __name__ == '__main__':
    main()
