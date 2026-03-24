from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ComplianceAudit(Base):
    __tablename__ = "compliance_audits"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    status = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    device_type = Column(String)
    status = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class IoTMetric(Base):
    __tablename__ = "iot_metrics"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("iot_devices.id"))
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Building(Base):
    __tablename__ = "buildings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True)
    floors = Column(Integer)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
