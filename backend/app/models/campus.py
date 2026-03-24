from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(String)
    type = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Alumni(Base):
    __tablename__ = "alumni"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    graduation_year = Column(Integer)
    current_company = Column(String, nullable=True)
    current_role = Column(String, nullable=True)
    is_mentor = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ResearchProject(Base):
    __tablename__ = "research_projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    type = Column(String)
    status = Column(String, default="ongoing")
    grant_amount = Column(Float, default=0.0)
    published_year = Column(Integer, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
