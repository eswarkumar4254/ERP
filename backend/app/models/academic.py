from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, index=True)
    description = Column(String)
    credits = Column(Integer)
    semester = Column(Integer, default=1) # e.g. 1 to 8
    year = Column(Integer, default=1) # 1, 2, 3, 4
    teacher_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    syllabus = Column(JSON, nullable=True)
    prerequisites = Column(JSON, nullable=True)
    is_elective = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    enrollment_number = Column(String, unique=True, index=True)
    grade_level = Column(String)
    contact_email = Column(String)
    
    # Expanded Student Info for Registry
    branch = Column(String, index=True, nullable=True) # e.g. CSE, EEE, MBA
    admission_year = Column(Integer, index=True, nullable=True) # e.g. 2022
    current_year = Column(Integer, default=1) # 1, 2, 3, 4
    current_semester = Column(Integer, default=1)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    
    # Advanced Lifecycle (Workflow 1)
    lifecycle_status = Column(String, default="Prospect") # Prospect, Applicant, Admitted, Active, Graduate, Alumni
    onboarding_completed = Column(Boolean, default=False)
    graduation_date = Column(DateTime, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    # Relationships
    enrollments = relationship("CourseEnrollment", back_populates="student")
    section = relationship("Section", back_populates="students")

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    employee_id = Column(String, unique=True, index=True)
    department = Column(String)
    designation = Column(String)
    contact_email = Column(String)
    
    branch = Column(String, index=True, nullable=True) # e.g. CSE, EEE, MBA
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    
    # Relationships
    sections = relationship("Section", back_populates="faculty")
    preferences = relationship("CoursePreference", back_populates="staff")
    assignments = relationship("CourseAssignment", back_populates="staff")

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. Section A, Section B
    course_id = Column(Integer, ForeignKey("courses.id"))
    faculty_id = Column(Integer, ForeignKey("staff.id"))
    academic_year = Column(String)
    semester = Column(Integer)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    # Relationships
    students = relationship("Student", back_populates="section")
    faculty = relationship("Staff", back_populates="sections")
    materials = relationship("FacultyMaterial", back_populates="section")
    announcements = relationship("Announcement", back_populates="section")
    internal_marks = relationship("InternalMark", back_populates="section")

class FacultyMaterial(Base):
    __tablename__ = "faculty_materials"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    file_url = Column(String) # For PDF/Exam uploads
    material_type = Column(String) # exam, lecture, reference
    section_id = Column(Integer, ForeignKey("sections.id"))
    faculty_id = Column(Integer, ForeignKey("staff.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    section = relationship("Section", back_populates="materials")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    period_number = Column(Integer, default=1) # Period wise tracking
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # present, absent, late
    remark = Column(String, nullable=True) # e.g. "Condonation Paid"
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    faculty_id = Column(Integer, ForeignKey("staff.id"))
    day_of_week = Column(String) # Monday, Tuesday...
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    room_number = Column(String)
    is_guest_faculty = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class InvigilationDuty(Base):
    __tablename__ = "invigilation_duties"
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("staff.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    room_number = Column(String)
    remuneration_amount = Column(Float, default=0.0)
    status = Column(String, default="assigned")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class AnswerScriptDigital(Base):
    __tablename__ = "answer_scripts_digital"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    faculty_id = Column(Integer, ForeignKey("staff.id")) # Collector/Evaluator
    question_wise_marks = Column(JSON) # e.g. {"Q1": 5, "Q2": 8}
    total_marks = Column(Float, default=0.0)
    evaluation_status = Column(String, default="pending") # pending, submitted, scrutinizing, completed
    scrutinizer_remarks = Column(String, nullable=True)
    is_locked = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ElectiveChoice(Base):
    __tablename__ = "elective_choices"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id")) # The elective/minor opted
    type = Column(String) # open_elective, minor, honors
    semester = Column(Integer)
    status = Column(String, default="requested") # requested, approved, rejected
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class NoDueForm(Base):
    __tablename__ = "no_due_forms"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    department_remarks = Column(JSON) # e.g. {"Library": "Clear", "Finance": "Pending"}
    final_status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class RevaluationRequest(Base):
    __tablename__ = "revaluation_requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    subject_id = Column(Integer, ForeignKey("courses.id"))
    payment_status = Column(String, default="unpaid")
    payment_receipt_id = Column(String, nullable=True)
    status = Column(String, default="initiated")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Parent(Base):
    __tablename__ = "parents"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    contact_email = Column(String)
    relationship = Column(String) # Father, Mother, Guardian
    user_id = Column(Integer, ForeignKey("users.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ParentStudent(Base):
    __tablename__ = "parent_student"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parents.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class SemesterRegistration(Base):
    __tablename__ = "semester_registrations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    semester_number = Column(Integer)
    academic_year = Column(String)
    is_active = Column(Boolean, default=True)
    registration_date = Column(DateTime, server_default=func.now())
    status = Column(String, default="completed") # pending, completed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    leave_type = Column(String) # CL, CC, SL, EL
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="pending") # pending, approved, rejected
    substitution_faculty_id = Column(Integer, ForeignKey("staff.id"), nullable=True) # Recommended substitution
    hod_remarks = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ODRequest(Base):
    __tablename__ = "od_requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    event_name = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String, default="pending") # pending, verified_by_hod, approved_by_dean
    proof_url = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ProjectBatch(Base):
    __tablename__ = "project_batches"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    guide_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    academic_year = Column(String)
    student_ids = Column(JSON) # List of student IDs
    status = Column(String, default="draft") # draft, submitted, approved
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    section_id = Column(Integer, ForeignKey("sections.id"))
    faculty_id = Column(Integer, ForeignKey("staff.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    section = relationship("Section", back_populates="announcements")

class InternalMark(Base):
    __tablename__ = "internal_marks"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    section_id = Column(Integer, ForeignKey("sections.id"))
    assessment_name = Column(String) # Unit Test 1, Assignment, etc.
    marks_obtained = Column(Float)
    total_marks = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    section = relationship("Section", back_populates="internal_marks")
    student = relationship("Student")

class CoursePreference(Base):
    __tablename__ = "course_preferences"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    priority = Column(Integer) # 1 for highest, 2, 3...
    semester = Column(Integer)
    academic_year = Column(String)
    status = Column(String, default="pending") # pending, approved, rejected
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    staff = relationship("Staff", back_populates="preferences")
    course = relationship("Course")

class CourseAssignment(Base):
    __tablename__ = "course_assignments"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    semester = Column(Integer)
    academic_year = Column(String)
    assigned_by_id = Column(Integer, ForeignKey("users.id")) # Usually HOD or Dean
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    staff = relationship("Staff", back_populates="assignments")
    course = relationship("Course")
