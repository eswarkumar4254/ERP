from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    status = Column(String, default="pending") # pending, paid, overdue
    due_date = Column(DateTime(timezone=True))
    student_id = Column(Integer, ForeignKey("students.id"))
    challan_number = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Scholarship(Base):
    __tablename__ = "scholarships"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    scheme_name = Column(String) # VSAT Merit, Sports, EWS
    amount_awarded = Column(Float)
    status = Column(String, default="active")
    academic_year = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class TransactionChallan(Base):
    __tablename__ = "transaction_challans"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    challan_ref = Column(String, unique=True)
    payment_mode = Column(String) # Online, Bank, Offline
    amount_paid = Column(Float)
    payment_date = Column(DateTime, server_default=func.now())
    receipt_url = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class FeeStructure(Base):
    __tablename__ = "fee_structures"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    amount = Column(Float)
    frequency = Column(String)
    category = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    amount = Column(Float)
    category = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
