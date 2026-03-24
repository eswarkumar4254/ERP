from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PlacementDrive(Base):
    __tablename__ = "placement_drives"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String)
    job_description = Column(Text)
    visit_date = Column(Date)
    package_lpa = Column(Float)
    eligibility_criteria = Column(JSON) # e.g. {"min_cgpa": 7.5}
    status = Column(String, default="upcoming") # upcoming, active, completed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class StudentPlacement(Base):
    __tablename__ = "student_placements"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    drive_id = Column(Integer, ForeignKey("placement_drives.id"))
    status = Column(String) # applied, shortlisted, placed, rejected
    payout_if_placed = Column(Float, nullable=True)
    offer_letter_url = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Internship(Base):
    __tablename__ = "internships"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    company = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    certificate_url = Column(String, nullable=True)
    is_ppo = Column(Boolean, default=False) # Pre-placement offer
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
