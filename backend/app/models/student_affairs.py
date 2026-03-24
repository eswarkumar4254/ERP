from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CounselingRecord(Base):
    __tablename__ = "counseling_records"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    counselor_id = Column(Integer, ForeignKey("staff.id"))
    session_date = Column(DateTime, server_default=func.now())
    type = Column(String) # Psychological, Academic, Disciplinary
    notes = Column(Text)
    action_taken = Column(String, nullable=True)
    confidential = Column(Boolean, default=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class StudentHealth(Base):
    __tablename__ = "student_health"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    blood_group = Column(String)
    allergies = Column(JSON, nullable=True)
    medical_history = Column(JSON, nullable=True)
    emergency_contact = Column(String)
    last_checkup = Column(Date, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ExtraCurricularParticipation(Base):
    __tablename__ = "extracurricular_participation"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    event_name = Column(String)
    category = Column(String) # Sports, Cultural, Technical
    participation_date = Column(Date)
    achievement = Column(String) # Participant, Winner, Runner-up
    credits_awarded = Column(Float, default=0.0)
    certificate_url = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class AlumniDirectory(Base):
    __tablename__ = "alumni_directory"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    graduation_year = Column(Integer)
    company = Column(String)
    designation = Column(String)
    linkedin_url = Column(String, nullable=True)
    is_mentor = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
