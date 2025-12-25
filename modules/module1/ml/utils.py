"""
Utility functions for training and evaluation.
"""

import torch
import numpy as np
import random
import os
from pathlib import Path
from typing import Dict, Any
import yaml
import logging


def set_seed(seed: int):
    """
    Set random seeds for reproducibility.
    
    Args:
        seed: Random seed
    """
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


def load_config(config_path: str) -> Dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to config file
        
    Returns:
        Configuration dictionary
    """
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    return config


def save_checkpoint(
    model: torch.nn.Module,
    optimizer: torch.optim.Optimizer,
    epoch: int,
    loss: float,
    checkpoint_dir: str,
    filename: str = 'checkpoint.pt'
):
    """
    Save model checkpoint.
    
    Args:
        model: PyTorch model
        optimizer: Optimizer
        epoch: Current epoch
        loss: Current loss
        checkpoint_dir: Directory to save checkpoint
        filename: Checkpoint filename
    """
    checkpoint_dir = Path(checkpoint_dir)
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': loss
    }
    
    filepath = checkpoint_dir / filename
    torch.save(checkpoint, filepath)
    print(f"Checkpoint saved to {filepath}")


def load_checkpoint(
    model: torch.nn.Module,
    optimizer: torch.optim.Optimizer,
    checkpoint_path: str
) -> Dict[str, Any]:
    """
    Load model checkpoint.
    
    Args:
        model: PyTorch model
        optimizer: Optimizer
        checkpoint_path: Path to checkpoint
        
    Returns:
        Checkpoint dictionary
    """
    checkpoint = torch.load(checkpoint_path)
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    
    print(f"Checkpoint loaded from {checkpoint_path}")
    print(f"Resuming from epoch {checkpoint['epoch']}")
    
    return checkpoint


def compute_metrics(pred: torch.Tensor, target: torch.Tensor) -> Dict[str, float]:
    """
    Compute evaluation metrics.
    
    Args:
        pred: Predictions
        target: Ground truth
        
    Returns:
        Dictionary of metrics
    """
    with torch.no_grad():
        mse = torch.mean((pred - target) ** 2).item()
        mae = torch.mean(torch.abs(pred - target)).item()
        rmse = np.sqrt(mse)
        
        # R-squared
        ss_res = torch.sum((target - pred) ** 2)
        ss_tot = torch.sum((target - torch.mean(target)) ** 2)
        r2 = 1 - (ss_res / (ss_tot + 1e-8))
        r2 = r2.item()
        
        # MAPE (Mean Absolute Percentage Error)
        mape = torch.mean(torch.abs((target - pred) / (target + 1e-8))) * 100
        mape = mape.item()
    
    return {
        'mse': mse,
        'mae': mae,
        'rmse': rmse,
        'r2': r2,
        'mape': mape
    }


def get_logger(name: str, log_file: str = None) -> logging.Logger:
    """
    Create logger.
    
    Args:
        name: Logger name
        log_file: Path to log file (optional)
        
    Returns:
        Logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler
    if log_file:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


class EarlyStopping:
    """
    Early stopping to prevent overfitting.
    """
    
    def __init__(self, patience: int = 10, min_delta: float = 0.0):
        """
        Args:
            patience: Number of epochs to wait before stopping
            min_delta: Minimum change to qualify as improvement
        """
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None
        self.should_stop = False
    
    def __call__(self, val_loss: float) -> bool:
        """
        Check if training should stop.
        
        Args:
            val_loss: Current validation loss
            
        Returns:
            True if training should stop
        """
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss > self.best_loss - self.min_delta:
            self.counter += 1
            if self.counter >= self.patience:
                self.should_stop = True
        else:
            self.best_loss = val_loss
            self.counter = 0
        
        return self.should_stop
