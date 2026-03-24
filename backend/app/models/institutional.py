from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class InstitutionalTask(Base):
    __tablename__ = "institutional_tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    department_id = Column(Integer, ForeignKey("departments.id"))
    assigned_to_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    due_date = Column(DateTime)
    category = Column(String) # Audit, Inspection, Academic, Admin
    status = Column(String, default="pending") # pending, in_progress, completed, overdue
    completion_date = Column(DateTime, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class QualityReport(Base):
    __tablename__ = "quality_reports"
    id = Column(Integer, primary_key=True, index=True)
    framework = Column(String) # NAAC, NBA, AICTE
    metric_name = Column(String)
    value = Column(JSON) # e.g. {"current": 0.84, "target": 1.0}
    year = Column(Integer)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
