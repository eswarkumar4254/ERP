from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.ai_service import ai_service
from typing import Dict, Any

router = APIRouter()

@router.get("/predict/dropout/{student_id}")
def get_dropout_risk(
    student_id: int,
    current_user = Depends(deps.allow_faculty)
):
    """AI Success Prediction: Dropout Risk."""
    # In a real app, fetch historical data from DB
    mock_data = {"attendance_rate": 0.75, "last_exam_score": 0.6, "participation_index": 0.4}
    risk = ai_service.predict_dropout_risk(mock_data)
    return {"student_id": student_id, "dropout_risk": risk, "status": "Caution" if risk > 0.4 else "Stable"}

@router.get("/predict/placement/{student_id}")
def get_placement_prediction(
    student_id: int,
    current_user = Depends(deps.allow_faculty)
):
    """AI Placement Intelligence: Employability & Salary Band."""
    mock_data = {"gpa": 3.8, "skills_matched": 8, "internship_count": 2}
    prob = ai_service.predict_placement_probability(mock_data)
    return {
        "student_id": student_id,
        "employability_score": prob,
        "expected_salary_band": "12-18 LPA" if prob > 0.8 else "6-10 LPA"
    }

@router.get("/recommendations/{student_id}")
def get_elective_recommendations(
    student_id: int,
    major: str = "Computer Science",
    current_user = Depends(deps.get_current_user)
):
    """Academic Recommendation System."""
    recs = ai_service.recommend_electives(student_id, major)
    return {"student_id": student_id, "recommended_electives": recs}
