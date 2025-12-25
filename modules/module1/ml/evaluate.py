"""
Evaluation script for trained GNN+GRU model.
"""

import torch
import argparse
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

from models import GNNGRU
from data import TrafficDataset
from utils import load_config, compute_metrics


def evaluate_model(
    model_path: str,
    data_path: str,
    config_path: str,
    output_dir: str = 'evaluation_results'
):
    """
    Comprehensive model evaluation.
    
    Args:
        model_path: Path to trained model checkpoint
        data_path: Path to test data
        config_path: Path to config file
        output_dir: Directory to save results
    """
    # Load config
    config = load_config(config_path)
    device = torch.device(config['device'] if torch.cuda.is_available() else 'cpu')
    
    # Create output directory
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load data
    print("Loading data...")
    data = torch.load(data_path)
    X_test = data['X_test']
    y_test = data['y_test']
    edge_index = data['edge_index']
    
    test_dataset = TrafficDataset(X_test, y_test, edge_index, normalize=True)
    
    # Load model
    print("Loading model...")
    model = GNNGRU(
        node_features=config['model']['node_features'],
        hidden_dim=config['model']['hidden_dim'],
        gnn_layers=config['model']['gnn_layers'],
        gru_hidden_dim=config['model']['gru_hidden_dim'],
        output_dim=config['model']['output_dim'],
        gnn_type=config['model']['gnn_type'],
        dropout=config['model']['dropout']
    ).to(device)
    
    checkpoint = torch.load(model_path, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    print(f"Model loaded from epoch {checkpoint['epoch']}")
    
    # Run predictions
    print("Running predictions...")
    all_preds = []
    all_targets = []
    
    with torch.no_grad():
        for i in range(len(test_dataset)):
            x, y, edge_idx = test_dataset[i]
            
            # Prepare batch
            seq_len, num_nodes, num_features = x.shape
            x_flat = x.reshape(-1, num_features).to(device)
            edge_idx = edge_idx.to(device)
            batch_num_nodes = torch.tensor([num_nodes]).to(device)
            
            # Predict
            pred = model(x_flat, edge_idx, batch_num_nodes)
            
            all_preds.append(pred.cpu())
            all_targets.append(y)
    
    all_preds = torch.cat(all_preds, dim=0)
    all_targets = torch.cat(all_targets, dim=0)
    
    # Denormalize
    all_preds = test_dataset.denormalize_predictions(all_preds)
    all_targets = test_dataset.denormalize_predictions(all_targets)
    
    # Compute metrics
    print("\nComputing metrics...")
    metrics = compute_metrics(all_preds, all_targets)
    
    print("\nTest Metrics:")
    print(f"  MSE:  {metrics['mse']:.6f}")
    print(f"  MAE:  {metrics['mae']:.6f}")
    print(f"  RMSE: {metrics['rmse']:.6f}")
    print(f"  R²:   {metrics['r2']:.6f}")
    print(f"  MAPE: {metrics['mape']:.2f}%")
    
    # Save metrics
    with open(output_dir / 'metrics.txt', 'w') as f:
        for key, value in metrics.items():
            f.write(f"{key}: {value}\n")
    
    # Visualization 1: Scatter plot
    print("\nGenerating visualizations...")
    plt.figure(figsize=(8, 8))
    plt.scatter(all_targets.numpy().flatten(), all_preds.numpy().flatten(),
                alpha=0.5, s=1)
    plt.plot([all_targets.min(), all_targets.max()],
             [all_targets.min(), all_targets.max()],
             'r--', lw=2, label='Perfect Prediction')
    plt.xlabel('Ground Truth')
    plt.ylabel('Predictions')
    plt.title('Predictions vs Ground Truth')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(output_dir / 'scatter_plot.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # Visualization 2: Error distribution
    errors = (all_preds - all_targets).numpy().flatten()
    plt.figure(figsize=(10, 5))
    plt.hist(errors, bins=50, edgecolor='black', alpha=0.7)
    plt.xlabel('Prediction Error')
    plt.ylabel('Frequency')
    plt.title('Error Distribution')
    plt.axvline(x=0, color='r', linestyle='--', label='Zero Error')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(output_dir / 'error_distribution.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    # Visualization 3: Time series comparison
    num_samples = min(5, len(test_dataset))
    fig, axes = plt.subplots(num_samples, 1, figsize=(12, 3 * num_samples))
    if num_samples == 1:
        axes = [axes]
    
    for i in range(num_samples):
        start_idx = i * data['metadata']['num_nodes']
        end_idx = start_idx + data['metadata']['num_nodes']
        
        pred_sample = all_preds[start_idx:end_idx, 0].numpy()
        target_sample = all_targets[start_idx:end_idx, 0].numpy()
        
        axes[i].plot(target_sample, label='Ground Truth', marker='o', markersize=4)
        axes[i].plot(pred_sample, label='Prediction', marker='x', markersize=4)
        axes[i].set_title(f'Sample {i + 1}')
        axes[i].set_xlabel('Node Index')
        axes[i].set_ylabel('Traffic Value')
        axes[i].legend()
        axes[i].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(output_dir / 'time_series_comparison.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    print(f"\nEvaluation complete! Results saved to {output_dir}")


def main():
    parser = argparse.ArgumentParser(description='Evaluate trained GNN+GRU model')
    parser.add_argument('--model', type=str, required=True,
                        help='Path to model checkpoint')
    parser.add_argument('--data', type=str, default='data/synthetic/traffic_data.pt',
                        help='Path to test data')
    parser.add_argument('--config', type=str, default='ml/config.yaml',
                        help='Path to config file')
    parser.add_argument('--output', type=str, default='evaluation_results',
                        help='Output directory for results')
    
    args = parser.parse_args()
    
    evaluate_model(args.model, args.data, args.config, args.output)


if __name__ == '__main__':
    main()
