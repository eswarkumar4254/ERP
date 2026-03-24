from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base



class Payroll(Base):
    __tablename__ = "payrolls"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    month = Column(Integer)
    year = Column(Integer)
    basic_salary = Column(Float)
    allowances = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_salary = Column(Float)
    status = Column(String, default="draft") # draft, processed, paid
    paid_at = Column(DateTime, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Appraisal(Base):
    __tablename__ = "appraisals"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    period_start = Column(Date)
    period_end = Column(Date)
    score = Column(Float)
    feedback = Column(Text)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
