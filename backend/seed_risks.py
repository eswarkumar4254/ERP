from app.core.database import SessionLocal
from app.models.domain import StudentRiskAssessment
from app.models.academic import Student
import random

db = SessionLocal()
try:
    students = db.query(Student).all()
    for s in students:
        risk_score = random.uniform(0.1, 0.9)
        status = "safe"
        if risk_score > 0.7: status = "critical"
        elif risk_score > 0.4: status = "warning"
        
        assessment = StudentRiskAssessment(
            student_id=s.id,
            risk_score=risk_score,
            status=status,
            primary_reasons=["low_attendance" if risk_score > 0.5 else "grade_drop"],
            tenant_id=s.tenant_id
        )
        db.add(assessment)
    db.commit()
    print("✅ Seeded Risk Assessments")
finally:
    db.close()
