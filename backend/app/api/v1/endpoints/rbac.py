from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.rbac import Role, Permission, Module
from app.models.user import User
from app.core.security import get_password_hash
from pydantic import BaseModel, EmailStr

router = APIRouter()

class RoleSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_system: bool
    module_names: List[str] = []
    
    class Config:
        from_attributes = True

class UserCreateInternal(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    module_ids: List[int] = []
    permission_ids: List[int] = []
    users: List[UserCreateInternal] = []

@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Fetch roles visible to the current tenant, including global system roles."""
    roles = db.query(Role).filter(
        (Role.tenant_id == current_user.tenant_id) | (Role.tenant_id == None)
    ).all()
    
    result = []
    for r in roles:
        result.append({
            "id": r.id,
            "name": r.name,
            "description": r.description,
            "is_system": r.is_system,
            "modules": [m.name for m in r.modules],
            "tenant_id": r.tenant_id
        })
    return result

@router.post("/roles")
def create_role(
    role_in: RoleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    """Institution Admin: Create a custom role scoped to your plan's modules."""
    if not current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Super Admin cannot create tenant-scoped roles here.")

    # Enforcement: Check Role Creation Quota based on Subscription Plan
    tenant = current_user.tenant
    max_allowed = tenant.plan.max_roles if (tenant and tenant.plan) else 5
    current_count = db.query(Role).filter(Role.tenant_id == current_user.tenant_id).count()
    
    if current_count >= max_allowed:
        raise HTTPException(
            status_code=403, 
            detail=f"Institutional role limit reached ({max_allowed}). Please upgrade your strategic plan to expand your governance structure."
        )

    existing = db.query(Role).filter(
        Role.name == role_in.name, 
        Role.tenant_id == current_user.tenant_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Role name already in use within your institution.")
    
    new_role = Role(
        name=role_in.name,
        description=role_in.description,
        tenant_id=current_user.tenant_id,
        is_system=False
    )
    
    # Security: Only allow modules included in the tenant's active plan
    allowed_module_ids = [m.id for m in current_user.tenant.plan.modules]
    requested_modules = db.query(Module).filter(Module.id.in_(role_in.module_ids)).all()
    
    for mod in requested_modules:
        if mod.id not in allowed_module_ids:
             raise HTTPException(
                 status_code=403, 
                 detail=f"Module '{mod.name}' is not authorized for your current subscription plan."
             )
        new_role.modules.append(mod)

    # Permissions (Global list for now)
    requested_perms = db.query(Permission).filter(Permission.id.in_(role_in.permission_ids)).all()
    new_role.permissions = requested_perms

    db.add(new_role)
    db.flush() # Get the new_role.id for user association

    # Bulk User/Credential Creation at Role Creation Time
    for user_data in role_in.users:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            # Handle existing user - possibly update their role or skip
            # For now, let's skip/error to ensure fresh credential creation as requested
            continue
            
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=get_password_hash(user_data.password),
            role=new_role.name, # Legacy fallback
            role_id=new_role.id,
            tenant_id=current_user.tenant_id,
            is_active=True
        )
        db.add(new_user)

    db.commit()
    db.refresh(new_role)
    return {
        "id": new_role.id,
        "name": new_role.name,
        "modules": [m.name for m in new_role.modules]
    }

@router.delete("/roles/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    """Permanently remove a custom role. System roles are protected."""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role.is_system or role.tenant_id is None:
        raise HTTPException(status_code=403, detail="System-defined roles cannot be deleted.")
    
    if role.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Unauthorized: Role belongs to another institution.")

    db.delete(role)
    db.commit()
    return {"status": "success", "message": f"Role '{role.name}' removed."}

@router.get("/modules")
def get_available_modules(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """List service modules available based on the institutional plan."""
    if current_user.role == "super_admin":
        return db.query(Module).all()
    
    if not current_user.tenant or not current_user.tenant.plan:
        return []
    
    return [
        {"id": m.id, "name": m.name, "full_name": m.full_name} 
        for m in current_user.tenant.plan.modules
    ]

@router.get("/permissions")
def get_available_permissions(db: Session = Depends(get_db)):
    """Browse platform-wide permissions for role mapping."""
    permissions = db.query(Permission).all()
    return [{"id": p.id, "name": p.name, "description": p.description} for p in permissions]
