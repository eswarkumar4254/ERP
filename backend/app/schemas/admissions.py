from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AdmissionApplicationBase(BaseModel):
    student_name: str
    email: str
    phone: str
    previous_qualification: str
    entrance_exam_score: Optional[float] = 0.0

class AdmissionApplicationCreate(AdmissionApplicationBase):
    pass

class AdmissionApplicationUpdate(BaseModel):
    status: Optional[str] = None
    counseling_date: Optional[datetime] = None
    allotted_course_id: Optional[int] = None
    scholarship_amount: Optional[float] = None
    challan_generated: Optional[bool] = None
    uv_registration_number: Optional[str] = None
    educational_details: Optional[dict] = None
    demographics: Optional[dict] = None

class AdmissionApplication(AdmissionApplicationBase):
    id: int
    status: str
    scholarship_amount: float
    counseling_date: Optional[datetime] = None
    allotted_course_id: Optional[int] = None
    challan_generated: bool
    uv_registration_number: Optional[str] = None
    educational_details: Optional[dict] = None
    demographics: Optional[dict] = None
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
