import time
import logging
from typing import List, Dict, Any, Optional
from rank_llm.data import Request, Query, Candidate, Result
from rank_llm.rerank import Reranker
from rank_llm.rerank.listwise import ZephyrReranker, VicunaReranker
from rank_llm.rerank.pointwise.monot5 import MonoT5
from rank_llm.rerank.pairwise.duot5 import DuoT5
from .config import Config
from .models import Document, RankedCandidate, RankingResult

logger = logging.getLogger(__name__)

class RankLLMService:
    """Service for document ranking using RankLLM"""
    
    def __init__(self):
        self.models = {}
        self.start_time = time.time()
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize available models"""
        try:
            # Initialize MonoT5 (lightweight, good for production)
            self.models["monot5"] = MonoT5()
            logger.info("MonoT5 model initialized successfully")
            
            # Initialize other models on demand to save memory
            logger.info("RankLLM service initialized with MonoT5")
            
        except Exception as e:
            logger.error(f"Failed to initialize models: {e}")
            raise
    
    def _get_reranker(self, model_name: str):
        """Get or initialize a reranker model"""
        if model_name in self.models:
            return self.models[model_name]
        
        try:
            if model_name == "zephyr":
                self.models["zephyr"] = ZephyrReranker()
            elif model_name == "vicuna":
                self.models["vicuna"] = VicunaReranker()
            elif model_name == "duot5":
                self.models["duot5"] = DuoT5()
            else:
                raise ValueError(f"Unknown model: {model_name}")
            
            logger.info(f"Model {model_name} initialized successfully")
            return self.models[model_name]
            
        except Exception as e:
            logger.error(f"Failed to initialize model {model_name}: {e}")
            raise
    
    def _prepare_request(self, query: str, documents: List[Document]) -> Request:
        """Prepare RankLLM request from input data"""
        # Create query object
        query_obj = Query(text=query, qid="query_1")
        
        # Create candidates from documents
        candidates = []
        for i, doc in enumerate(documents):
            candidate = Candidate(
                docid=doc.id,
                score=0.0,  # Initial score, will be updated by reranker
                doc={
                    "title": doc.title or "",
                    "content": doc.content,
                    "metadata": doc.metadata or {}
                }
            )
            candidates.append(candidate)
        
        return Request(query=query_obj, candidates=candidates)
    
    def _format_results(self, result: Result, model_used: str, processing_time: float) -> RankingResult:
        """Format RankLLM results into our response format"""
        # Create ranked candidates
        candidates = []
        for i, candidate in enumerate(result.candidates):
            ranked_candidate = RankedCandidate(
                docid=candidate.docid,
                score=candidate.score,
                rank=i + 1,
                doc=candidate.doc
            )
            candidates.append(ranked_candidate)
        
        # Create metrics
        metrics = {
            "model_used": model_used,
            "processing_time_ms": processing_time * 1000,
            "total_documents": len(candidates),
            "top_score": candidates[0].score if candidates else 0.0,
            "score_range": {
                "min": min(c.score for c in candidates) if candidates else 0.0,
                "max": max(c.score for c in candidates) if candidates else 0.0
            }
        }
        
        return RankingResult(
            query={"text": result.query.text, "qid": result.query.qid},
            candidates=candidates,
            metrics=metrics
        )
    
    async def rank_documents(
        self, 
        query: str, 
        documents: List[Document], 
        model: str = "monot5",
        top_k: Optional[int] = None
    ) -> RankingResult:
        """Rank documents using specified model"""
        start_time = time.time()
        
        try:
            # Validate inputs
            if not query.strip():
                raise ValueError("Query cannot be empty")
            
            if not documents:
                raise ValueError("Documents list cannot be empty")
            
            if len(documents) > Config.MAX_DOCUMENTS:
                raise ValueError(f"Too many documents. Maximum allowed: {Config.MAX_DOCUMENTS}")
            
            # Get reranker
            reranker = self._get_reranker(model)
            
            # Prepare request
            request = self._prepare_request(query, documents)
            
            # Perform ranking
            logger.info(f"Starting ranking with model {model} for {len(documents)} documents")
            result = reranker.rerank(
                request=request,
                rank_start=0,
                rank_end=len(documents),
                logging=True
            )
            
            # Apply top_k filter if specified
            if top_k and top_k < len(result.candidates):
                result.candidates = result.candidates[:top_k]
            
            processing_time = time.time() - start_time
            
            # Format results
            ranking_result = self._format_results(result, model, processing_time)
            
            logger.info(f"Ranking completed in {processing_time:.2f}s")
            return ranking_result
            
        except Exception as e:
            logger.error(f"Error during ranking: {e}")
            raise
    
    def get_available_models(self) -> List[str]:
        """Get list of available models"""
        return list(Config.AVAILABLE_MODELS.keys())
    
    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        return Config.get_model_config(model_name)
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get service health status"""
        uptime = time.time() - self.start_time
        return {
            "status": "healthy",
            "models_available": self.get_available_models(),
            "uptime": uptime,
            "version": Config.API_VERSION
        }
