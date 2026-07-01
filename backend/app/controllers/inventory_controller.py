import uuid
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.db import db
from app.controllers.user_controller import get_current_user_id
import datetime

router = APIRouter(prefix="/api/v1/inventory", tags=["Inventory"])

class InventoryCreateRequest(BaseModel):
    name: str
    ulos_type: str
    cost_price: float
    selling_price: float
    quantity: int = 1
    status: str = "ready"
    date_added: str = None

class InventoryUpdateRequest(BaseModel):
    name: str = None
    ulos_type: str = None
    cost_price: float = None
    selling_price: float = None
    quantity: int = None
    status: str = None

@router.get("")
async def get_inventory(user_id: str = Depends(get_current_user_id)):
    items = db.execute_query(
        "SELECT id, nama_ulos, harga_modal, harga_jual, jumlah_stok, tanggal_masuk, status_stok, batas_diskon_aman FROM inventory WHERE user_id = %s",
        (user_id,),
        fetch_all=True
    )
    formatted = []
    for item in items:
        raw_name = item["nama_ulos"]
        if " - " in raw_name:
            parts = raw_name.split(" - ", 1)
            ulos_type_val = parts[0]
            name_val = parts[1]
        else:
            ulos_type_val = "Lainnya"
            name_val = raw_name
            
        formatted.append({
            "id": item["id"],
            "name": name_val,
            "ulos_type": ulos_type_val,
            "cost_price": float(item["harga_modal"]),
            "selling_price": float(item["harga_jual"]),
            "quantity": int(item["jumlah_stok"]) if item["jumlah_stok"] is not None else 1,
            "unit": "lembar",
            "status": item["status_stok"],
            "date_added": str(item["tanggal_masuk"]),
            "batas_diskon_aman": float(item["batas_diskon_aman"])
        })
    return {
        "success": True,
        "inventory": formatted
    }

@router.post("")
async def create_inventory_item(request: InventoryCreateRequest, user_id: str = Depends(get_current_user_id)):
    item_id = str(uuid.uuid4())
    safe_discount = request.cost_price * 1.05
    combined_name = f"{request.ulos_type} - {request.name}"
    
    date_added_val = request.date_added if request.date_added else datetime.date.today().isoformat()
    
    status_val = request.status
    if date_added_val:
        try:
            entry_date = datetime.date.fromisoformat(date_added_val)
            age = (datetime.date.today() - entry_date).days
            if age > 90 and status_val == "ready":
                status_val = "unsold_90_days"
        except Exception:
            pass

    success = db.execute_query(
        """
        INSERT INTO inventory (id, user_id, nama_ulos, harga_modal, harga_jual, jumlah_stok, tanggal_masuk, status_stok, batas_diskon_aman)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (item_id, user_id, combined_name, request.cost_price, request.selling_price, request.quantity, date_added_val, status_val, safe_discount)
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal menambahkan barang ke stok."
        )
    return {
        "success": True,
        "item": {
            "id": item_id,
            "name": request.name,
            "ulos_type": request.ulos_type,
            "cost_price": request.cost_price,
            "selling_price": request.selling_price,
            "quantity": request.quantity,
            "unit": "lembar",
            "status": status_val,
            "date_added": date_added_val,
            "batas_diskon_aman": safe_discount
        }
    }

@router.put("/{item_id}")
async def update_inventory_item(item_id: str, request: InventoryUpdateRequest, user_id: str = Depends(get_current_user_id)):
    # Verify owner
    item = db.execute_query(
        "SELECT nama_ulos, harga_modal, harga_jual, jumlah_stok, status_stok FROM inventory WHERE id = %s AND user_id = %s",
        (item_id, user_id),
        fetch_one=True
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Barang tidak ditemukan."
        )
    
    raw_name = item["nama_ulos"]
    if " - " in raw_name:
        parts = raw_name.split(" - ", 1)
        db_ulos_type = parts[0]
        db_name = parts[1]
    else:
        db_ulos_type = "Lainnya"
        db_name = raw_name

    new_name = request.name if request.name is not None else db_name
    new_ulos_type = request.ulos_type if request.ulos_type is not None else db_ulos_type
    combined_name = f"{new_ulos_type} - {new_name}"

    new_cost_price = request.cost_price if request.cost_price is not None else float(item["harga_modal"])
    new_selling_price = request.selling_price if request.selling_price is not None else float(item["harga_jual"])
    new_quantity = request.quantity if request.quantity is not None else int(item["jumlah_stok"])
    new_status = request.status if request.status is not None else item["status_stok"]
    new_safe_discount = new_cost_price * 1.05

    success = db.execute_query(
        """
        UPDATE inventory 
        SET nama_ulos = %s, harga_modal = %s, harga_jual = %s, jumlah_stok = %s, status_stok = %s, batas_diskon_aman = %s 
        WHERE id = %s AND user_id = %s
        """,
        (combined_name, new_cost_price, new_selling_price, new_quantity, new_status, new_safe_discount, item_id, user_id)
    )
        
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal memperbarui barang."
        )
    return {
        "success": True,
        "message": "Data stok berhasil diperbarui."
    }

@router.delete("/{item_id}")
async def delete_inventory_item(item_id: str, user_id: str = Depends(get_current_user_id)):
    # Verify owner
    item = db.execute_query(
        "SELECT id FROM inventory WHERE id = %s AND user_id = %s",
        (item_id, user_id),
        fetch_one=True
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Barang tidak ditemukan."
        )
        
    success = db.execute_query(
        "DELETE FROM inventory WHERE id = %s AND user_id = %s",
        (item_id, user_id)
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal menghapus barang."
        )
    return {
        "success": True,
        "message": "Barang berhasil dihapus."
    }
