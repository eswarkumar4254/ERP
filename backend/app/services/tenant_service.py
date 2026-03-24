from sqlalchemy.orm import Session
from app.models.tenant import Tenant, Plan
from app.schemas.base import TenantCreate

def create_tenant_with_plan(db: Session, tenant_in: TenantCreate, plan_name: str = "Starter"):
    plan = db.query(Plan).filter(Plan.name == plan_name).first()
    if not plan:
        # Create default plan if it doesn't exist
        plan = Plan(name="Starter", max_students=1000, price=0.0)
        db.add(plan)
        db.commit()
        db.refresh(plan)
    
    db_tenant = Tenant(
        name=tenant_in.name,
        domain=tenant_in.domain,
        subscription_plan_id=plan.id
    )
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant
