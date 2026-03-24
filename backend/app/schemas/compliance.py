from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NoDueClearanceBase(BaseModel):
    department: str
    status: str = "pending"
    remarks: Optional[str] = None

class NoDueClearanceCreate(NoDueClearanceBase):
    request_id: int

class NoDueClearance(NoDueClearanceBase):
    id: int
    request_id: int
    cleared_by_id: Optional[int] = None
    clearance_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class NoDueRequestBase(BaseModel):
    purpose: str

class NoDueRequestCreate(NoDueRequestBase):
    student_id: int

class NoDueRequest(NoDueRequestBase):
    id: int
    student_id: int
    status: str
    request_date: datetime
    completion_date: Optional[datetime] = None
    clearances: List[NoDueClearance] = []

    class Config:
        from_attributes = True
