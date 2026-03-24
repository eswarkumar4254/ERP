from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.admissions import AdmissionApplication
from app.repositories.base import BaseRepository
from app.schemas.admissions import (
    AdmissionApplication as AdmissionSchema, 
    AdmissionApplicationCreate,
    AdmissionApplicationUpdate
)
from app.models.finance import Invoice
import uuid

router = APIRouter()
admission_repo = BaseRepository(AdmissionApplication)

@router.get("/", response_model=List[AdmissionSchema])
def read_admissions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    """View all admission applications (Filtered by role scoping in BaseRepository)."""
    return admission_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/", response_model=AdmissionSchema)
def create_admission(
    *,
    db: Session = Depends(get_db),
    obj_in: AdmissionApplicationCreate,
    current_user = Depends(deps.get_current_user)
):
    """Student/Guest: Register for entrance exam."""
    return admission_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)

@router.patch("/{app_id}", response_model=AdmissionSchema)
def update_admission_status(
    *,
    db: Session = Depends(get_db),
    app_id: int,
    obj_in: AdmissionApplicationUpdate,
    current_user = Depends(deps.allow_dean_ar)
):
    """Dean AR: Update counseling date, status or allotted course."""
    application = db.query(AdmissionApplication).filter(AdmissionApplication.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Apply updates
    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    # If status becomes 'allotted', generate a Finance Challan
    if application.status == "allotted" and not application.challan_generated:
        new_challan = Invoice(
            title=f"Admission Course Fee - {application.student_name}",
            amount=50000.0, # Example fixed fee, should be dynamic based on course
            status="pending",
            student_id=None, # Not a student yet
            challan_number=f"CHL-{uuid.uuid4().hex[:8].upper()}",
            tenant_id=current_user.tenant_id
        )
        db.add(new_challan)
        application.challan_generated = True

    db.commit()
    return application

@router.post("/{app_id}/complete-registration")
def complete_enrollment(
    app_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_dean_ar)
):
    """Dean AR: Process paid challan and generate UV Registration Number."""
    application = db.query(AdmissionApplication).filter(AdmissionApplication.id == app_id).first()
    if not application or not application.challan_generated:
        raise HTTPException(status_code=400, detail="Application not ready for registration completion")
    
    # In a real app, check if Invoice.status == "paid"
    application.status = "registered"
    application.uv_registration_number = f"VFSTR-{uuid.uuid4().hex[:6].upper()}"
    
    db.commit()
    return {
        "status": "Registration Complete",
        "uv_registration_number": application.uv_registration_number
    }

@router.post("/batches/process")
def process_omr_batch(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_dean_ar)
):
    """Simulate OMR processing by assigning random scores to 'pending' applicants."""
    import random
    pending = db.query(AdmissionApplication).filter(
        AdmissionApplication.status == "pending",
        AdmissionApplication.tenant_id == current_user.tenant_id
    ).all()
    
    for app in pending:
        app.entrance_exam_score = random.uniform(40.0, 98.0)
        app.status = "counseling"
        app.counseling_date = func.now()
    
    db.commit()
    return {"status": "batch_processed", "count": len(pending)}
