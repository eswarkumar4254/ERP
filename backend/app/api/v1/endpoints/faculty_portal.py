from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.academic import Staff, Section, Student, FacultyMaterial, Attendance, Announcement, InternalMark
from app.schemas.academic import (
    Section as SectionSchema, FacultyMaterial as MaterialSchema, FacultyMaterialCreate,
    AttendanceCreate, Attendance as AttendanceSchema,
    AnnouncementCreate, Announcement as AnnouncementSchema,
    InternalMarkCreate, InternalMark as InternalMarkSchema
)
from app.repositories.base import BaseRepository

router = APIRouter()
section_repo = BaseRepository(Section)
material_repo = BaseRepository(FacultyMaterial)

@router.get("/sections", response_model=List[SectionSchema])
def get_my_sections(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Retrieve sections assigned to the currently authenticated faculty.
    """
    if current_user.role == "super_admin":
        return db.query(Section).all()
        
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    if not staff:
        return [] # Return empty instead of 403 to avoid breaking UI flow
    
    return db.query(Section).filter(Section.faculty_id == staff.id).all()

@router.get("/sections/{section_id}/students")
def get_section_students(
    section_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Access list of students in a specific section assigned to the faculty.
    """
    if current_user.role == "super_admin":
        section = db.query(Section).filter(Section.id == section_id).first()
    else:
        staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
        section = db.query(Section).filter(Section.id == section_id, Section.faculty_id == staff.id).first()
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found or access denied.")
    
    return section.students

@router.post("/materials", response_model=MaterialSchema)
def upload_material(
    title: str,
    section_id: int,
    material_type: str,
    description: Optional[str] = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Upload PDFs, Exams, and other digital materials for a specific section.
    """
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    section = db.query(Section).filter(Section.id == section_id, Section.faculty_id == staff.id).first()
    
    if not section:
        raise HTTPException(status_code=404, detail="Assigned section not found.")
    
    # In a real app, we'd upload to S3/Cloud. Here we'll simulate a URL.
    file_url = f"/uploads/{file.filename}"
    
    material = FacultyMaterial(
        title=title,
        description=description,
        file_url=file_url,
        material_type=material_type,
        section_id=section_id,
        faculty_id=staff.id,
        tenant_id=current_user.tenant_id
    )
    db.add(material)
    db.commit()
    db.refresh(material)
    return material

@router.get("/materials", response_model=List[MaterialSchema])
def get_materials(
    section_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Retrieve clinical and educational materials for the faculty's sections.
    """
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    query = db.query(FacultyMaterial).filter(FacultyMaterial.faculty_id == staff.id)
    if section_id:
        query = query.filter(FacultyMaterial.section_id == section_id)
    return query.all()

@router.post("/attendance", response_model=List[AttendanceSchema])
def mark_attendance(
    attendance_list: List[AttendanceCreate],
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Record attendance for a list of students.
    """
    created_records = []
    for att in attendance_list:
        record = Attendance(
            student_id=att.student_id,
            course_id=att.course_id,
            period_number=att.period_number,
            status=att.status,
            remark=att.remark,
            tenant_id=current_user.tenant_id
        )
        db.add(record)
        created_records.append(record)
    
    db.commit()
    for r in created_records: db.refresh(r)
    return created_records

@router.post("/announcements", response_model=AnnouncementSchema)
def create_announcement(
    announcement: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Post a new announcement to a section.
    """
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    new_ann = Announcement(
        title=announcement.title,
        content=announcement.content,
        section_id=announcement.section_id,
        faculty_id=staff.id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_ann)
    db.commit()
    db.refresh(new_ann)
    return new_ann

@router.post("/marks", response_model=List[InternalMarkSchema])
def record_marks(
    marks_list: List[InternalMarkCreate],
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Bulk record internal assessment marks.
    """
    created_marks = []
    for m in marks_list:
        mark = InternalMark(
            student_id=m.student_id,
            section_id=m.section_id,
            assessment_name=m.assessment_name,
            marks_obtained=m.marks_obtained,
            total_marks=m.total_marks,
            tenant_id=current_user.tenant_id
        )
        db.add(mark)
        created_marks.append(mark)
    
    db.commit()
    for m in created_marks: db.refresh(m)
    return created_marks
