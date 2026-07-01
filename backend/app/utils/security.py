import os
import time
import json
import base64
import hmac
import hashlib
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkey_sianai")

# ────────────────────────────────────────────────────────
#  Password Hashing Fallback (Bcrypt vs PBKDF2-HMAC-SHA256)
# ────────────────────────────────────────────────────────
USE_BCRYPT = False
try:
    import bcrypt
    USE_BCRYPT = True
except ImportError:
    print("Security WARNING: bcrypt is not installed. Using PBKDF2-HMAC-SHA256 password hashing fallback.")

def hash_password(password: str) -> str:
    if USE_BCRYPT:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    else:
        # Standard library SHA256 PBKDF2 fallback
        salt = "sianai_salt_12345"
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return f"pbkdf2_sha256${salt}${pwd_hash.hex()}"

def verify_password(password: str, hashed_password: str) -> bool:
    if USE_BCRYPT:
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            # Fallback if the hash format in DB is the fallback format
            pass
            
    # Check fallback format
    if hashed_password.startswith("pbkdf2_sha256$"):
        try:
            _, salt, original_hash = hashed_password.split("$")
            new_hash = hashlib.pbkdf2_hmac(
                'sha256',
                password.encode('utf-8'),
                salt.encode('utf-8'),
                100000
            )
            return new_hash.hex() == original_hash
        except Exception:
            return False
            
    return False


# ────────────────────────────────────────────────────────
#  JWT Token Fallback (PyJWT vs Custom HMAC-SHA256 JWT)
# ────────────────────────────────────────────────────────
USE_PYJWT = False
try:
    import jwt
    USE_PYJWT = True
except ImportError:
    print("Security WARNING: pyjwt is not installed. Using custom signed JSON Web Token fallback.")

def create_token(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": int(time.time()) + (24 * 3600)  # 24 hours
    }
    
    if USE_PYJWT:
        return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    else:
        # Custom JWT Implementation
        def base64_url_encode(data: bytes) -> str:
            return base64.urlsafe_b64encode(data).decode('utf-8').replace('=', '')
            
        header = {"alg": "HS256", "typ": "JWT"}
        header_b64 = base64_url_encode(json.dumps(header).encode('utf-8'))
        payload_b64 = base64_url_encode(json.dumps(payload).encode('utf-8'))
        
        signature_base = f"{header_b64}.{payload_b64}".encode('utf-8')
        signature = hmac.new(JWT_SECRET.encode('utf-8'), signature_base, hashlib.sha256).digest()
        signature_b64 = base64_url_encode(signature)
        
        return f"{header_b64}.{payload_b64}.{signature_b64}"

def verify_token(token: str) -> dict:
    if not token:
        return None
        
    # Strip Bearer if present
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
        
    if USE_PYJWT:
        try:
            return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except Exception:
            return None
    else:
        # Verify custom JWT signature
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
                
            header_b64, payload_b64, signature_b64 = parts
            
            def base64_url_decode(s: str) -> bytes:
                padding = '=' * (4 - len(s) % 4)
                return base64.urlsafe_b64decode(s + padding)
                
            # Re-sign and compare
            signature_base = f"{header_b64}.{payload_b64}".encode('utf-8')
            expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signature_base, hashlib.sha256).digest()
            
            # Format comparison safely
            def base64_url_encode(data: bytes) -> str:
                return base64.urlsafe_b64encode(data).decode('utf-8').replace('=', '')
                
            if base64_url_encode(expected_sig) != signature_b64:
                return None
                
            payload = json.loads(base64_url_decode(payload_b64).decode('utf-8'))
            
            # Check expiration
            if payload.get("exp", 0) < time.time():
                return None
                
            return payload
        except Exception:
            return None
