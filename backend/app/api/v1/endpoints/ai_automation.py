from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Dict
from app.services.ai_service import ai_service
from app.api import deps

router = APIRouter()

@router.get("/dropout-risk/{student_id}")
def get_dropout_risk(student_id: int, current_user = Depends(deps.get_current_user)):
    # Simulated data fetch
    mock_data = {"attendance_rate": 0.78, "last_exam_score": 0.65, "participation_index": 0.4}
    return ai_service.predict_dropout_risk(mock_data)

@router.get("/placement-prob/{student_id}")
def get_placement_prob(student_id: int, current_user = Depends(deps.get_current_user)):
    mock_data = {"gpa": 3.4, "skills_matched": 7, "internship_count": 1}
    return ai_service.predict_placement_probability(mock_data)

@router.get("/financial-forecast")
def get_financial_forecast(current_user = Depends(deps.get_current_user)):
    return ai_service.forecast_revenue(current_revenue=1500000.0, term=3)

@router.get("/syllabus-projection/{course_id}")
def get_syllabus_projection(course_id: int, current_user = Depends(deps.get_current_user)):
    return ai_service.syllabus_completion_projection(current_progress=0.45, weeks_passed=6, total_weeks=16)

@router.get("/compliance-risk")
def get_compliance_risk(current_user = Depends(deps.get_current_user)):
    mock_metrics = {"audit_frequency": 1, "faculty_published_ratio": 0.35}
    return ai_service.predict_compliance_risk(mock_metrics)

@router.get("/resource-optimization/{dept_id}")
def get_resource_optimization(dept_id: int, current_user = Depends(deps.get_current_user)):
    return ai_service.automate_resource_allocation(dept_id)
