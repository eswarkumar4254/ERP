from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.communication import DocumentVault
from typing import List

router = APIRouter()

@router.post("/upload")
async def upload_document(
    title: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.requires_permission("upload_document"))
):
    """Document Vault: Secure Storage with OCR support foundation."""
    # Simulation: In production, upload to S3 and run OCR
    doc = DocumentVault(
        title=title,
        file_path=f"s3://erp-documents/{current_user.tenant_id}/{file.filename}",
        file_type=file.content_type,
        owner_id=current_user.id,
        tenant_id=current_user.tenant_id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/documents")
def list_documents(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    return db.query(DocumentVault).filter(DocumentVault.tenant_id == current_user.tenant_id).all()
