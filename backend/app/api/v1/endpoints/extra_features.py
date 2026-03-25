from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.extra_features import StudyPlan, Grievance, CourseModule, StudentModuleCompletion, GlobalAnnouncement, BiometricLog
from app.models.academic import Student, Course
from app.models.finance import Invoice
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# --- 1. Study Planner (Dynamic AI-like Scheduler) ---
class StudyPlanCreate(BaseModel):
    title: str
    tasks: List[dict]
    start_date: datetime
    end_date: datetime

@router.get("/planner/study-plans")
def get_study_plans(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student: raise HTTPException(404, "Student profile required")
    return db.query(StudyPlan).filter(StudyPlan.student_id == student.id).all()

@router.post("/planner/study-plans")
def create_study_plan(obj_in: StudyPlanCreate, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    plan = StudyPlan(**obj_in.dict(), student_id=student.id, tenant_id=current_user.tenant_id)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

# --- 2. Grievance Support Desk ---
class GrievanceCreate(BaseModel):
    category: str
    subject: str
    description: str

@router.get("/support/grievances")
def get_grievances(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    return db.query(Grievance).filter(Grievance.student_id == student.id).all()

@router.post("/support/grievances")
def create_grievance(obj_in: GrievanceCreate, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    g = Grievance(**obj_in.dict(), student_id=student.id, tenant_id=current_user.tenant_id)
    db.add(g)
    db.commit()
    db.refresh(g)
    return g

# --- 3. Syllabus Progress Tracker ---
@router.get("/academics/syllabus/{course_id}")
def get_syllabus(course_id: int, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    modules = db.query(CourseModule).filter(CourseModule.course_id == course_id).order_by(CourseModule.order).all()
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    completions = []
    if student:
        completions = db.query(StudentModuleCompletion.module_id).filter(
            StudentModuleCompletion.student_id == student.id,
            StudentModuleCompletion.is_completed == True
        ).all()
        completions = [c[0] for c in completions]
    
    return [{"module": m, "is_completed": m.id in completions} for m in modules]

# --- 4. Global Alerts Broadcaster ---
@router.get("/announcements/global")
def get_global_announcements(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(GlobalAnnouncement).filter(
        (GlobalAnnouncement.tenant_id == current_user.tenant_id) &
        ((GlobalAnnouncement.target_role == "all") | (GlobalAnnouncement.target_role == current_user.role))
    ).all()

# --- 5. Financial Dashboard (Student View) ---
@router.get("/finance/my-invoices")
def get_my_invoices(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student: return []
    return db.query(Invoice).filter(Invoice.student_id == student.id).all()

# --- 6. Biometric Integration Bridge ---
@router.get("/biometric/logs")
def get_biometric_logs(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(BiometricLog).filter(BiometricLog.user_id == current_user.id).order_by(BiometricLog.timestamp.desc()).all()

# --- 7. Predictive Performance Analytics (Mocked Logic) ---
@router.get("/analytics/student-risk/{student_id}")
def get_student_risk(student_id: int, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    # Mocked complex AI analysis of GPA, attendance, and activity
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student: raise HTTPException(404, "Student not found")
    
    # Simple logic for mock: if GPA < 3.0 or low attendance
    risk_score = 0
    if student.grade_level == "4th Year": risk_score += 20
    # ... more complex mocked factors
    return {
        "student_id": student_id,
        "risk_level": "Low" if risk_score < 30 else "Medium",
        "score": risk_score,
        "factors": ["Current Year Workload", "Recent Attendance Stability"],
        "recommendation": "Maintain consistency in lab sessions."
    }
