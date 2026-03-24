from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class ExamBase(BaseModel):
    title: str
    course_id: int
    exam_date: datetime
    duration_minutes: int = 60
    total_marks: int = 100
    type: str = "internal"

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    status: str
    tenant_id: int
    class Config:
        from_attributes = True

class ExamResultBase(BaseModel):
    exam_id: int
    student_id: int
    marks_obtained: float = 0.0
    grade: Optional[str] = None
    is_pass: bool = True
    remarks: Optional[str] = None
    evaluation_status: str = "unevaluated"
    evaluator_id: Optional[int] = None
    scrutinizer_id: Optional[int] = None
    question_wise_marks: Optional[dict] = None
    is_locked: bool = False

class ExamResultCreate(ExamResultBase):
    pass

class ExamResult(ExamResultBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

# --- Facility Schemas ---
class HostelBase(BaseModel):
    name: str
    warden_name: str
    total_capacity: int
    type: str

class Hostel(HostelBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True
