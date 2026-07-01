from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel, Field
from app.db import db
from app.utils.security import verify_token

router = APIRouter(prefix="/api/v1/user", tags=["User Profile"])

class UpdateProfileRequest(BaseModel):
    name: str = Field(..., min_length=2)
    store_name: str = Field(..., min_length=2)
    store_address: str = ""

def get_current_user_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token otorisasi diperlukan."
        )
    payload = verify_token(authorization)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi login kedaluwarsa atau tidak sah. Silakan login kembali."
        )
    return payload["user_id"]

@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user_id)):
    user = db.execute_query(
        "SELECT id, name, phone, store_name, store_address, saldo_bisnis, role, created_at FROM users WHERE id = %s",
        (user_id,),
        fetch_one=True
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengguna tidak ditemukan."
        )
    return {
        "success": True,
        "user": user
    }

@router.put("/profile")
async def update_profile(request: UpdateProfileRequest, user_id: str = Depends(get_current_user_id)):
    success = db.execute_query(
        """
        UPDATE users 
        SET name = %s, store_name = %s, store_address = %s
        WHERE id = %s
        """,
        (request.name, request.store_name, request.store_address, user_id)
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal memperbarui profil."
        )
        
    return {
        "success": True,
        "message": "Profil berhasil diperbarui!"
    }
