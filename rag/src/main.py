"""
RAG Service - FastAPI application for AI-powered chatbot with vector search
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="Physical AI RAG Service",
    description="AI-powered RAG chatbot with Qdrant vector search and Claude LLM",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Physical AI RAG Service",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "rag"}


@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat interaction

    Expected message format:
    {
        "query": "user question",
        "chapter_filter": ["chapter-1", "chapter-2"] (optional)
    }

    Response format:
    {
        "type": "chunk" | "complete" | "error",
        "content": "response text",
        "sources": [{"chapter": "...", "title": "...", "score": 0.95}],
        "error": "error message" (if type=error)
    }
    """
    await websocket.accept()
    logger.info("WebSocket connection established")

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            query = data.get("query", "")
            chapter_filter = data.get("chapter_filter", None)

            if not query:
                await websocket.send_json({
                    "type": "error",
                    "error": "Query cannot be empty"
                })
                continue

            logger.info(f"Received query: {query}")

            # TODO: Implement RAG pipeline
            # 1. Generate embedding for query using Qwen via Ollama
            # 2. Search Qdrant for relevant chunks with chapter filter
            # 3. Stream response using Claude API

            # Placeholder response
            await websocket.send_json({
                "type": "complete",
                "content": "RAG pipeline not yet implemented. This is a placeholder response.",
                "sources": []
            })

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "error": str(e)
            })
        except:
            pass


# Import and include routers (will be added later)
# from src.api.v1 import embeddings, search
# app.include_router(embeddings.router, prefix="/api/v1/embeddings", tags=["Embeddings"])
# app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
