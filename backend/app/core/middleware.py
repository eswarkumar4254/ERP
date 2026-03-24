from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import AuditLog
from jose import jwt
from app.core.config import settings

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Only log mutations
        if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
            # Try to get user info from token
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                try:
                    token = auth_header.split(" ")[1]
                    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                    user_id = payload.get("sub") # Usually email, but we might want ID
                    tenant_id = payload.get("tenant_id")
                    
                    db = SessionLocal()
                    log = AuditLog(
                        action=request.method,
                        target_table=request.url.path,
                        description=f"User {user_id} performed {request.method} on {request.url.path}",
                        ip_address=request.client.host,
                        tenant_id=tenant_id
                    )
                    db.add(log)
                    db.commit()
                    db.close()
                except Exception as e:
                    print(f"Audit log failed: {e}")
        
        return response
