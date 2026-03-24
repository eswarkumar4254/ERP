from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class PublicationBase(BaseModel):
    title: str
    journal_name: str
    impact_factor: Optional[float] = 0.0
    indexed_in: str
    publication_date: date
    citation_count: Optional[int] = 0
    doi_url: Optional[str] = None
    status: Optional[str] = "published"

class PublicationCreate(PublicationBase):
    staff_id: int
    tenant_id: int

class Publication(PublicationBase):
    id: int
    staff_id: int
    tenant_id: int
    class Config:
        from_attributes = True

class ResearchGrantBase(BaseModel):
    title: str
    agency: str
    amount_granted: float
    amount_spent: Optional[float] = 0.0
    start_date: date
    end_date: date
    status: Optional[str] = "active"

class ResearchGrantCreate(ResearchGrantBase):
    staff_id: int
    tenant_id: int

class ResearchGrant(ResearchGrantBase):
    id: int
    staff_id: int
    tenant_id: int
    class Config:
        from_attributes = True

class PatentBase(BaseModel):
    title: str
    patent_number: Optional[str] = None
    status: str
    filing_date: date

class PatentCreate(PatentBase):
    staff_id: int
    tenant_id: int

class Patent(PatentBase):
    id: int
    staff_id: int
    tenant_id: int
    class Config:
        from_attributes = True

class ResearchTargetBase(BaseModel):
    entity_type: str
    entity_id: int
    target_year: int
    papers_target: int
    grants_target: float

class ResearchTargetCreate(ResearchTargetBase):
    tenant_id: int

class ResearchTarget(ResearchTargetBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True
