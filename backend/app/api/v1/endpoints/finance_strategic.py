from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.domain import StudentFinance
from app.models.academic import Student

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

@router.get("/defaulters")
def get_fee_defaulters(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Tier 2 Strategy: Advanced Fee Management.
    Identifies students with outstanding arrears for collection optimization.
    Target: 95%+ collection rate.
    """
    return db.query(StudentFinance).filter(
        StudentFinance.tenant_id == current_user.tenant_id,
        StudentFinance.is_defaulter == True
    ).all()

@router.post("/refresh-status")
def refresh_financial_health(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Analyzes current dues vs deadlines.
    Updates 'is_defaulter' status for institutional follow-ups.
    """
    # Simply sync and flip bits for mock logic
    finances = db.query(StudentFinance).filter(StudentFinance.tenant_id == current_user.tenant_id).all()
    for f in finances:
        if f.total_due > 0 and (not f.payment_plan_active):
            f.is_defaulter = True
        else:
            f.is_defaulter = False
    db.commit()
    return {"status": "Success", "message": f"Analyzed {len(finances)} accounts"}

@router.get("/global-roi")
def get_finance_roi(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    total_due = db.query(func.sum(StudentFinance.total_due)).filter(StudentFinance.tenant_id == current_user.tenant_id).scalar() or 0
    total_paid = db.query(func.sum(StudentFinance.total_paid)).filter(StudentFinance.tenant_id == current_user.tenant_id).scalar() or 0
    
    collection_rate = (total_paid / (total_due + total_paid)) * 100 if (total_due + total_paid) > 0 else 0
    
    return {
        "collection_rate": f"{collection_rate:.1f}%",
        "strategic_target": "95.0%",
        "arrears_recovery_potential": f"₹{total_due:,.2f}"
    }
