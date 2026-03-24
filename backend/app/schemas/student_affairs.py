from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime, date

class CounselingRecordBase(BaseModel):
    student_id: int
    counselor_id: int
    type: str
    notes: str
    action_taken: Optional[str] = None
    confidential: Optional[bool] = True

class CounselingRecordCreate(CounselingRecordBase):
    tenant_id: int

class CounselingRecord(CounselingRecordBase):
    id: int
    session_date: datetime
    tenant_id: int
    class Config:
        from_attributes = True

class StudentHealthBase(BaseModel):
    student_id: int
    blood_group: str
    allergies: Optional[Any] = None
    medical_history: Optional[Any] = None
    emergency_contact: str
    last_checkup: Optional[date] = None

class StudentHealthCreate(StudentHealthBase):
    tenant_id: int

class StudentHealth(StudentHealthBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

class ExtraCurricularParticipationBase(BaseModel):
    student_id: int
    event_name: str
    category: str
    participation_date: date
    achievement: str
    credits_awarded: Optional[float] = 0.0
    certificate_url: Optional[str] = None

class ExtraCurricularParticipationCreate(ExtraCurricularParticipationBase):
    tenant_id: int

class ExtraCurricularParticipation(ExtraCurricularParticipationBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

class AlumniDirectoryBase(BaseModel):
    student_id: int
    graduation_year: int
    company: str
    designation: str
    linkedin_url: Optional[str] = None
    is_mentor: Optional[bool] = False

class AlumniDirectoryCreate(AlumniDirectoryBase):
    tenant_id: int

class AlumniDirectory(AlumniDirectoryBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True
