import uuid
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.db import db
from app.controllers.user_controller import get_current_user_id

router = APIRouter(prefix="/api/v1/transactions", tags=["Transactions"])

class TransactionCreateRequest(BaseModel):
    name: str # description
    type: str # 'income' or 'expense'
    category: str
    amount: float
    date: str # YYYY-MM-DD

@router.get("")
async def get_transactions(user_id: str = Depends(get_current_user_id)):
    txs = db.execute_query(
        "SELECT id, tanggal, nama_barang, total_nominal, kategori, url_nota_fisik FROM transaksi WHERE user_id = %s ORDER BY tanggal DESC",
        (user_id,),
        fetch_all=True
    )
    formatted = []
    for tx in txs:
        # Parse combined category and name
        raw_name = tx["nama_barang"]
        if " - " in raw_name:
            parts = raw_name.split(" - ", 1)
            category_val = parts[0]
            name_val = parts[1]
        else:
            category_val = "Lainnya"
            name_val = raw_name

        amount_val = float(tx["total_nominal"]) if tx.get("total_nominal") is not None else 0.0
        tx_type = "income" if tx["kategori"] == "pemasukan" else "expense"
        
        formatted.append({
            "id": tx["id"],
            "name": name_val,
            "type": tx_type,
            "category": category_val,
            "amount": amount_val,
            "date": str(tx["tanggal"]),
            "url_nota_fisik": tx.get("url_nota_fisik"),
            "status": "Selesai"
        })
    return {
        "success": True,
        "transactions": formatted
    }

@router.post("")
async def create_transaction(request: TransactionCreateRequest, user_id: str = Depends(get_current_user_id)):
    tx_id = str(uuid.uuid4())
    db_category = "pemasukan" if request.type == "income" else "pengeluaran"
    # Combine category and description into nama_barang to match schema while retaining category info
    combined_name = f"{request.category} - {request.name}"
    
    success = db.execute_query(
        """
        INSERT INTO transaksi (id, user_id, tanggal, nama_barang, total_nominal, kategori)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (tx_id, user_id, request.date, combined_name, request.amount, db_category)
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal menambahkan transaksi."
        )
        
    # Automatically adjust saldo_bisnis in users table!
    # If income, add. If expense, subtract.
    adjustment = request.amount if request.type == "income" else -request.amount
    db.execute_query(
        "UPDATE users SET saldo_bisnis = saldo_bisnis + %s WHERE id = %s",
        (adjustment, user_id)
    )

    return {
        "success": True,
        "transaction": {
            "id": tx_id,
            "name": request.name,
            "type": request.type,
            "category": request.category,
            "amount": request.amount,
            "date": request.date,
            "status": "Selesai"
        }
    }

@router.delete("/{tx_id}")
async def delete_transaction(tx_id: str, user_id: str = Depends(get_current_user_id)):
    # Verify owner and get transaction details to adjust balance back
    tx = db.execute_query(
        "SELECT total_nominal, kategori FROM transaksi WHERE id = %s AND user_id = %s",
        (tx_id, user_id),
        fetch_one=True
    )
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaksi tidak ditemukan."
        )
        
    amount = float(tx["total_nominal"])
    tx_type = "income" if tx["kategori"] == "pemasukan" else "expense"
    adjustment = -amount if tx_type == "income" else amount
    
    success = db.execute_query(
        "DELETE FROM transaksi WHERE id = %s AND user_id = %s",
        (tx_id, user_id)
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal menghapus transaksi."
        )
        
    # Revert balance adjustment
    db.execute_query(
        "UPDATE users SET saldo_bisnis = saldo_bisnis + %s WHERE id = %s",
        (adjustment, user_id)
    )
        
    return {
        "success": True,
        "message": "Transaksi berhasil dihapus."
    }
