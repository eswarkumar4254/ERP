from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.academic import Parent, ParentStudent, Student, Attendance, ElectiveChoice
from app.models.finance import Invoice
from app.models.domain import ExamResult

router = APIRouter()

@router.get("/my-wards")
def get_parent_wards(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Fetch all students (wards) associated with this parent."""
    parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent record not found")
        
    ward_relations = db.query(ParentStudent).filter(ParentStudent.parent_id == parent.id).all()
    ward_ids = [r.student_id for r in ward_relations]
    
    wards = db.query(Student).filter(Student.id.in_(ward_ids)).all()
    return wards

@router.get("/ward/{student_id}/attendance-mini")
def get_ward_attendance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Parent: View simplified attendance for a ward."""
    # Verify relationship
    parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
    exists = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent.id, 
        ParentStudent.student_id == student_id
    ).first()
    if not exists:
        raise HTTPException(status_code=403, detail="Access denied to this ward")
        
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    total = 100 # Mock slots
    attended = len([r for r in records if r.status == "present"])
    percentage = (attended / total * 100) if total > 0 else 100
    
    return {
        "percentage": percentage,
        "status": "Shortage" if percentage < 75 else "Normal",
        "last_absent": "2026-03-12" # Mock
    }

@router.get("/ward/{student_id}/invoices")
def get_ward_invoices(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Parent: View and Pay invoices for a ward."""
    # Verify relationship
    parent = db.query(Parent).filter(Parent.user_id == current_user.id).first()
    exists = db.query(ParentStudent).filter(
        ParentStudent.parent_id == parent.id, 
        ParentStudent.student_id == student_id
    ).first()
    if not exists:
        raise HTTPException(status_code=403, detail="Access denied")
        
    return db.query(Invoice).filter(Invoice.student_id == student_id).all()
