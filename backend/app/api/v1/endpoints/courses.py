from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.schemas.academic import Course as CourseSchema, CourseCreate
from app.models.academic import Course
from app.repositories.base import BaseRepository

router = APIRouter()
course_repo = BaseRepository(Course)

@router.get("/", response_model=List[CourseSchema])
def read_courses(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_user)
):
    """
    Retrieve courses with role-based filtering:
    - Faculty: Only courses they teach.
    - Others: Courses in their university.
    """
    return course_repo.get_multi(db, skip=skip, limit=limit, user=current_user)

@router.get("/{course_id}", response_model=CourseSchema)
def read_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    course = course_repo.get(db, id=course_id, user=current_user)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or access denied")
    return course
