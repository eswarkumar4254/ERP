from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.schemas.research import (
    Publication as PublicationSchema, PublicationCreate,
    ResearchGrant as ResearchGrantSchema, ResearchGrantCreate,
    Patent as PatentSchema, PatentCreate,
    ResearchTarget as ResearchTargetSchema, ResearchTargetCreate
)
from app.models.research import Publication, ResearchGrant, Patent, ResearchTarget
from app.repositories.base import BaseRepository

router = APIRouter()

pub_repo = BaseRepository(Publication)
grant_repo = BaseRepository(ResearchGrant)
patent_repo = BaseRepository(Patent)
target_repo = BaseRepository(ResearchTarget)

@router.get("/publications", response_model=List[PublicationSchema])
def read_publications(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return pub_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/publications", response_model=PublicationSchema)
def create_publication(
    *,
    db: Session = Depends(get_db),
    obj_in: PublicationCreate,
    current_user = Depends(deps.get_current_user)
):
    if current_user.role not in ["super_admin", "institution_admin", "faculty", "dean"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return pub_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)

@router.get("/grants", response_model=List[ResearchGrantSchema])
def read_grants(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return grant_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/grants", response_model=ResearchGrantSchema)
def create_grant(
    *,
    db: Session = Depends(get_db),
    obj_in: ResearchGrantCreate,
    current_user = Depends(deps.get_current_user)
):
    if current_user.role not in ["super_admin", "institution_admin", "dean"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return grant_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)

@router.get("/patents", response_model=List[PatentSchema])
def read_patents(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    return patent_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.post("/patents", response_model=PatentSchema)
def create_patent(
    *,
    db: Session = Depends(get_db),
    obj_in: PatentCreate,
    current_user = Depends(deps.get_current_user)
):
    if current_user.role not in ["super_admin", "institution_admin", "faculty", "dean"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return patent_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)

@router.get("/my-stats")
def get_faculty_research_stats(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Fetch research statistics for the logged-in faculty member."""
    # BaseRepository.get_scoped_query in the repo layer handles identity isolation by staff_id
    pubs = pub_repo.get_multi(db, user=current_user)
    grants = grant_repo.get_multi(db, user=current_user)
    patents = patent_repo.get_multi(db, user=current_user)
    
    return {
        "publications": len(pubs),
        "grants": len(grants),
        "patents": len(patents),
        "total_citations": sum([p.citation_count for p in pubs]) if pubs else 0
    }
