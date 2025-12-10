"""
Configuration management for RAG service using Pydantic Settings
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """RAG service settings loaded from environment variables"""

    # Application
    APP_NAME: str = "Physical AI RAG Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Qdrant Vector Database
    QDRANT_HOST: str = "qdrant"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION_NAME: str = "course_chapters"
    QDRANT_VECTOR_SIZE: int = 768  # Qwen embedding dimension

    # Ollama (for Qwen embeddings)
    OLLAMA_HOST: str = "http://host.docker.internal:11434"
    OLLAMA_MODEL: str = "qwen2.5"

    # Claude API (for answer refinement)
    CLAUDE_API_KEY: str = "your-claude-api-key-here"
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20241022"
    CLAUDE_MAX_TOKENS: int = 1024

    # RAG Parameters
    RAG_TOP_K: int = 5  # Number of relevant chunks to retrieve
    RAG_SCORE_THRESHOLD: float = 0.7  # Minimum similarity score

    # Rate Limiting
    RATE_LIMIT_QUERIES: int = 20
    RATE_LIMIT_WINDOW_MINUTES: int = 1

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://website:3000",
    ]

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Global settings instance
settings = Settings()
