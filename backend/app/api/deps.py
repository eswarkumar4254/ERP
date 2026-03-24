from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.base import TokenData
from app.repositories.user_repository import user_repo

from app.models.rbac import Role, Permission, Module
from app.models.tenant import Tenant, Plan

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/token")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, tenant_id=payload.get("tenant_id"))
    except JWTError:
        raise credentials_exception
    user = user_repo.get_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    
    # NEW: Secure RLS Context Injection
    # These session variables trigger the Postgres 15 policies
    from sqlalchemy import text
    try:
        db.execute(text(f"SET LOCAL app.current_tenant_id = '{user.tenant_id}';"))
        db.execute(text(f"SET LOCAL app.user_role = '{user.role}';"))
    except Exception as e:
        # In case DB is not Postgres or doesn't support RLS yet
        print(f"RLS context failed: {e}")
        db.rollback()


    return user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        # Check permissions through role_link
        if user.role == "super_admin": # Super Admin bypass
            return user
            
        if not user.roles_link:
            raise HTTPException(status_code=403, detail="User has no assigned role")
            
        permissions = [p.name for p in user.roles_link.permissions]
        if self.required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {self.required_permission}"
            )
        return user

def requires_permission(perm: str):
    return PermissionChecker(perm)

class ServiceChecker:
    def __init__(self, module_name: str):
        self.module_name = module_name

    def __call__(self, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        # Super Admins represent the platform owner, not bound by tenant plans
        if user.role == "super_admin":
            return user
            
        tenant = user.tenant
        if not tenant:
            raise HTTPException(status_code=403, detail="User is not associated with a tenant")
            
        if not tenant.plan:
            raise HTTPException(status_code=403, detail="Your institution has no active plan")
            
        allowed_modules = [m.name for m in tenant.plan.modules]
        if self.module_name not in allowed_modules:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"The '{self.module_name}' service is not enabled for your institution. Contact your admin to upgrade your plan."
            )
        return user

def requires_service(module_name: str):
    return ServiceChecker(module_name)

def get_current_tenant(user: User = Depends(get_current_user)) -> Tenant:
    if not user.tenant_id:
        raise HTTPException(status_code=403, detail="Tenant context missing")
    return user.tenant

# Professional Role Definitions
class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {self.allowed_roles}"
            )
        return user

# Convienience Role Guards
allow_super_admin = RoleChecker(["super_admin"])
allow_it_admin = RoleChecker(["super_admin", "it_admin"])
allow_institution_admin = RoleChecker(["super_admin", "institution_admin"])
allow_admin = allow_institution_admin # Alias for legacy support
allow_registrar = RoleChecker(["super_admin", "institution_admin", "registrar"])
allow_dean = RoleChecker(["super_admin", "institution_admin", "dean", "dean_ar", "dean_iqac", "dean_aaa"])
allow_faculty = RoleChecker(["super_admin", "institution_admin", "dean", "faculty", "hod"])
allow_staff = RoleChecker(["super_admin", "institution_admin", "staff", "faculty", "registrar", "junior_assistant", "academic_deo", "exam_cell_deo"])
allow_finance = RoleChecker(["super_admin", "institution_admin", "finance_officer"])
allow_placement = RoleChecker(["super_admin", "institution_admin", "placement_officer", "tpo"])
allow_library = RoleChecker(["super_admin", "institution_admin", "library_manager"])
allow_hod = RoleChecker(["super_admin", "institution_admin", "dean", "hod"])
allow_student = RoleChecker(["super_admin", "student"])
allow_parent = RoleChecker(["super_admin", "parent"])
allow_alumni = RoleChecker(["super_admin", "alumni"])
allow_ipm = RoleChecker(["super_admin", "institution_admin", "ipm_manager", "it_admin"])
allow_scrutinizer = RoleChecker(["super_admin", "institution_admin", "scrutinizer"])
allow_dean_ar = RoleChecker(["super_admin", "institution_admin", "dean_ar", "dean"])
allow_authenticated = RoleChecker([
    "super_admin", "institution_admin", "dean", "dean_ar", "dean_iqac", "dean_aaa", "faculty", 
    "staff", "student", "parent", "alumni", "placement_officer", "tpo",
    "finance_officer", "library_manager", "it_admin", "registrar", "hod", "academic_deo",
    "exam_cell_deo", "scrutinizer", "junior_assistant", "randd", "timetable_incharge", "ipm_manager"
])
