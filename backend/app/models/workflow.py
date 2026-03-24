from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    schema = Column(JSON) # Stores step definitions
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class WorkflowInstance(Base):
    __tablename__ = "workflow_instances"
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    status = Column(String, default="pending") # pending, approved, rejected
    current_step = Column(Integer, default=1)
    data = Column(JSON) # Current state of the workflow
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
