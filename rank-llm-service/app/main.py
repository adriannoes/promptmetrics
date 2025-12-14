import logging
import uuid
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import Config
from .models import (
    RankLLMRequest, RankLLMResponse, HealthCheck, ModelInfo, 
    ErrorResponse, Document
)
from .reranker import RankLLMService

# Configure logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=Config.API_TITLE,
    version=Config.API_VERSION,
    description="Document ranking service using RankLLM",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
try:
    rankllm_service = RankLLMService()
    logger.info("RankLLM service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize RankLLM service: {e}")
    raise

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    try:
        health_data = rankllm_service.get_health_status()
        return HealthCheck(**health_data)
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        )

@app.get("/models", response_model=List[ModelInfo])
async def get_models():
    """Get available models"""
    try:
        models = []
        for model_name in rankllm_service.get_available_models():
            model_config = rankllm_service.get_model_info(model_name)
            models.append(ModelInfo(
                name=model_name,
                type=model_config["type"],
                size=model_config["memory_requirement"],
                description=model_config["description"],
                recommended_for=model_config["recommended_for"]
            ))
        return models
    except Exception as e:
        logger.error(f"Failed to get models: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve models"
        )

@app.post("/rerank", response_model=RankLLMResponse)
async def rerank_documents(request: RankLLMRequest):
    """Rank documents using RankLLM"""
    request_id = str(uuid.uuid4())
    start_time = datetime.now()
    
    try:
        logger.info(f"Processing ranking request {request_id} for domain {request.domain}")
        
        # Validate model
        if request.model not in rankllm_service.get_available_models():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown model: {request.model}. Available models: {rankllm_service.get_available_models()}"
            )
        
        # Convert documents to internal format
        documents = [
            Document(
                id=doc.id,
                content=doc.content,
                title=doc.title,
                metadata=doc.metadata
            )
            for doc in request.documents
        ]
        
        # Perform ranking
        ranking_result = await rankllm_service.rank_documents(
            query=request.query,
            documents=documents,
            model=request.model,
            top_k=request.top_k
        )
        
        # Create response
        response = RankLLMResponse(
            id=request_id,
            domain=request.domain,
            query=request.query,
            model_used=request.model,
            ranking_data=ranking_result,
            status="completed",
            created_at=start_time,
            updated_at=datetime.now()
        )
        
        logger.info(f"Ranking request {request_id} completed successfully")
        return response
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error in request {request_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error in request {request_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during ranking"
        )

@app.get("/models/{model_name}")
async def get_model_info(model_name: str):
    """Get detailed information about a specific model"""
    try:
        if model_name not in rankllm_service.get_available_models():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Model {model_name} not found"
            )
        
        model_config = rankllm_service.get_model_info(model_name)
        return {
            "name": model_name,
            "config": model_config,
            "available": True
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get model info for {model_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve model information"
        )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=Config.API_HOST,
        port=Config.API_PORT,
        reload=True
    )
