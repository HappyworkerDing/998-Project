"""
Training script for GNN+GRU traffic prediction model.
"""

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import argparse
from pathlib import Path
from tqdm import tqdm
import matplotlib.pyplot as plt

from models import GNNGRU
from data import TrafficDataset, collate_traffic_data
from utils import (
    set_seed, load_config, save_checkpoint,
    compute_metrics, get_logger, EarlyStopping
)


def train_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    criterion: nn.Module,
    device: torch.device
) -> float:
    """
    Train for one epoch.
    
    Args:
        model: GNN model
        dataloader: Training dataloader
        optimizer: Optimizer
        criterion: Loss function
        device: Device to train on
        
    Returns:
        Average training loss
    """
    model.train()
    total_loss = 0.0
    num_batches = 0
    
    for batch in tqdm(dataloader, desc="Training"):
        x = batch['x'].to(device)
        y = batch['y'].to(device)
        edge_index = batch['edge_index'].to(device)
        batch_num_nodes = batch['batch_num_nodes'].to(device)
        
        # Forward pass
        optimizer.zero_grad()
        pred = model(x, edge_index, batch_num_nodes)
        
        # Compute loss
        loss = criterion(pred, y)
        
        # Backward pass
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        
        total_loss += loss.item()
        num_batches += 1
    
    return total_loss / num_batches


def evaluate(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    device: torch.device
) -> tuple:
    """
    Evaluate model.
    
    Args:
        model: GNN model
        dataloader: Validation/test dataloader
        criterion: Loss function
        device: Device to evaluate on
        
    Returns:
        Average loss and metrics dictionary
    """
    model.eval()
    total_loss = 0.0
    num_batches = 0
    
    all_preds = []
    all_targets = []
    
    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Evaluating"):
            x = batch['x'].to(device)
            y = batch['y'].to(device)
            edge_index = batch['edge_index'].to(device)
            batch_num_nodes = batch['batch_num_nodes'].to(device)
            
            # Forward pass
            pred = model(x, edge_index, batch_num_nodes)
            
            # Compute loss
            loss = criterion(pred, y)
            
            total_loss += loss.item()
            num_batches += 1
            
            all_preds.append(pred.cpu())
            all_targets.append(y.cpu())
    
    # Compute metrics
    all_preds = torch.cat(all_preds, dim=0)
    all_targets = torch.cat(all_targets, dim=0)
    metrics = compute_metrics(all_preds, all_targets)
    
    avg_loss = total_loss / num_batches
    metrics['loss'] = avg_loss
    
    return avg_loss, metrics


def visualize_predictions(
    model: nn.Module,
    dataset: TrafficDataset,
    device: torch.device,
    save_path: str,
    num_samples: int = 3
):
    """
    Visualize model predictions vs ground truth.
    
    Args:
        model: Trained model
        dataset: Test dataset
        device: Device
        save_path: Path to save visualization
        num_samples: Number of samples to visualize
    """
    model.eval()
    
    fig, axes = plt.subplots(num_samples, 1, figsize=(12, 4 * num_samples))
    if num_samples == 1:
        axes = [axes]
    
    with torch.no_grad():
        for i in range(num_samples):
            x, y, edge_index = dataset[i]
            
            # Prepare batch
            x = x.unsqueeze(0).to(device)
            y = y.to(device)
            edge_index = edge_index.to(device)
            
            # Reshape for model
            batch_size = 1
            seq_len, num_nodes, num_features = x.shape[1:]
            x_flat = x.reshape(-1, num_features)
            batch_num_nodes = torch.tensor([num_nodes]).to(device)
            
            # Predict
            pred = model(x_flat, edge_index, batch_num_nodes)
            pred = pred.cpu()
            y = y.cpu()
            
            # Denormalize
            pred = dataset.denormalize_predictions(pred)
            y = dataset.denormalize_predictions(y)
            
            # Plot first node, first feature
            pred_values = pred.reshape(num_nodes, -1)[0, 0]
            true_values = y.reshape(num_nodes, -1)[0, 0]
            
            axes[i].plot(true_values, label='Ground Truth', marker='o')
            axes[i].plot(pred_values, label='Prediction', marker='x')
            axes[i].set_title(f'Sample {i + 1}: Node 0, Feature 0')
            axes[i].set_xlabel('Time Step')
            axes[i].set_ylabel('Value')
            axes[i].legend()
            axes[i].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    print(f"Visualization saved to {save_path}")
    plt.close()


def main():
    parser = argparse.ArgumentParser(description='Train GNN+GRU model')
    parser.add_argument('--config', type=str, default='ml/config.yaml',
                        help='Path to config file')
    parser.add_argument('--data', type=str, default='data/synthetic/traffic_data.pt',
                        help='Path to data file')
    parser.add_argument('--resume', type=str, default=None,
                        help='Path to checkpoint to resume from')
    
    args = parser.parse_args()
    
    # Load configuration
    config = load_config(args.config)
    
    # Set random seed
    set_seed(config['seed'])
    
    # Setup device
    device = torch.device(config['device'] if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Create directories
    log_dir = Path(config['logging']['log_dir'])
    checkpoint_dir = Path(config['logging']['checkpoint_dir'])
    log_dir.mkdir(parents=True, exist_ok=True)
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    
    # Setup logger
    logger = get_logger('train', log_file=str(log_dir / 'train.log'))
    
    # Load data
    logger.info(f"Loading data from {args.data}")
    data = torch.load(args.data)
    
    X_train = data['X_train']
    y_train = data['y_train']
    X_val = data['X_val']
    y_val = data['y_val']
    X_test = data['X_test']
    y_test = data['y_test']
    edge_index = data['edge_index']
    
    logger.info(f"Train samples: {len(X_train)}")
    logger.info(f"Val samples: {len(X_val)}")
    logger.info(f"Test samples: {len(X_test)}")
    
    # Create datasets
    train_dataset = TrafficDataset(X_train, y_train, edge_index, normalize=True)
    val_dataset = TrafficDataset(X_val, y_val, edge_index, normalize=True)
    test_dataset = TrafficDataset(X_test, y_test, edge_index, normalize=True)
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=config['training']['batch_size'],
        shuffle=True,
        collate_fn=collate_traffic_data,
        num_workers=0
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=config['training']['batch_size'],
        shuffle=False,
        collate_fn=collate_traffic_data,
        num_workers=0
    )
    
    test_loader = DataLoader(
        test_dataset,
        batch_size=config['training']['batch_size'],
        shuffle=False,
        collate_fn=collate_traffic_data,
        num_workers=0
    )
    
    # Create model
    logger.info("Creating model...")
    model = GNNGRU(
        node_features=config['model']['node_features'],
        hidden_dim=config['model']['hidden_dim'],
        gnn_layers=config['model']['gnn_layers'],
        gru_hidden_dim=config['model']['gru_hidden_dim'],
        output_dim=config['model']['output_dim'],
        gnn_type=config['model']['gnn_type'],
        dropout=config['model']['dropout']
    ).to(device)
    
    logger.info(f"Model parameters: {sum(p.numel() for p in model.parameters()):,}")
    
    # Optimizer and loss
    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=config['training']['learning_rate'],
        weight_decay=config['training']['weight_decay']
    )
    
    criterion = nn.MSELoss()
    
    # Learning rate scheduler
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=5, verbose=True
    )
    
    # Early stopping
    early_stopping = EarlyStopping(
        patience=config['training']['early_stopping_patience']
    )
    
    # Training loop
    logger.info("Starting training...")
    best_val_loss = float('inf')
    train_losses = []
    val_losses = []
    
    for epoch in range(config['training']['epochs']):
        logger.info(f"\nEpoch {epoch + 1}/{config['training']['epochs']}")
        
        # Train
        train_loss = train_epoch(model, train_loader, optimizer, criterion, device)
        train_losses.append(train_loss)
        logger.info(f"Train Loss: {train_loss:.6f}")
        
        # Validate
        val_loss, val_metrics = evaluate(model, val_loader, criterion, device)
        val_losses.append(val_loss)
        logger.info(f"Val Loss: {val_loss:.6f}")
        logger.info(f"Val Metrics: {val_metrics}")
        
        # Learning rate scheduling
        scheduler.step(val_loss)
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            save_checkpoint(
                model, optimizer, epoch, val_loss,
                checkpoint_dir, 'best_model.pt'
            )
            logger.info(f"Best model saved with val_loss: {val_loss:.6f}")
        
        # Regular checkpoint
        if (epoch + 1) % config['logging']['save_frequency'] == 0:
            save_checkpoint(
                model, optimizer, epoch, val_loss,
                checkpoint_dir, f'checkpoint_epoch_{epoch + 1}.pt'
            )
        
        # Early stopping
        if early_stopping(val_loss):
            logger.info(f"Early stopping triggered at epoch {epoch + 1}")
            break
    
    # Plot training history
    plt.figure(figsize=(10, 5))
    plt.plot(train_losses, label='Train Loss')
    plt.plot(val_losses, label='Val Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training History')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(log_dir / 'training_history.png', dpi=150, bbox_inches='tight')
    logger.info(f"Training history saved to {log_dir / 'training_history.png'}")
    
    # Final evaluation on test set
    logger.info("\nEvaluating on test set...")
    test_loss, test_metrics = evaluate(model, test_loader, criterion, device)
    logger.info(f"Test Loss: {test_loss:.6f}")
    logger.info(f"Test Metrics: {test_metrics}")
    
    # Visualize predictions
    visualize_predictions(
        model, test_dataset, device,
        save_path=str(log_dir / 'predictions.png'),
        num_samples=3
    )
    
    logger.info("\nTraining completed!")


if __name__ == '__main__':
    main()
