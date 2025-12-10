"""
FastAPI Backend Application for Physical AI & Humanoid Robotics Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings

# Create FastAPI app instance
app = FastAPI(
    title="Physical AI & Humanoid Robotics API",
    description="Backend API for the learning platform",
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
        "message": "Physical AI & Humanoid Robotics Backend API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "ok", "service": "backend"}


# Import and include routers (will be added later)
# from src.api.v1 import auth, users, health
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
# app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
# app.include_router(health.router, prefix="/api/v1", tags=["Health"])
