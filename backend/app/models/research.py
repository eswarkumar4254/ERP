from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    title = Column(String)
    journal_name = Column(String)
    impact_factor = Column(Float, default=0.0)
    indexed_in = Column(String) # Scopus, WOS, UGC
    publication_date = Column(Date)
    citation_count = Column(Integer, default=0)
    doi_url = Column(String, nullable=True)
    status = Column(String, default="published") # submitted, under_review, published
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ResearchGrant(Base):
    __tablename__ = "research_grants"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    title = Column(String)
    agency = Column(String) # DST, DBT, ISRO, Private
    amount_granted = Column(Float)
    amount_spent = Column(Float, default=0.0)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String, default="active") # active, completed, closed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Patent(Base):
    __tablename__ = "patents"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    title = Column(String)
    patent_number = Column(String, unique=True, nullable=True)
    status = Column(String) # filed, published, granted
    filing_date = Column(Date)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ResearchTarget(Base):
    __tablename__ = "research_targets"
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String) # Department, Individual
    entity_id = Column(Integer) # staff_id or dept_id
    target_year = Column(Integer)
    papers_target = Column(Integer)
    grants_target = Column(Float)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
