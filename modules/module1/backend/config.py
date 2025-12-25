"""
Backend configuration.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Backend configuration settings."""
    
    # Model settings
    MODEL_CHECKPOINT_PATH = os.getenv(
        'MODEL_CHECKPOINT_PATH',
        'checkpoints/best_model.pt'
    )
    MODEL_CONFIG_PATH = os.getenv(
        'MODEL_CONFIG_PATH',
        'ml/config.yaml'
    )
    
    # Server settings
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 8000))
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    
    # Device settings
    DEVICE = os.getenv('DEVICE', 'cpu')
    
    # Data settings
    SYNTHETIC_DATA_PATH = os.getenv(
        'SYNTHETIC_DATA_PATH',
        'data/synthetic/traffic_data.pt'
    )
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')


config = Config()
