from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.user_repository import user_repo
from app.core import security
from app.schemas.base import Token
from app.api import deps

router = APIRouter()

@router.post("/token", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # 1. Try finding by email
    user = user_repo.get_by_email(db, email=form_data.username)
    
    # 2. If not found, try finding by Enrolment ID (Student only)
    if not user:
        from app.models.academic import Student
        student = db.query(Student).filter(Student.enrollment_number == form_data.username).first()
        if student and student.user_id:
            user = user_repo.get(db, id=student.user_id)

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username (email/enrolment) or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        subject=user.email,
        tenant_id=user.tenant_id,
        role=user.role
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "tenant_id": user.tenant_id
    }

@router.get("/me")
def get_current_user_info(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    from app.models.tenant import Tenant
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    allowed_modules = []
    if tenant and tenant.plan:
        allowed_modules = [m.name for m in tenant.plan.modules]
    
    # Super admins see everything
    if current_user.role == "super_admin":
        from app.models.rbac import Module
        allowed_modules = [m.name for m in db.query(Module).all()]

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "tenant_id": current_user.tenant_id,
        "allowed_modules": allowed_modules,
        "tenant_name": tenant.name if tenant else "Unknown"
    }
