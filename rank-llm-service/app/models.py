from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Document(BaseModel):
    """Document model for ranking"""
    id: str = Field(..., description="Unique document identifier")
    content: str = Field(..., description="Document content to be ranked")
    title: Optional[str] = Field(None, description="Document title")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional document metadata")

class RankLLMRequest(BaseModel):
    """Request model for document ranking"""
    query: str = Field(..., description="Search query", min_length=1, max_length=512)
    documents: List[Document] = Field(..., description="Documents to rank", min_items=1, max_items=100)
    model: str = Field("monot5", description="Model to use for ranking")
    top_k: Optional[int] = Field(None, description="Number of top results to return")
    domain: str = Field(..., description="Domain context for the ranking")

class RankedCandidate(BaseModel):
    """Ranked document candidate"""
    docid: str = Field(..., description="Document identifier")
    score: float = Field(..., description="Relevance score")
    rank: int = Field(..., description="Rank position")
    doc: Dict[str, Any] = Field(..., description="Document content and metadata")

class RankingResult(BaseModel):
    """Result of document ranking"""
    query: Dict[str, str] = Field(..., description="Query information")
    candidates: List[RankedCandidate] = Field(..., description="Ranked documents")
    metrics: Dict[str, Any] = Field(..., description="Performance metrics")

class RankLLMResponse(BaseModel):
    """Response model for ranking API"""
    id: str = Field(..., description="Request identifier")
    domain: str = Field(..., description="Domain context")
    query: str = Field(..., description="Search query")
    model_used: str = Field(..., description="Model used for ranking")
    ranking_data: RankingResult = Field(..., description="Ranking results")
    status: str = Field(..., description="Processing status")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class HealthCheck(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    models_available: List[str] = Field(..., description="Available models")
    uptime: float = Field(..., description="Service uptime in seconds")
    version: str = Field(..., description="Service version")

class ModelInfo(BaseModel):
    """Model information"""
    name: str = Field(..., description="Model name")
    type: str = Field(..., description="Model type (pointwise/pairwise/listwise)")
    size: str = Field(..., description="Model size")
    description: str = Field(..., description="Model description")
    recommended_for: List[str] = Field(..., description="Recommended use cases")

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Error details")
    request_id: Optional[str] = Field(None, description="Request identifier")
