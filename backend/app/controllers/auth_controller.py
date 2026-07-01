import uuid
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.db import db
from app.utils.security import hash_password, verify_password, create_token

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=8)
    password: str = Field(..., min_length=4)
    store_name: str = Field(..., min_length=2)
    store_address: str = ""

class LoginRequest(BaseModel):
    phone: str
    password: str

@router.post("/register")
async def register(request: RegisterRequest):
    # Check if user already exists
    existing_user = db.execute_query(
        "SELECT id FROM users WHERE phone = %s",
        (request.phone,),
        fetch_one=True
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nomor HP sudah terdaftar. Silakan gunakan nomor lain atau login."
        )
        
    user_id = str(uuid.uuid4())
    pw_hash = hash_password(request.password)
    
    success = db.execute_query(
        """
        INSERT INTO users (id, name, phone, password_hash, store_name, store_address)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (user_id, request.name, request.phone, pw_hash, request.store_name, request.store_address)
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal melakukan registrasi pengguna. Silakan coba lagi."
        )
        
    return {
        "success": True,
        "message": "Registrasi berhasil! Silakan masuk menggunakan nomor HP Anda.",
        "user": {
            "id": user_id,
            "name": request.name,
            "phone": request.phone,
            "store_name": request.store_name
        }
    }

@router.post("/login")
async def login(request: LoginRequest):
    user = db.execute_query(
        "SELECT * FROM users WHERE phone = %s",
        (request.phone,),
        fetch_one=True
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nomor HP atau password salah."
        )
        
    # Verify password (column indexes or keys depend on MySQL vs SQLite)
    # The execute_query returns dict for SQLite/MySQL if dictionary row factory is active
    password_hash = user.get("password_hash")
    if not password_hash or not verify_password(request.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nomor HP atau password salah."
        )
        
    # Check if active
    if not user.get("is_active", 1):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda dinonaktifkan."
        )
        
    # Create JWT token
    token = create_token(user["id"], user.get("role", "seller"))
    
    return {
        "success": True,
        "message": "Login berhasil!",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "phone": user["phone"],
            "store_name": user["store_name"],
            "store_address": user.get("store_address", ""),
            "role": user.get("role", "seller")
        }
    }
