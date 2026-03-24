from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.domain import Asset, MaintenanceRequest
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class AssetSchema(BaseModel):
    id: int
    name: str
    category: str
    asset_tag: str
    location: str
    condition: str
    status: str
    class Config:
        from_attributes = True

router = APIRouter()
asset_repo = BaseRepository(Asset)

@router.get("/assets", response_model=List[AssetSchema])
def get_assets(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Infra Command: Monitor institutional assets."""
    return asset_repo.get_multi(db, user=current_user)

@router.post("/assets", response_model=AssetSchema)
def register_asset(
    asset_in: AssetSchema,
    db: Session = Depends(get_db),
    current_user = Depends(deps.requires_permission("manage_infrastructure"))
):
    """IT Admin: Onboard new physical or digital assets."""
    return asset_repo.create(db, obj_in=asset_in.dict(exclude={"id"}), user=current_user)
