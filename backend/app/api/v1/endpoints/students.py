import sys
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.schemas.academic import Student as StudentSchema, StudentCreate, StudentEnroll
from app.models.academic import Student
from app.repositories.base import BaseRepository
from app.models.user import User
from app.core.security import get_password_hash

router = APIRouter()
student_repo = BaseRepository(Student)

@router.get("/me")
def read_student_me(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Fetch the student profile associated with the current login user.
    """
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for this user.")
    
    from app.models.tenant import Tenant
    tenant = db.query(Tenant).filter(Tenant.id == student.tenant_id).first()
    
    return {
        "id": student.id,
        "first_name": student.first_name,
        "last_name": student.last_name,
        "enrollment_number": student.enrollment_number,
        "branch": student.branch,
        "university_name": tenant.name if tenant else "Unknown University",
        "cgpa": 3.82, # Mocking dynamic data for now as it's not stored yet
        "attendance": "94.5%", 
        "wallet_balance": 12500,
        "current_year": student.current_year,
        "current_semester": student.current_semester
    }

@router.get("/", response_model=List[StudentSchema])
def read_students(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    branch: Optional[str] = None,
    admission_year: Optional[int] = None,
    current_user = Depends(deps.get_current_user)
):
    """
    Retrieve students with refined branch/year filters and role-based scope.
    """
    query = student_repo.get_scoped_query(db, user=current_user)
    if branch:
        query = query.filter(Student.branch == branch)
    if admission_year:
        query = query.filter(Student.admission_year == admission_year)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=StudentSchema)
def create_student(
    *,
    db: Session = Depends(get_db),
    student_in: StudentCreate,
    current_user = Depends(deps.allow_dean)
):
    """
    Register a new student within the current institutional context.
    """
    from sqlalchemy.exc import IntegrityError
    try:
        return student_repo.create(db, obj_in=student_in, tenant_id=current_user.tenant_id)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="Conflict in Global Student Registry: Enrollment Number already exists."
        )

@router.post("/enroll", response_model=StudentSchema)
def enroll_student(
    *,
    db: Session = Depends(get_db),
    enroll_in: StudentEnroll,
    current_user = Depends(deps.allow_dean)
):
    """
    Professional Onboarding Service: Creates student identity and login credentials.
    """
    # 1. Check if email already exists in User
    existing_user = db.query(User).filter(User.email == enroll_in.contact_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Identity already registered in the global directory.")

    # 2. Create Student Record
    # Filter out password as it's not a column in the Student model
    from sqlalchemy.exc import IntegrityError
    try:
        student_record_data = enroll_in.dict(exclude={"password"})
        student = Student(**student_record_data, tenant_id=current_user.tenant_id)
        db.add(student)
        db.flush() # To get student.id if needed later
        
        # 3. Create User Login Credentials
        user = User(
            email=enroll_in.contact_email,
            hashed_password=get_password_hash(enroll_in.password),
            full_name=f"{enroll_in.first_name} {enroll_in.last_name}",
            role="student",
            tenant_id=current_user.tenant_id
        )
        db.add(user)
        db.flush() # Get user.id
        
        # Link student to user
        student.user_id = user.id
        db.commit()
        return student
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Conflict in Global Student Registry: Enrolment ID already registered."
        )

@router.get("/{student_id}", response_model=StudentSchema)
def read_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    student = student_repo.get(db, id=student_id, user=current_user)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found or access denied")
    return student
