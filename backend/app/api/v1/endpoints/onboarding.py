from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import onboarding_service
from pydantic import BaseModel, EmailStr

router = APIRouter()

class InstitutionSignup(BaseModel):
    institution_name: str
    domain: str
    admin_email: EmailStr
    admin_password: str
    plan_name: str = "Starter"

@router.post("/signup")
def signup_institution(
    signup_in: InstitutionSignup,
    db: Session = Depends(get_db)
):
    """
    Public endpoint for new institutions to sign up for the ERP service.
    Provisioning happens based on the selected plan.
    """
    return onboarding_service.provision_new_institution(
        db,
        name=signup_in.institution_name,
        domain=signup_in.domain,
        admin_email=signup_in.admin_email,
        admin_password=signup_in.admin_password,
        plan_name=signup_in.plan_name
    )

@router.get("/plans")
def get_available_plans(db: Session = Depends(get_db)):
    """List all available service plans and their included modules."""
    from app.models.tenant import Plan
    plans = db.query(Plan).all()
    return [
        {
            "name": p.name,
            "price": p.price,
            "max_students": p.max_students,
            "modules": [m.name for m in p.modules]
        }
        for p in plans
    ]
@router.get("/modules")
def get_all_modules(db: Session = Depends(get_db)):
    """List all available ERP modules with descriptions."""
    from app.models.rbac import Module
    modules = db.query(Module).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "full_name": m.full_name,
            "description": m.description
        }
        for m in modules
    ]

@router.get("/active-universities")
def get_active_universities(db: Session = Depends(get_db)):
    """List all active institutions that have an active subscription plan."""
    from app.models.tenant import Tenant
    tenants = db.query(Tenant).filter(Tenant.is_active == True, Tenant.subscription_plan_id != None).all()
    return [
        {"id": t.id, "name": t.name, "domain": t.domain}
        for t in tenants
    ]
