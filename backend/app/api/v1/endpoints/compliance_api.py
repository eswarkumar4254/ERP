from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.schemas.institutional import (
    InstitutionalTask as TaskSchema, InstitutionalTaskCreate,
    QualityReport as QualitySchema, QualityReportCreate
)
from app.schemas.compliance import (
    NoDueRequest as NoDueSchema, NoDueRequestCreate,
    NoDueClearance as ClearanceSchema, NoDueClearanceCreate
)
from app.models.institutional import InstitutionalTask, QualityReport
from app.models.compliance import NoDueRequest, NoDueClearance
from app.repositories.base import BaseRepository

router = APIRouter()

task_repo = BaseRepository(InstitutionalTask)
quality_repo = BaseRepository(QualityReport)
nodue_repo = BaseRepository(NoDueRequest)
clearance_repo = BaseRepository(NoDueClearance)

# Institutional Tasks
@router.get("/tasks", response_model=List[TaskSchema])
def read_tasks(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return task_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

# Quality Reports
@router.get("/quality-reports", response_model=List[QualitySchema])
def read_quality_reports(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return quality_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

# No-Due System
@router.get("/nodue-requests", response_model=List[NoDueSchema])
def read_nodue_requests(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return nodue_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/nodue-requests", response_model=NoDueSchema)
def create_nodue_request(
    *,
    db: Session = Depends(get_db),
    obj_in: NoDueRequestCreate,
    current_user = Depends(deps.get_current_user)
):
    request = nodue_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)
    
    # Auto-generate clearances for standard departments
    departments = ["Library", "Hostel", "Transport", "Finance", "TPO", "Academic Dept"]
    for dept in departments:
        db_clearance = NoDueClearance(
            request_id=request.id,
            department=dept,
            status="pending",
            tenant_id=current_user.tenant_id
        )
        db.add(db_clearance)
    db.commit()
    db.refresh(request)
    return request

@router.get("/pending-clearances")
def get_pending_clearances(
    db: Session = Depends(get_db),
    department: Optional[str] = None,
    current_user = Depends(deps.get_current_user)
):
    """Admin/HOD: List student no-due requests waiting for departmental signature."""
    query = db.query(NoDueClearance).filter(NoDueClearance.status == "pending")
    if department:
        query = query.filter(NoDueClearance.department == department)
        
    clearances = query.all()
    result = []
    for c in clearances:
        req = db.query(NoDueRequest).filter(NoDueRequest.id == c.request_id).first()
        student_id = req.student_id if req else "Unknown"
        result.append({
            "id": c.id,
            "request_id": c.request_id,
            "student_id": student_id,
            "department": c.department,
            "requested_at": req.created_at if req else None,
            "purpose": req.purpose if req else "Graduation"
        })
    return result

from datetime import datetime

@router.post("/clearance-sign")
def sign_clearance(
    clearance_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Admin/HOD: Digital signature for student clearance."""
    clearance = db.query(NoDueClearance).filter(NoDueClearance.id == clearance_id).first()
    if not clearance:
        raise HTTPException(status_code=404, detail="Clearance record not found")
        
    clearance.status = "cleared"
    clearance.clearance_date = datetime.utcnow()
    clearance.remarks = f"Approved by {current_user.email}"
    db.commit()
    
    # Check if all clearances for the parent request are done
    all_clear = db.query(NoDueClearance).filter(
        NoDueClearance.request_id == clearance.request_id,
        NoDueClearance.status != "cleared"
    ).count() == 0
    
    if all_clear:
        request = db.query(NoDueRequest).filter(NoDueRequest.id == clearance.request_id).first()
        request.status = "cleared"
        db.commit()
        
    return {"status": "success"}

@router.get("/filings")
def get_statutory_filings(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """View all statutory and regulatory filings (NIRF, NAAC, AQAR)."""
    # Mock data for now, ideally backed by a StatutoryFiling model
    return [
        {"id": 1, "body": "NIRF", "fiscal_year": "2025-26", "status": "submitted", "date": "2026-02-14", "category": "Institutional"},
        {"id": 2, "body": "AQAR", "fiscal_year": "2024-25", "status": "pending", "date": "2026-05-30", "category": "NAAC"},
        {"id": 3, "body": "UGC Status", "fiscal_year": "2026", "status": "certified", "date": "2026-01-10", "category": "Regulatory"},
        {"id": 4, "body": "AISHE", "fiscal_year": "2025-26", "status": "in_progress", "date": "2026-04-15", "category": "Government"}
    ]

@router.get("/risks")
def get_risk_register(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Institutional Risk Register tracking."""
    return [
        {"id": 1, "risk": "Placement Target Shortfall", "impact": "High", "mitigation": "Aggressive Alumni Outreach", "owner": "TPO"},
        {"id": 2, "risk": "Faculty PhD Ratio < 80%", "impact": "Medium", "mitigation": "PhD sponsorship policy", "owner": "Dean Academic"},
        {"id": 3, "risk": "Syllabus Obsolescence", "impact": "Low", "mitigation": "Annual BoS Review", "owner": "IQAC"}
    ]
