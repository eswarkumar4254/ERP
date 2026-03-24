from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Hostel(Base):
    __tablename__ = "hostels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # Boys, Girls, Co-ed
    capacity = Column(Integer)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    hostel_id = Column(Integer, ForeignKey("hostels.id"))
    room_number = Column(String)
    floor = Column(Integer)
    capacity = Column(Integer)
    occupied = Column(Integer, default=0)
    price_per_month = Column(Float)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class HostelAllocation(Base):
    __tablename__ = "hostel_allocations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, default="active") # active, closed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class HostelComplaint(Base):
    __tablename__ = "hostel_complaints"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    description = Column(String)
    status = Column(String, default="pending") # pending, resolving, resolved
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True)
    capacity = Column(Integer)
    driver_name = Column(String)
    driver_contact = Column(String)
    status = Column(String, default="active") # active, maintenance, retired
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., Route 1 - North
    start_point = Column(String)
    end_point = Column(String)
    stops = Column(String) # JSON or Comma separated for now
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class TransportMapping(Base):
    __tablename__ = "transport_mappings"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    route_id = Column(Integer, ForeignKey("routes.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    status = Column(String, default="active")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
