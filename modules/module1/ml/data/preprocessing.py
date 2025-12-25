"""
Data preprocessing utilities.
"""

import torch
import numpy as np
from typing import Tuple, Optional


def normalize_features(
    data: torch.Tensor,
    mean: Optional[torch.Tensor] = None,
    std: Optional[torch.Tensor] = None
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """
    Normalize features to zero mean and unit variance.
    
    Args:
        data: Input tensor of any shape
        mean: Pre-computed mean (optional)
        std: Pre-computed std (optional)
        
    Returns:
        normalized_data, mean, std
    """
    if mean is None:
        mean = data.mean()
    if std is None:
        std = data.std() + 1e-8
    
    normalized = (data - mean) / std
    return normalized, mean, std


def denormalize_features(
    data: torch.Tensor,
    mean: torch.Tensor,
    std: torch.Tensor
) -> torch.Tensor:
    """
    Denormalize features back to original scale.
    
    Args:
        data: Normalized tensor
        mean: Mean used for normalization
        std: Std used for normalization
        
    Returns:
        Denormalized tensor
    """
    return data * std + mean


def create_batches(
    data: torch.Tensor,
    batch_size: int,
    shuffle: bool = True
) -> list:
    """
    Create batches from data.
    
    Args:
        data: Input tensor [num_samples, ...]
        batch_size: Batch size
        shuffle: Whether to shuffle data
        
    Returns:
        List of batched tensors
    """
    num_samples = data.size(0)
    indices = torch.randperm(num_samples) if shuffle else torch.arange(num_samples)
    
    batches = []
    for i in range(0, num_samples, batch_size):
        batch_indices = indices[i:i + batch_size]
        batches.append(data[batch_indices])
    
    return batches


def add_noise(
    data: torch.Tensor,
    noise_level: float = 0.1,
    noise_type: str = 'gaussian'
) -> torch.Tensor:
    """
    Add noise to data for augmentation.
    
    Args:
        data: Input tensor
        noise_level: Noise strength
        noise_type: Type of noise ('gaussian' or 'uniform')
        
    Returns:
        Noisy data
    """
    if noise_type == 'gaussian':
        noise = torch.randn_like(data) * noise_level
    elif noise_type == 'uniform':
        noise = (torch.rand_like(data) - 0.5) * 2 * noise_level
    else:
        raise ValueError(f"Unknown noise type: {noise_type}")
    
    return data + noise


def sliding_window(
    data: np.ndarray,
    window_size: int,
    stride: int = 1
) -> np.ndarray:
    """
    Create sliding windows from time series data.
    
    Args:
        data: Time series data [time_steps, ...]
        window_size: Window size
        stride: Stride between windows
        
    Returns:
        Windowed data [num_windows, window_size, ...]
    """
    num_windows = (len(data) - window_size) // stride + 1
    windows = []
    
    for i in range(num_windows):
        start = i * stride
        end = start + window_size
        windows.append(data[start:end])
    
    return np.array(windows)
