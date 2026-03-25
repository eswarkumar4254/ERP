from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class StudyPlan(Base):
    __tablename__ = "study_plans"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    tasks = Column(JSON) # List of tasks with status, deadline, etc.
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Grievance(Base):
    __tablename__ = "grievances"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    category = Column(String) # academic, facility, technical, etc.
    subject = Column(String)
    description = Column(Text)
    status = Column(String, default="open") # open, in-progress, resolved, closed
    priority = Column(String, default="medium") # low, medium, high
    resolution_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class CourseModule(Base):
    __tablename__ = "course_modules"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    name = Column(String)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class StudentModuleCompletion(Base):
    __tablename__ = "student_module_completions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    module_id = Column(Integer, ForeignKey("course_modules.id"))
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class GlobalAnnouncement(Base):
    __tablename__ = "global_announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    target_role = Column(String, default="all") # all, student, faculty, staff
    sender_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class BiometricLog(Base):
    __tablename__ = "biometric_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, server_default=func.now())
    device_id = Column(String)
    log_type = Column(String) # in, out
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
