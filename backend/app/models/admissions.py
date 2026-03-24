from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class AdmissionApplication(Base):
    __tablename__ = "admission_applications"
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String)
    previous_qualification = Column(String)
    educational_details = Column(JSON, nullable=True) # { "boards": "CBSE", "percentage": 92.5, "documents_verified": true }
    demographics = Column(JSON, nullable=True) # { "dob": "2005-01-01", "gender": "M", "address": "...", "category": "General" }
    entrance_exam_score = Column(Float, nullable=True)
    status = Column(String, default="pending") # pending, counseling, allotted, registered, rejected
    scholarship_amount = Column(Float, default=0.0)
    counseling_date = Column(DateTime, nullable=True)
    allotted_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    challan_generated = Column(Boolean, default=False)
    uv_registration_number = Column(String, unique=True, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    created_at = Column(DateTime, server_default=func.now())
