from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from app.core.database import get_db
from app.api import deps
from app.models.domain import ExamAttempt, Exam

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

class ProctorLogCreate(BaseModel):
    attempt_id: int
    event_type: str
    evidence_metadata: dict | None = None
    severity: str = "low"

@router.post("/log-incident")
def log_proctor_incident(payload: ProctorLogCreate, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Tier 2 Strategy: Exam Proctoring & Integrity.
    Captures integrity-related events during digital evaluations.
    """
    # Simply log to standard SQL for now
    from sqlalchemy import text
    sql = text("""
        INSERT INTO exam_proctor_logs (attempt_id, event_type, evidence_metadata, severity, tenant_id)
        VALUES (:aid, :etype, :meta, :sev, :tid)
    """)
    db.execute(sql, {
        "aid": payload.attempt_id,
        "etype": payload.event_type,
        "meta": str(payload.evidence_metadata),
        "sev": payload.severity,
        "tid": current_user.tenant_id
    })
    db.commit()
    return {"status": "Logged"}

@router.get("/flagged")
def get_high_risk_attempts(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Returns attempts with severe proctoring flags.
    """
    from sqlalchemy import text
    sql = text("""
        SELECT e.title, (s.first_name || ' ' || s.last_name) AS full_name, log.event_type, log.severity, log.event_time
        FROM exam_proctor_logs log
        JOIN exam_attempts a ON log.attempt_id = a.id
        JOIN exams e ON a.exam_id = e.id
        JOIN students s ON a.student_id = s.id
        WHERE log.tenant_id = :tid AND log.severity = 'high'
        ORDER BY log.event_time DESC
    """)
    return db.execute(sql, {"tid": current_user.tenant_id}).fetchall()
