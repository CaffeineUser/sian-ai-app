import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Import Controllers
from app.controllers.auth_controller import router as auth_router
from app.controllers.user_controller import router as user_router
from app.controllers.transaction_controller import router as transaction_router
from app.controllers.inventory_controller import router as inventory_router
from app.rag_service import RAGService

app = FastAPI(
    title="SianAI RAG Advisor & Auth API",
    description="Backend API for SianAI including RAG, Authentication, Transactions and Inventory management.",
    version="1.1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(transaction_router)
app.include_router(inventory_router)

# Initialize RAG Service
rag_service = RAGService()

# Request/Response Models for RAG
class ChatMessage(BaseModel):
    role: str # 'user' or 'model'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

class ContextChunkInfo(BaseModel):
    id: str
    category: str
    title: str
    content: str
    score: float

class ChatResponse(BaseModel):
    success: bool
    response: str
    context_chunks: List[ContextChunkInfo]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SianAI RAG & DB Backend (Python FastAPI)",
        "gemini_api_key_configured": os.getenv("GEMINI_API_KEY") is not None and os.getenv("GEMINI_API_KEY") != "YOUR_GEMINI_API_KEY_HERE"
    }

@app.post("/api/v1/advisor/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Format history to list of dicts for RAG Service
        history_dicts = []
        if request.history:
            history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
            
        result = rag_service.generate_answer(request.message, history_dicts)
        
        return ChatResponse(
            success=True,
            response=result["response"],
            context_chunks=result["context_chunks"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/advisor/ingest")
async def force_ingest():
    try:
        rag_service.ingest_knowledge_base(force=True)
        return {
            "success": True,
            "message": "Embeddings cache successfully re-ingested."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest knowledge base: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
