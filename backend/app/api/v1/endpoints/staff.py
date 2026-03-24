from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.academic import Staff
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class StaffBase(BaseModel):
    first_name: str
    last_name: str
    employee_id: str
    department: str
    designation: str
    contact_email: str

class StaffSchema(StaffBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

router = APIRouter()
staff_repo = BaseRepository(Staff)

@router.get("/", response_model=List[StaffSchema])
def read_staff(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return staff_repo.get_multi(db, skip=skip, limit=limit, user=current_user)
