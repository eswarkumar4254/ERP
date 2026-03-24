from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CourseBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    credits: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    enrollment_number: str
    grade_level: str
    contact_email: Optional[str] = None
    branch: Optional[str] = None
    admission_year: Optional[int] = None
    current_year: Optional[int] = 1
    current_semester: Optional[int] = 1
    section_id: Optional[int] = None

class StudentCreate(StudentBase):
    pass

class StudentEnroll(StudentCreate):
    password: Optional[str] = "Student@123"

class Student(StudentBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

class FacultyMaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_url: str
    material_type: str # exam, lecture, reference
    section_id: int

class FacultyMaterialCreate(FacultyMaterialBase):
    pass

class FacultyMaterial(FacultyMaterialBase):
    id: int
    faculty_id: int
    created_at: datetime
    tenant_id: int
    class Config:
        from_attributes = True

class SectionBase(BaseModel):
    name: str
    course_id: int
    faculty_id: int
    academic_year: str
    semester: int

class SectionCreate(SectionBase):
    pass

class Section(SectionBase):
    id: int
    tenant_id: int
    students: List[Student] = []
    materials: List[FacultyMaterial] = []
    announcements: List["Announcement"] = []
    internal_marks: List["InternalMark"] = []
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    student_id: int
    course_id: int
    period_number: int = 1
    status: str
    remark: Optional[str] = None
    date: datetime

class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    period_number: int = 1
    status: str
    remark: Optional[str] = None

class Attendance(AttendanceBase):
    id: int
    tenant_id: int
    class Config:
        from_attributes = True

class AnnouncementBase(BaseModel):
    title: str
    content: str
    section_id: int

class AnnouncementCreate(AnnouncementBase):
    pass

class Announcement(AnnouncementBase):
    id: int
    faculty_id: int
    created_at: datetime
    tenant_id: int
    class Config:
        from_attributes = True

class InternalMarkBase(BaseModel):
    student_id: int
    section_id: int
    assessment_name: str
    marks_obtained: float
    total_marks: float

class InternalMarkCreate(InternalMarkBase):
    pass

class InternalMark(InternalMarkBase):
    id: int
    created_at: datetime
    tenant_id: int
    class Config:
        from_attributes = True
