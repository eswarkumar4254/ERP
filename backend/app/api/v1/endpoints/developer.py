from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.tenant import APIKey
import secrets
from typing import List

router = APIRouter()

@router.post("/keys")
def create_api_key(
    name: str,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_admin)
):
    """Developer Platform: Generate new API Key."""
    new_key = f"erp_{secrets.token_urlsafe(32)}"
    api_key = APIKey(
        key=new_key,
        name=name,
        tenant_id=current_user.tenant_id
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    return api_key

@router.get("/keys")
def list_api_keys(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_admin)
):
    return db.query(APIKey).filter(APIKey.tenant_id == current_user.tenant_id).all()
