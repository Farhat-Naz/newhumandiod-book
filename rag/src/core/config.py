"""
Configuration management for RAG service using Pydantic Settings
"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """RAG service settings loaded from environment variables"""

    # Application
    APP_NAME: str = "Physical AI RAG Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Qdrant Vector Database
    QDRANT_HOST: str = "your-cluster-url.qdrant.io"  # Replace with your actual URL
    QDRANT_PORT: int = 443  # Qdrant Cloud uses HTTPS on port 443
    QDRANT_API_KEY: str = "your-actual-api-key"  # Add your API key
    QDRANT_COLLECTION_NAME: str = "course_chapters"
    QDRANT_VECTOR_SIZE: int = 384  # all-MiniLM-L6-v2 embedding dimension

    # Ollama (for Qwen embeddings)
    OLLAMA_HOST: str = "http://host.docker.internal:11434"
    OLLAMA_MODEL: str = "qwen2.5"

    # OpenAI API (for answer generation)
    OPENAI_API_KEY: str = "your-openai-api-key-here"
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 1024

    # RAG Parameters
    RAG_TOP_K: int = 5  # Number of relevant chunks to retrieve
    RAG_SCORE_THRESHOLD: float = 0.3  # Minimum similarity score (lowered for better recall)

    # Rate Limiting
    RATE_LIMIT_QUERIES: int = 20
    RATE_LIMIT_WINDOW_MINUTES: int = 1

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5000",  # Common dev server port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5000",
        "http://website:3000",
        "https://newhumandiod-book.vercel.app",
        "https://newhumandiod-book-git-master-farhats-projects-27800a4d.vercel.app",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
    ]

    # Logging
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


# Global settings instance
settings = Settings()
