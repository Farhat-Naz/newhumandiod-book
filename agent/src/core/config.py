"""
Configuration management for Agent service using Pydantic Settings
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Agent service settings loaded from environment variables"""

    # Application
    APP_NAME: str = "Physical AI Translation Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Translation Models (choose one)
    TRANSLATION_MODEL: str = "gpt-4o-mini"  # Options: seamlessm4t, qwen2.5-translation, gpt-4o-mini
    OPENAI_API_KEY: str = "your-openai-api-key-here"

    # Target Languages
    SUPPORTED_LANGUAGES: List[str] = ["en", "ur", "ar", "zh"]
    DEFAULT_SOURCE_LANGUAGE: str = "en"

    # Translation Parameters
    PRESERVE_CODE_BLOCKS: bool = True
    PRESERVE_TECHNICAL_TERMS: bool = True
    BATCH_SIZE: int = 10  # Number of files to translate in parallel

    # File Paths
    SOURCE_DOCS_PATH: str = "website/docs"
    OUTPUT_I18N_PATH: str = "website/i18n"

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 50
    RATE_LIMIT_WINDOW_MINUTES: int = 1

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
