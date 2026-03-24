from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Time, JSON, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    INSTITUTION_ADMIN = "institution_admin"
    DEAN = "dean"
    FACULTY = "faculty"
    STAFF = "staff"
    STUDENT = "student"
    PARENT = "parent"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    TRIALING = "trialing"

# Association table for Plans and Modules
plan_modules = Table(
    "plan_modules",
    Base.metadata,
    Column("plan_id", Integer, ForeignKey("plans.id")),
    Column("module_id", Integer, ForeignKey("modules.id")),
    extend_existing=True
)

class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # Starter, Professional, Enterprise
    max_students = Column(Integer)
    max_staff = Column(Integer, default=50) 
    max_roles = Column(Integer, default=5) 
    price = Column(Float)
    features = Column(JSON) # To store list of enabled features
    
    # Relationship to modules included in this plan
    modules = relationship("Module", secondary=plan_modules)

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    domain = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # SaaS & White-labeling
    subscription_plan_id = Column(Integer, ForeignKey("plans.id"))
    logo_url = Column(String, nullable=True)
    primary_color = Column(String, default="#6366f1")
    secondary_color = Column(String, default="#10b981")
    custom_domain = Column(String, unique=True, nullable=True)
    
    # Compliance & Business Details (Added per user request)
    pan_number = Column(String, nullable=True) # Permanent Account Number
    registration_id = Column(String, nullable=True) # Govt. Registration/University ID
    contact_email = Column(String, nullable=True) # Contact address for official communication
    
    plan = relationship("Plan")
    users = relationship("User", back_populates="tenant")
    saas_invoices = relationship("SaasInvoice", back_populates="tenant")

class SaasInvoice(Base):
    __tablename__ = "saas_invoices"
    id = Column(String, primary_key=True, index=True) # e.g., INV-2024-0312
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    plan_name = Column(String)
    amount = Column(Float)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    status = Column(String) # PAID, PENDING, OVERDUE
    
    tenant = relationship("Tenant", back_populates="saas_invoices")

class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    name = Column(String) # e.g. "Zoom Integration"
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
