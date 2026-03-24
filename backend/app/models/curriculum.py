from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Program(Base):
    __tablename__ = "programs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g. B.Tech, MBA, Ph.D
    code = Column(String, index=True) # Per-tenant uniqueness handled by business logic or composite index
    description = Column(Text, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Curriculum(Base):
    __tablename__ = "curriculums"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. B.Tech Computer Science
    code = Column(String)
    total_credits_required = Column(Integer)
    structure = Column(JSON) # Tree structure of years/semesters/courses
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    status = Column(String) # active, dropped, completed
    grade = Column(String, nullable=True)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    
    student = relationship("Student", back_populates="enrollments")
