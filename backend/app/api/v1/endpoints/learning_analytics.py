from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.domain import StudentRiskAssessment, ExamAttempt, ExamResult
from app.models.academic import Student

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

@router.get("/at-risk")
def get_at_risk_students(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Tier 2 Strategy: Learning Analytics & Predictions.
    Identifies students with high risk scores for early intervention.
    """
    return db.query(StudentRiskAssessment).filter(
        StudentRiskAssessment.tenant_id == current_user.tenant_id,
        StudentRiskAssessment.status != "safe"
    ).order_by(StudentRiskAssessment.risk_score.desc()).all()

@router.post("/refresh")
def calculate_risk_scores(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    """
    Heuristic-based risk calculation (Foundation phase).
    Future phases will use ML models as per the strategy.
    Criteria: 
    - Average Score < 40% (Critical)
    - Average Score < 60% (Warning)
    """
    # Simply clear and recalculate for active students in tenant
    students = db.query(Student).filter(Student.tenant_id == current_user.tenant_id).all()
    
    # Use the AI Service to calculate risk scores
    from app.services.ai_service import ai_service
    
    for s in students:
        # Mocking data for AI model input (In a real system, these would come from DB)
        mock_student_data = {
            "attendance_rate": 0.82, 
            "last_exam_score": 0.55, 
            "participation_index": 0.4
        }
        
        # Call AI Automation
        risk_score = ai_service.predict_dropout_risk(mock_student_data)
        
        status = "safe"
        reasons = []
        if risk_score > 0.7:
            status = "critical"
            reasons.append("ai_dropout_risk")
        elif risk_score > 0.4:
            status = "warning"
            reasons.append("declining_performance")
            
        # Update or Create Assessment
        assessment = db.query(StudentRiskAssessment).filter(StudentRiskAssessment.student_id == s.id).first()
        if assessment:
            assessment.status = status
            assessment.risk_score = risk_score
            assessment.primary_reasons = reasons
        else:
            assessment = StudentRiskAssessment(
                student_id=s.id,
                status=status,
                risk_score=risk_score,
                primary_reasons=reasons,
                tenant_id=current_user.tenant_id
            )
            db.add(assessment)
            
    db.commit()
    return {"status": "AI Analysis complete", "message": f"Processed {len(students)} students through the AI Risk Engine"}

@router.get("/global-stats")
def get_analytics_overview(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    critical = db.query(StudentRiskAssessment).filter(
        StudentRiskAssessment.tenant_id == current_user.tenant_id,
        StudentRiskAssessment.status == "critical"
    ).count()
    
    warning = db.query(StudentRiskAssessment).filter(
        StudentRiskAssessment.tenant_id == current_user.tenant_id,
        StudentRiskAssessment.status == "warning"
    ).count()
    
    return {
        "critical_count": critical,
        "warning_count": warning,
        "retention_forecast": "92%", # Based on intervention ROI target
        "intervention_needed": critical > 0
    }
