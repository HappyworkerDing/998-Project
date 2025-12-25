"""
FastAPI backend for GNN traffic simulation.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from pathlib import Path
import sys

from models import (
    SimulationRequest,
    SimulationResponse,
    HealthResponse,
    ErrorResponse
)
from config import config
from inference import ModelInference

# Create FastAPI app
app = FastAPI(
    title="GNN Traffic Simulation API",
    description="API for network traffic prediction using Graph Neural Networks",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global inference engine
inference_engine = None


@app.on_event("startup")
async def startup_event():
    """Initialize model on startup."""
    global inference_engine
    
    try:
        print("Loading model...")
        inference_engine = ModelInference(
            checkpoint_path=config.MODEL_CHECKPOINT_PATH,
            config_path=config.MODEL_CONFIG_PATH,
            device=config.DEVICE
        )
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Server will start but /simulate endpoint will not work")


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with health check."""
    model_info = None
    if inference_engine:
        model_info = inference_engine.get_model_info()
    
    return HealthResponse(
        status="healthy",
        model_loaded=inference_engine is not None,
        device=config.DEVICE,
        model_info=model_info
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    model_info = None
    if inference_engine:
        model_info = inference_engine.get_model_info()
    
    return HealthResponse(
        status="healthy",
        model_loaded=inference_engine is not None,
        device=config.DEVICE,
        model_info=model_info
    )


@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Run network traffic simulation.
    
    Args:
        request: Simulation parameters
        
    Returns:
        Simulation results with predictions and metrics
    """
    if inference_engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please check server logs."
        )
    
    try:
        # Run prediction
        result = inference_engine.predict(
            num_nodes=request.num_nodes,
            sequence_length=request.history_length,
            scenario=request.scenario,
            prediction_steps=request.prediction_steps
        )
        
        # Format response
        response = SimulationResponse(
            predictions=result['predictions'],
            metrics=result['metrics'],
            graph=result['graph'],
            metadata=result['metadata']
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation failed: {str(e)}"
        )


@app.get("/model/info")
async def model_info():
    """Get model information."""
    if inference_engine is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )
    
    return inference_engine.get_model_info()


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal server error",
            detail=str(exc)
        ).dict()
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=True,
        log_level=config.LOG_LEVEL.lower()
    )
