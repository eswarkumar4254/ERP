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

@router.get("/public")
def list_public_resources():
    """
    Returns public academic resources for students.
    In a real app, this would filter by visibility in a 'is_public' column.
    """
    return [
        {
            "id": 1,
            "title": "Quantum Mechanics Handbook v2",
            "file_type": "PDF",
            "tags": ["Physics", "Core-Science", "2024"],
            "uploader": "Dr. David Richards",
            "created_at": "2024-10-15T10:00:00"
        },
        {
            "id": 2,
            "title": "Data Structures & Algorithms Cheat Sheet",
            "file_type": "DOCX",
            "tags": ["Computer Science", "CSE-402"],
            "uploader": "Admin Cell",
            "created_at": "2024-10-18T14:30:00"
        },
        {
            "id": 3,
            "title": "Organic Chemistry Lab Guidelines",
            "file_type": "PDF",
            "tags": ["BTECH", "Sem-1", "Lab"],
            "uploader": "Faculty Hub",
            "created_at": "2024-10-20T09:15:00"
        }
    ]
