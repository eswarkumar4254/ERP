from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api import deps
from app.models.library import Book, BookIssue, DigitalResource, LibrarySeat
from app.models.academic import Student
from app.repositories.base import BaseRepository
from pydantic import BaseModel
from datetime import datetime

class BookSchema(BaseModel):
    id: int
    title: str
    author: str
    isbn: str
    category: str
    available_quantity: int
    class Config:
        from_attributes = True

class BookIssueSchema(BaseModel):
    id: int
    book_id: int
    student_id: int
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str
    class Config:
        from_attributes = True

class BookIssueCreate(BaseModel):
    book_id: int
    due_date: datetime

router = APIRouter(dependencies=[Depends(deps.requires_service("LMS"))])
book_repo = BaseRepository(Book)
issue_repo = BaseRepository(BookIssue)


@router.get("/books", response_model=List[BookSchema])
def get_books(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Knowledge Hub: Browse library catalog."""
    return book_repo.get_multi(db, user=current_user)

@router.post("/books", response_model=BookSchema)
def add_book(
    book_in: BookSchema,
    db: Session = Depends(get_db),
    current_user = Depends(deps.requires_permission("manage_library"))
):
    """Library Manager: Catalog new knowledge assets."""
    new_book = Book(
        **book_in.dict(exclude={"id"}),
        tenant_id=current_user.tenant_id
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.get("/book-issues", response_model=List[BookIssueSchema])
def get_all_issues(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Admin/Staff: View all circulation logs."""
    return issue_repo.get_multi(db, user=current_user)

@router.post("/book-issues", response_model=BookIssueSchema)
def issue_book(
    issue_in: BookIssueCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Library/Student: Initiate a book lending process."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    book = db.query(Book).filter(Book.id == issue_in.book_id).first()
    if not book or book.available_quantity <= 0:
        raise HTTPException(status_code=400, detail="Book unavailable")
        
    book.available_quantity -= 1
    new_issue = BookIssue(
        book_id=book.id,
        student_id=student.id,
        due_date=issue_in.due_date,
        status="active",
        tenant_id=current_user.tenant_id
    )
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@router.get("/my-books")
def get_student_books(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Student: View currently issued books in LMS dashboard."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    issues = db.query(BookIssue).filter(
        BookIssue.student_id == student.id,
        BookIssue.status == "active"
    ).all()
    
    result = []
    for i in issues:
        book = db.query(Book).filter(Book.id == i.book_id).first()
        result.append({
            "id": i.id,
            "title": book.title if book else "Unknown",
            "author": book.author if book else "Unknown",
            "due_date": i.due_date,
            "days_left": (i.due_date - datetime.utcnow()).days
        })
    return result
@router.get("/digital-resources")
def get_digital_resources(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Digital Library: View e-journals, PDFs, and external research papers."""
    return db.query(DigitalResource).filter(DigitalResource.tenant_id == current_user.tenant_id).all()

@router.post("/digital-resources")
def add_digital_resource(
    res_in: dict, # Simplified for demo
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    new_res = DigitalResource(**res_in, tenant_id=current_user.tenant_id)
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res

@router.get("/library/seats")
def get_library_seats(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Interactive Library Matrix: View available study carrels."""
    return db.query(LibrarySeat).filter(LibrarySeat.tenant_id == current_user.tenant_id).all()

@router.post("/library/seats/book/{seat_id}")
def book_library_seat(
    seat_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    seat = db.query(LibrarySeat).filter(LibrarySeat.id == seat_id).first()
    if not seat or seat.status != "Available":
        raise HTTPException(status_code=400, detail="Seat unavailable")
    seat.status = "Occupied"
    seat.booked_by_id = current_user.id
    db.commit()
    return {"status": "success"}

@router.post("/book-issues/return/{issue_id}")
def return_book(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    issue = db.query(BookIssue).filter(BookIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue record not found")
        
    book = db.query(Book).filter(Book.id == issue.book_id).first()
    if book:
        book.available_quantity += 1
        
    issue.status = "returned"
    issue.return_date = datetime.utcnow()
    db.commit()
    return {"status": "success"}

@router.get("/quizzes")
def get_pending_quizzes(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """LMS: View assessments and practice tests."""
    return [
        {"id": 1, "title": "Mid-Term Quiz: Data Structures", "course": "CS101", "due": "2026-03-20", "questions": 20},
        {"id": 2, "title": "Practice Test: Cloud Architecture", "course": "CS302", "due": "No Deadline", "questions": 15}
    ]

@router.get("/course-attendance")
def get_course_attendance(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """LX Hub: Personal attendance tracking per course."""
    return [
        {"course": "CS101", "attended": 42, "total": 45, "percentage": 93},
        {"course": "CS302", "attended": 28, "total": 35, "percentage": 80},
        {"course": "MATH201", "attended": 30, "total": 40, "percentage": 75}
    ]
