"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class SimulationRequest(BaseModel):
    """Request model for simulation endpoint."""
    
    num_nodes: int = Field(
        default=50,
        ge=10,
        le=200,
        description="Number of nodes in the network"
    )
    history_length: int = Field(
        default=10,
        ge=5,
        le=50,
        description="Length of historical sequence"
    )
    scenario: str = Field(
        default="periodic",
        description="Traffic pattern scenario (periodic, bursty, random)"
    )
    prediction_steps: int = Field(
        default=1,
        ge=1,
        le=10,
        description="Number of future steps to predict"
    )


class NodePrediction(BaseModel):
    """Prediction for a single node."""
    
    node_id: int
    features: List[float]


class SimulationResponse(BaseModel):
    """Response model for simulation endpoint."""
    
    predictions: List[List[float]]
    metrics: Dict[str, float]
    graph: Dict[str, Any]
    metadata: Dict[str, Any]


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    
    status: str
    model_loaded: bool
    device: str
    model_info: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Response model for errors."""
    
    error: str
    detail: Optional[str] = None
