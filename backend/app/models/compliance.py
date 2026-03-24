from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class NoDueRequest(Base):
    __tablename__ = "nodue_requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(String, default="pending") 
    request_date = Column(DateTime, server_default=func.now())
    completion_date = Column(DateTime, nullable=True)
    purpose = Column(String) 
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    clearances = relationship("NoDueClearance", back_populates="request")

class NoDueClearance(Base):
    __tablename__ = "nodue_clearances"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("nodue_requests.id"))
    department = Column(String) 
    status = Column(String, default="pending") 
    cleared_by_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    clearance_date = Column(DateTime, nullable=True)
    remarks = Column(Text, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    request = relationship("NoDueRequest", back_populates="clearances")
