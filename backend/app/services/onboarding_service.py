from sqlalchemy.orm import Session
from app.models.tenant import Tenant, Plan
from app.models.rbac import Role, Module
from app.models.user import User
from app.core import security
from fastapi import HTTPException
from typing import List

def provision_new_institution(
    db: Session, 
    name: str, 
    domain: str, 
    admin_email: str, 
    admin_password: str, 
    plan_name: str = "Starter"
):
    """
    Onboarding service to create a sub-service (Tenant account) 
    and provide services based on the selected plan.
    """
    # 1. Check if tenant/domain already exists
    existing_tenant = db.query(Tenant).filter(Tenant.domain == domain).first()
    if existing_tenant:
        raise HTTPException(status_code=400, detail="Domain already registered")

    # 2. Get Subscription Plan
    plan = db.query(Plan).filter(Plan.name == plan_name).first()
    if not plan:
        # Create a basic plan if it doesn't exist
        # In a real SaaS, these would be pre-seeded
        plan = Plan(name="Starter", price=0.0, max_students=100)
        db.add(plan)
        db.commit()
        db.refresh(plan)

    # 3. Create the Tenant (Service Instance)
    new_tenant = Tenant(
        name=name,
        domain=domain,
        subscription_plan_id=plan.id,
        is_active=True
    )
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)

    # 4. Provision the primary Institution Admin account
    # This account will have full access TO THE SERVICES GRANTED BY THE PLAN
    admin_role = db.query(Role).filter(Role.name == "institution_admin").first()
    
    new_admin = User(
        email=admin_email,
        hashed_password=security.get_password_hash(admin_password),
        full_name=f"{name} Administrator",
        role="institution_admin",
        role_id=admin_role.id if admin_role else None,
        tenant_id=new_tenant.id,
        is_active=True
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "status": "success",
        "message": f"Service account created for {name}",
        "tenant_id": new_tenant.id,
        "plan": plan.name,
        "enabled_modules": [m.name for m in plan.modules]
    }

def update_tenant_plan(db: Session, tenant_id: int, new_plan_name: str):
    """Upgrade or downgrade tenant services."""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    plan = db.query(Plan).filter(Plan.name == new_plan_name).first()
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan {new_plan_name} does not exist")
        
    tenant.subscription_plan_id = plan.id
    db.commit()
    return {"message": f"Tenant {tenant.name} updated to {new_plan_name} plan"}
