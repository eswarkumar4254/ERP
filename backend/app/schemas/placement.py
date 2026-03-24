from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import date, datetime

class PlacementDriveBase(BaseModel):
    company_name: str
    job_description: str
    visit_date: date
    package_lpa: float
    eligibility_criteria: dict

class PlacementDriveCreate(PlacementDriveBase):
    pass

class PlacementDrive(PlacementDriveBase):
    id: int
    status: str
    class Config:
        from_attributes = True

class StudentPlacementBase(BaseModel):
    student_id: int
    drive_id: int
    status: str
    payout_if_placed: Optional[float] = None
    offer_letter_url: Optional[str] = None

class StudentPlacementCreate(StudentPlacementBase):
    pass

class StudentPlacement(StudentPlacementBase):
    id: int
    class Config:
        from_attributes = True

class InternshipBase(BaseModel):
    student_id: int
    company: str
    start_date: date
    end_date: date
    certificate_url: Optional[str] = None
    is_ppo: bool = False

class InternshipCreate(InternshipBase):
    pass

class Internship(InternshipBase):
    id: int
    class Config:
        from_attributes = True
