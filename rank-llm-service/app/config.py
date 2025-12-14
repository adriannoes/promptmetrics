import os
from typing import Dict, Any, List

class Config:
    """Configuration class for RankLLM service"""
    
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    API_TITLE: str = "RankLLM Service"
    API_VERSION: str = "1.0.0"
    
    # Model Configuration
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "monot5")
    MODEL_CACHE_DIR: str = os.getenv("RANKLLM_MODEL_DIR", "/app/models")
    CACHE_DIR: str = os.getenv("RANKLLM_CACHE_DIR", "/app/cache")
    
    # Available models configuration
    AVAILABLE_MODELS: Dict[str, Dict[str, Any]] = {
        "monot5": {
            "name": "MonoT5",
            "type": "pointwise",
            "model_path": "castorini/monot5-3b-msmarco-10k",
            "description": "Pointwise reranker - good for general purpose",
            "memory_requirement": "6GB",
            "recommended_for": ["general", "efficiency"]
        },
        "zephyr": {
            "name": "RankZephyr",
            "type": "listwise", 
            "model_path": "castorini/rank_zephyr_7b_v1_full",
            "description": "Listwise reranker - state-of-the-art performance",
            "memory_requirement": "14GB",
            "recommended_for": ["accuracy", "research"]
        },
        "vicuna": {
            "name": "RankVicuna",
            "type": "listwise",
            "model_path": "castorini/rank_vicuna_7b_v1",
            "description": "Listwise reranker - good balance",
            "memory_requirement": "14GB", 
            "recommended_for": ["balanced", "research"]
        },
        "duot5": {
            "name": "DuoT5",
            "type": "pairwise",
            "model_path": "castorini/duot5-3b-msmarco-10k",
            "description": "Pairwise reranker - good for precision",
            "memory_requirement": "6GB",
            "recommended_for": ["precision", "small_datasets"]
        }
    }
    
    # Performance settings
    MAX_DOCUMENTS: int = int(os.getenv("MAX_DOCUMENTS", "100"))
    MAX_QUERY_LENGTH: int = int(os.getenv("MAX_QUERY_LENGTH", "512"))
    MAX_DOCUMENT_LENGTH: int = int(os.getenv("MAX_DOCUMENT_LENGTH", "1024"))
    TIMEOUT_SECONDS: int = int(os.getenv("TIMEOUT_SECONDS", "300"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # CORS Configuration
    _allowed_origins_env = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ALLOWED_ORIGINS") or ""
    ALLOWED_ORIGINS: List[str] = [
        origin.strip()
        for origin in _allowed_origins_env.split(",")
        if origin and origin.strip()
    ] or ["http://localhost:5173"]
    
    @classmethod
    def get_model_config(cls, model_name: str) -> Dict[str, Any]:
        """Get configuration for a specific model"""
        return cls.AVAILABLE_MODELS.get(model_name, cls.AVAILABLE_MODELS["monot5"])
