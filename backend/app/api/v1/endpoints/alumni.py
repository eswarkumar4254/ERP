from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.api import deps
from app.models.domain import Alumni, AlumniEvent
from app.models.academic import Student

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

class AlumniCreate(BaseModel):
    student_id: int
    graduation_year: int
    current_company: str | None = None
    job_title: str | None = None
    industry: str | None = None
    location: str | None = None
    linkedin_url: str | None = None
    mentorship_opt_in: bool = False

class AlumniResponse(AlumniCreate):
    id: int
    class Config:
        from_attributes = True

@router.get("/", response_model=List[AlumniResponse])
def get_alumni_list(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(Alumni).filter(Alumni.tenant_id == current_user.tenant_id).all()

@router.post("/", response_model=AlumniResponse)
def create_alumni(payload: AlumniCreate, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    # Check if a student records exist
    student = db.query(Student).get(payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    alumni = Alumni(
        **payload.dict(),
        tenant_id=current_user.tenant_id
    )
    db.add(alumni)
    db.commit()
    db.refresh(alumni)
    return alumni

@router.get("/events")
def get_alumni_events(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(AlumniEvent).filter(AlumniEvent.tenant_id == current_user.tenant_id).all()

@router.get("/stats")
def get_alumni_stats(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    total = db.query(Alumni).filter(Alumni.tenant_id == current_user.tenant_id).count()
    mentors = db.query(Alumni).filter(Alumni.tenant_id == current_user.tenant_id, Alumni.mentorship_opt_in == True).count()
    companies = db.query(Alumni.current_company).filter(Alumni.tenant_id == current_user.tenant_id).distinct().count()
    
    return {
        "total_alumni": total,
        "active_mentors": mentors,
        "partner_companies": companies,
        "placement_boost": "15%" # Strategy target
    }
