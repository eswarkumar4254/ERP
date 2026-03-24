from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import Tenant, TenantCreate
from app.services import tenant_service
from app.api import deps

router = APIRouter()

@router.post("/", response_model=Tenant)
def create_tenant(
    tenant_in: TenantCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_admin) # Only admins can create tenants
):
    return tenant_service.create_tenant_with_plan(db, tenant_in)

@router.get("/", response_model=list[Tenant])
def read_tenants(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_super_admin)
):
    from app.models.tenant import Tenant as TenantModel
    return db.query(TenantModel).all()

@router.get("/me", response_model=Tenant)
def get_current_tenant(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_authenticated)
):
    from app.models.tenant import Tenant as TenantModel
    tenant = db.query(TenantModel).filter(TenantModel.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Institutional record not found.")
    return tenant

from app.schemas.base import Tenant, TenantCreate, TenantUpdate

@router.patch("/me", response_model=Tenant)
def update_current_tenant(
    tenant_in: TenantUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_admin)
):
    from app.models.tenant import Tenant as TenantModel
    tenant = db.query(TenantModel).filter(TenantModel.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    if tenant_in.name:
        tenant.name = tenant_in.name
    if tenant_in.primary_color:
        tenant.primary_color = tenant_in.primary_color
    if tenant_in.pan_number:
        tenant.pan_number = tenant_in.pan_number
    if tenant_in.registration_id:
        tenant.registration_id = tenant_in.registration_id
    if tenant_in.contact_email:
        tenant.contact_email = tenant_in.contact_email
        
    db.commit()
    db.refresh(tenant)
    return tenant
