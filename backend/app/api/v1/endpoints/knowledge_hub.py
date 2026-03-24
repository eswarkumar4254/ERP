from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.curriculum import Program, Department, Curriculum
from app.services.pdf_parser import extract_academic_structure
from pydantic import BaseModel

router = APIRouter()

class ProgramCreate(BaseModel):
    name: str # e.g. B.Tech, M.A.
    code: str
    description: Optional[str] = None

class DepartmentCreate(BaseModel):
    name: str
    code: str
    program_id: int

class CurriculumCreate(BaseModel):
    name: str
    code: str
    total_credits_required: int
    structure: dict
    program_id: int

@router.post("/programs")
def create_program(
    prog_in: ProgramCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.allow_institution_admin)
):
    """Institutional Admin: Register a new academic program (Course)."""
    new_prog = Program(
        name=prog_in.name,
        code=prog_in.code,
        description=prog_in.description,
        tenant_id=current_user.tenant_id
    )
    db.add(new_prog)
    db.commit()
    db.refresh(new_prog)
    return new_prog

@router.get("/programs")
def get_programs(
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    """List all academic programs offered by the institution."""
    return db.query(Program).filter(Program.tenant_id == current_user.tenant_id).all()

@router.post("/departments")
def create_department(
    dept_in: DepartmentCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.allow_institution_admin)
):
    """Institutional Admin: Add a department under a specific program."""
    new_dept = Department(
        name=dept_in.name,
        code=dept_in.code,
        program_id=dept_in.program_id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

@router.delete("/programs/{program_id}")
def delete_program(
    program_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user)
):
    """Delete a program and its cascaded data."""
    prog = db.query(Program).filter(Program.id == program_id, Program.tenant_id == current_user.tenant_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    
    from app.models.academic import Course
    # Cascading delete of departments and courses (subjects)
    depts = db.query(Department).filter(Department.program_id == program_id).all()
    for d in depts:
        db.query(Course).filter(Course.department_id == d.id).delete()
        db.delete(d)
        
    db.delete(prog)
    db.commit()
    return {"message": "Program deleted successfully"}

@router.get("/departments/{program_id}")
def get_departments(
    program_id: int,
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    """List all departments under a specific academic program."""
    from app.models.academic import Course
    depts = db.query(Department).filter(
        Department.program_id == program_id,
        Department.tenant_id == current_user.tenant_id
    ).all()
    
    result = []
    for d in depts:
        subjects = db.query(Course).filter(Course.department_id == d.id).all()
        result.append({
            "id": d.id,
            "name": d.name,
            "code": d.code,
            "program_id": d.program_id,
            "subjects": [
                {
                    "id": s.id, 
                    "name": s.name, 
                    "code": s.code, 
                    "credits": s.credits,
                    "semester": s.semester,
                    "year": s.year
                } 
                for s in subjects
            ]
        })
    return result

@router.post("/curriculum")
def create_curriculum(
    curr_in: CurriculumCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    """Institutional Admin: Define the syllabus/curriculum for a program."""
    new_curr = Curriculum(
        name=curr_in.name,
        code=curr_in.code,
        total_credits_required=curr_in.total_credits_required,
        structure=curr_in.structure,
        program_id=curr_in.program_id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_curr)
    db.commit()
    db.refresh(new_curr)
    return new_curr

@router.get("/curriculum/{program_id}")
def get_curriculum(
    program_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get syllabus structure for a program."""
    return db.query(Curriculum).filter(
        Curriculum.program_id == program_id,
        Curriculum.tenant_id == current_user.tenant_id
    ).all()

@router.post("/bulk-upload")
async def bulk_upload_structure(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    """
    Experimental: Automaticaly create programs/departments from an uploaded PDF.
    The system parses the document for hierarchy markers like 'Program: ...' and 'Department: ...'
    """
    content = await file.read()
    try:
        extracted = extract_academic_structure(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF parsing error: {e}")

    if not extracted:
        raise HTTPException(status_code=400, detail="No academic structure (Program/Dept) detected in the provided PDF.")

    for prog_data in extracted:
        # Check if program exists
        prog = db.query(Program).filter(
            Program.code == prog_data["code"],
            Program.tenant_id == current_user.tenant_id
        ).first()
        
        if not prog:
            prog = Program(
                name=prog_data["name"],
                code=prog_data["code"],
                tenant_id=current_user.tenant_id
            )
            db.add(prog)
            db.flush()
        
        from app.models.academic import Course
        for dept_data in prog_data["departments"]:
            # Check if dept exists under this program
            dept = db.query(Department).filter(
                Department.code == dept_data["code"],
                Department.program_id == prog.id,
                Department.tenant_id == current_user.tenant_id
            ).first()
            
            if not dept:
                dept = Department(
                    name=dept_data["name"],
                    code=dept_data["code"],
                    program_id=prog.id,
                    tenant_id=current_user.tenant_id
                )
                db.add(dept)
                db.flush()

            # New: Extract and Save Subjects
            for sub_data in dept_data.get("subjects", []):
                # Check if course exists in this dept
                course = db.query(Course).filter(
                    Course.code == sub_data["code"],
                    Course.department_id == dept.id,
                    Course.tenant_id == current_user.tenant_id
                ).first()
                
                if not course:
                    course = Course(
                        name=sub_data["name"],
                        code=sub_data["code"],
                        credits=sub_data["credits"],
                        semester=sub_data.get("semester", 1),
                        year=sub_data.get("year", 1),
                        department_id=dept.id,
                        tenant_id=current_user.tenant_id
                    )
                    db.add(course)

    db.commit()
    return {"message": "Structure successfully synthesized from PDF.", "syn_count": len(extracted)}
