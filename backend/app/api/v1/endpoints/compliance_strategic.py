from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.api import deps

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

@router.get("/status")
def get_compliance_health(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Tier 2 Strategy: Compliance & Audit.
    Returns institutional compliance score and pending reviews.
    """
    from sqlalchemy import text
    sql = text("""
        SELECT audit_name, status, compliance_score, last_audit_date 
        FROM compliance_audits 
        WHERE tenant_id = :tid
    """)
    records = db.execute(sql, {"tid": current_user.tenant_id}).fetchall()
    
    avg_score = sum([r[2] for r in records]) / len(records) if records else 100.0
    
    return {
        "overall_health": f"{avg_score:.1f}%",
        "pending_reviews": len([r for r in records if r[1] == 'review_pending']),
        "detailed_audits": records
    }

@router.post("/trigger-audit")
def init_self_audit(audit_name: str, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Initializes a new compliance audit cycle.
    """
    from sqlalchemy import text
    sql = text("""
        INSERT INTO compliance_audits (audit_name, status, compliance_score, tenant_id)
        VALUES (:name, 'review_pending', 0.0, :tid)
    """)
    db.execute(sql, {"name": audit_name, "tid": current_user.tenant_id})
    db.commit()
    return {"status": "Audit Cycle Initialized"}
