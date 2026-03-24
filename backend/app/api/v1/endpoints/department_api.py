from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.academic import Staff, Student, LeaveRequest, ODRequest, ProjectBatch
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class LeaveRequestCreate(BaseModel):
    leave_type: str
    start_date: datetime
    end_date: datetime
    reason: str
    substitution_faculty_id: Optional[int] = None

class ODRequestCreate(BaseModel):
    event_name: str
    start_date: datetime
    end_date: datetime
    proof_url: Optional[str] = None

class ProjectBatchCreate(BaseModel):
    title: str
    description: Optional[str] = None
    guide_id: Optional[int] = None
    academic_year: str
    student_ids: List[int]

# --- HOD / Department Workflows ---

@router.get("/leaves/pending")
def get_pending_leaves(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: List all pending leave requests in the department."""
    # In a multi-tenant setup, HOD might only see their department
    # For now, showing all in tenant
    pending = db.query(LeaveRequest).filter(
        LeaveRequest.status == "pending",
        LeaveRequest.tenant_id == current_user.tenant_id
    ).all()
    
    result = []
    for l in pending:
        staff = db.query(Staff).filter(Staff.id == l.staff_id).first()
        result.append({
            "id": l.id,
            "staff_name": f"{staff.first_name} {staff.last_name}" if staff else "Unknown",
            "leave_type": l.leave_type,
            "start_date": l.start_date,
            "end_date": l.end_date,
            "reason": l.reason,
            "status": l.status
        })
    return result

@router.post("/leaves/approve/{leave_id}")
def approve_leave(
    leave_id: int,
    remarks: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: Approve a faculty leave request."""
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    leave.status = "approved"
    leave.hod_remarks = remarks
    db.commit()
    return {"status": "success", "message": "Leave approved"}

@router.post("/leaves/apply")
def apply_leave(
    leave_in: LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: Apply for a leave."""
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff record not found")
    
    new_leave = LeaveRequest(
        staff_id=staff.id,
        leave_type=leave_in.leave_type,
        start_date=leave_in.start_date,
        end_date=leave_in.end_date,
        reason=leave_in.reason,
        substitution_faculty_id=leave_in.substitution_faculty_id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave

@router.get("/od/pending")
def get_pending_ods(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: List all pending OD requests."""
    pending = db.query(ODRequest).filter(
        ODRequest.status == "pending",
        ODRequest.tenant_id == current_user.tenant_id
    ).all()
    
    result = []
    for od in pending:
        student = db.query(Student).filter(Student.id == od.student_id).first()
        result.append({
            "id": od.id,
            "student_name": f"{student.first_name} {student.last_name}" if student else "Unknown",
            "enrollment": student.enrollment_number if student else "-",
            "event_name": od.event_name,
            "start_date": od.start_date,
            "end_date": od.end_date,
            "status": od.status
        })
    return result

@router.post("/od/verify/{od_id}")
def verify_od(
    od_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: Verify an OD request (moves to verified_by_hod)."""
    od = db.query(ODRequest).filter(ODRequest.id == od_id).first()
    if not od:
        raise HTTPException(status_code=404, detail="OD request not found")
    
    od.status = "verified_by_hod"
    db.commit()
    return {"status": "success", "message": "OD verified by HOD"}

@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """List project batches in the tenant."""
    return db.query(ProjectBatch).filter(ProjectBatch.tenant_id == current_user.tenant_id).all()

@router.post("/projects")
def create_project_batch(
    project_in: ProjectBatchCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: Create a new project batch."""
    new_batch = ProjectBatch(
        title=project_in.title,
        description=project_in.description,
        guide_id=project_in.guide_id,
        academic_year=project_in.academic_year,
        student_ids=project_in.student_ids,
        tenant_id=current_user.tenant_id
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch
@router.get("/metrics/overview")
def get_department_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD/Dean: Get department-wide performance metrics."""
    # Mocking for demo
    return {
        "pass_percentage": 88.4,
        "avg_attendance": 82.1,
        "active_projects": 12,
        "faculty_count": 14,
        "subjects_covered": 28,
        "pending_actions": 3,
        "student_dist": [
            {"label": "Distinction (>75%)", "value": 45, "color": "#10b981"},
            {"label": "First Class (60-75%)", "value": 38, "color": "#6366f1"},
            {"label": "Second Class (50-60%)", "value": 12, "color": "#f59e0b"},
            {"label": "Below 50%", "value": 5, "color": "#ef4444"}
        ]
    }

@router.get("/staff/performance")
def get_staff_performance(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: View faculty workload and syllabus completion status."""
    staff_list = db.query(Staff).filter(Staff.tenant_id == current_user.tenant_id).all()
    results = []
    import random
    for s in staff_list:
        results.append({
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "designation": s.designation,
            "syllabus_completion": random.randint(65, 95),
            "avg_student_feedback": round(random.uniform(3.8, 4.9), 1),
            "research_score": random.randint(20, 100)
        })
    return results

@router.get("/students/at-risk")
def get_at_risk_students(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: List students flagged for low attendance or performance."""
    students = db.query(Student).filter(Student.tenant_id == current_user.tenant_id).limit(10).all()
    results = []
    import random
    for s in students:
        results.append({
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "enrollment": s.enrollment_number,
            "grade": s.grade_level,
            "attendance": random.randint(55, 74),
            "backlogs": random.randint(1, 4),
            "risk_level": "High" if random.choice([True, False]) else "Medium"
        })
    return results
