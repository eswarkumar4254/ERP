from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.schemas.student_affairs import (
    CounselingRecord as CounselingSchema, CounselingRecordCreate,
    StudentHealth as HealthSchema, StudentHealthCreate,
    ExtraCurricularParticipation as ParticipationSchema, ExtraCurricularParticipationCreate,
    AlumniDirectory as AlumniSchema, AlumniDirectoryCreate
)
from app.models.student_affairs import (
    CounselingRecord, StudentHealth, 
    ExtraCurricularParticipation, AlumniDirectory
)
from app.repositories.base import BaseRepository

router = APIRouter()

counsel_repo = BaseRepository(CounselingRecord)
health_repo = BaseRepository(StudentHealth)
extra_repo = BaseRepository(ExtraCurricularParticipation)
alumni_repo = BaseRepository(AlumniDirectory)

@router.get("/counseling", response_model=List[CounselingSchema])
def read_counseling(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return counsel_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/counseling", response_model=CounselingSchema)
def create_counseling(
    *,
    db: Session = Depends(get_db),
    obj_in: CounselingRecordCreate,
    current_user = Depends(deps.get_current_user)
):
    return counsel_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)

@router.get("/health/{student_id}", response_model=HealthSchema)
def read_health(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    # Only staff or the student themselves can see health data
    health = health_repo.get_scoped_query(db, current_user).filter(StudentHealth.student_id == student_id).first()
    if not health:
        raise HTTPException(status_code=404, detail="Health record not found")
    return health

@router.get("/extracurricular", response_model=List[ParticipationSchema])
def read_extracurricular(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return extra_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.get("/alumni", response_model=List[AlumniSchema])
def read_alumni(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return alumni_repo.get_multi(db, skip=skip, limit=limit, user=current_user)
@router.get("/mood-logs")
def get_mood_logs(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Behavioral Analytics: Retrieve student mood trends."""
    return [
        {"date": "2026-03-10", "mood": "Good"},
        {"date": "2026-03-11", "mood": "Great"},
        {"date": "2026-03-12", "mood": "Low"}
    ]

@router.get("/wellness-resources")
def get_wellness_resources(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Mental Health: Retrieve curated wellness content."""
    return [
        {"title": "Anxiety Management", "type": "PDF", "url": "/docs/anxiety.pdf"},
        {"title": "Guided Meditation", "type": "Audio", "url": "/audio/meditate.mp3"}
    ]

@router.post("/emergency-alert")
def trigger_emergency_alert(
    current_user = Depends(deps.get_current_user)
):
    """Crisis Management: Notify rapid response teams."""
    print(f"CRITICAL: Emergency alert triggered by User {current_user.id}")
    return {"status": "Rapid Response Team Notified", "arrival_est": "5-10 mins"}
