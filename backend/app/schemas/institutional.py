from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class InstitutionalTaskBase(BaseModel):
    title: str
    description: str
    department_id: int
    assigned_to_id: Optional[int] = None
    due_date: datetime
    category: str
    status: Optional[str] = "pending"

class InstitutionalTaskCreate(InstitutionalTaskBase):
    tenant_id: int

class InstitutionalTask(InstitutionalTaskBase):
    id: int
    completion_date: Optional[datetime] = None
    tenant_id: int
    class Config:
        from_attributes = True

class QualityReportBase(BaseModel):
    framework: str
    metric_name: str
    value: Any
    year: int
    department_id: Optional[int] = None

class QualityReportCreate(QualityReportBase):
    tenant_id: int

class QualityReport(QualityReportBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True
