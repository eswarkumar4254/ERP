from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import csv
import io
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from app.models.academic import Student, Course
from app.models.curriculum import CourseEnrollment
from typing import List

router = APIRouter()

from app.models.academic import (
    Student, Course, Attendance, TimetableSlot, InvigilationDuty, 
    AnswerScriptDigital, ElectiveChoice, NoDueForm, RevaluationRequest, 
    Staff, SemesterRegistration
)
from app.models.domain import Exam, ExamResult
from app.models.finance import Invoice
from app.schemas.base import StaffCreate, CoursePreferenceCreate, CourseAssignmentCreate
from app.core.security import get_password_hash
from app.models.rbac import Role
from app.models.academic import CoursePreference, CourseAssignment
from app.models.user import User
from app.models.curriculum import Department

@router.get("/departments")
def get_departments(db: Session = Depends(get_db)):
    """Get list of active departments."""
    return db.query(Department).all()

@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    """Get list of all courses."""
    return db.query(Course).all()

@router.get("/timetable", response_model=List[dict])
def get_timetable(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_authenticated)
):
    """View period-wise timetable based on role."""
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        # Find slots for student's department/grade
        return db.query(TimetableSlot).all() # Simplified for demo
    elif current_user.role == "faculty":
        staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
        return db.query(TimetableSlot).filter(TimetableSlot.faculty_id == staff.id).all()
    return db.query(TimetableSlot).all()

@router.get("/attendance/summary")
def get_attendance_summary(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: View overview of attendance across courses and calculated fines."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get all attendance records for this student
    records = db.query(Attendance).filter(Attendance.student_id == student.id).all()
    
    # Group by course (simplified for demo)
    total_slots = 100 # Mock denominator
    attended = len([r for r in records if r.status == "present"])
    attendance_pct = (attended / total_slots * 100) if total_slots > 0 else 100
    
    # Calculate fine correctly
    status = "Normal"
    fine_amount = 0.0
    if attendance_pct < 75:
        status = "Shortage"
        fine_amount = (75 - attendance_pct) * 50 # Example: ₹50 per % shortage
        
        # Auto-generate Invoice if not exists
        existing_fine = db.query(Invoice).filter(
            Invoice.student_id == student.id,
            Invoice.title == "Attendance Shortage Fine (Condonation)",
            Invoice.status == "pending"
        ).first()
        
        if not existing_fine:
            new_invoice = Invoice(
                title="Attendance Shortage Fine (Condonation)",
                amount=fine_amount,
                status="pending",
                student_id=student.id,
                tenant_id=current_user.tenant_id
            )
            db.add(new_invoice)
            db.commit()
            db.refresh(new_invoice)
        else:
            fine_amount = existing_fine.amount

    return {
        "attendance": attendance_pct,
        "attended_classes": attended,
        "total_classes": total_slots,
        "fine_amount": fine_amount,
        "status": status,
        "daily": [
            {"period": 1, "subject": "Advanced AI", "faculty": "Dr. Kumar", "time": "09:00 AM", "status": "Present"},
            {"period": 2, "subject": "ML Lab", "faculty": "Prof. Rao", "time": "10:00 AM", "status": "Absent"}
        ]
    }

@router.post("/attendance/mark")
def mark_attendance(
    attendance_data: List[dict],
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: Mark period-wise attendance for students."""
    for item in attendance_data:
        att = Attendance(
            student_id=item["student_id"],
            course_id=item["course_id"],
            period_number=item.get("period", 1),
            status=item["status"],
            tenant_id=current_user.tenant_id
        )
        db.add(att)
    db.commit()
    return {"status": "success"}

@router.get("/exams/hall-ticket")
def get_hall_ticket(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: Generate hall ticket for upcoming exams."""
    return {"status": "success", "url": "/downloads/hall-ticket-mock.pdf"}

@router.get("/evaluation/scripts")
def get_evaluation_scripts(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: List answer scripts assigned for digital evaluation."""
    scripts = db.query(AnswerScriptDigital).all()
    
    # Enrich for demo
    result = []
    for s in scripts:
        student = db.query(Student).filter(Student.id == s.student_id).first()
        exam = db.query(Exam).filter(Exam.id == s.exam_id).first()
        result.append({
            "id": s.id,
            "student_name": f"{student.first_name} {student.last_name}" if student else "Unknown",
            "exam_title": exam.title if exam else "External Exam",
            "course_code": "CSE302",
            "received_at": s.tenant_id, # Mocking timestamp with tenant_id or real field
            "status": s.evaluation_status,
            "question_wise_marks": s.question_wise_marks
        })
    
    # If empty, return a mock entry for demo
    if not result:
        result.append({
            "id": 1,
            "student_name": "Eswar (Mock)",
            "exam_title": "Database Systems T2",
            "course_code": "CSE301",
            "received_at": "2026-03-12T10:00:00",
            "status": "pending",
            "question_wise_marks": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0, "Q5": 0}
        })
        
    return result

@router.post("/evaluation/submit")
def submit_digital_evaluation(
    script_id: int,
    marks: dict, # {"Q1": 5, "Q2": 8}
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: Evaluate digital answer sheet question-wise."""
    script = db.query(AnswerScriptDigital).filter(AnswerScriptDigital.id == script_id).first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    script.question_wise_marks = marks
    script.total_marks = sum(marks.values())
    script.evaluation_status = "submitted"
    db.commit()
    return {"status": "success", "total": script.total_marks}

from typing import List, Optional

@router.post("/scrutiny/decision")
def scrutiny_decision(
    script_id: int,
    decision: str, # "approve" or "return"
    remarks: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_scrutinizer)
):
    """Scrutinizer: Lock script or send back to faculty if marks missed."""
    script = db.query(AnswerScriptDigital).filter(AnswerScriptDigital.id == script_id).first()
    if decision == "approve":
        script.evaluation_status = "completed"
        script.is_locked = True
    else:
        script.evaluation_status = "returned"
        script.scrutinizer_remarks = remarks
    db.commit()
    return {"status": "success"}

from app.models.academic import SemesterRegistration

@router.post("/registration/semester")
def register_semester(
    semester: int,
    academic_year: str,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Student: Register for current/next semester."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    reg = SemesterRegistration(
        student_id=student.id,
        semester_number=semester,
        academic_year=academic_year,
        tenant_id=current_user.tenant_id
    )
    db.add(reg)
    db.commit()
    return {"status": "registered", "semester": semester}

@router.get("/registration/status")
def get_registration_status(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: Check current semester registration status."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    reg = db.query(SemesterRegistration).filter(
        SemesterRegistration.student_id == student.id
    ).order_by(SemesterRegistration.id.desc()).first()
    return reg

@router.get("/electives/my-choices")
def get_elective_choices(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: View opted electives and minor/honors."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    choices = db.query(ElectiveChoice).filter(ElectiveChoice.student_id == student.id).all()
    
    result = []
    for c in choices:
        course = db.query(Course).filter(Course.id == c.course_id).first()
        result.append({
            "id": c.id,
            "type": c.type,
            "course_name": course.name if course else f"Course #{c.course_id}",
            "semester": c.semester
        })
    return result

@router.get("/results", response_model=List[dict])
def get_results(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Student: View academic performance and digital marks memos."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    results = db.query(ExamResult).filter(ExamResult.student_id == student.id).all()
    
    # Enrichment for results portal
    res_list = []
    for r in results:
        exam = db.query(Exam).filter(Exam.id == r.exam_id).first()
        res_list.append({
            "id": r.id,
            "exam_title": exam.title if exam else "End Semester",
            "marks_obtained": r.marks_obtained,
            "grade": r.grade,
            "is_pass": r.is_pass,
            "evaluation_status": r.evaluation_status,
            "date": exam.exam_date if exam else "2026-02-01"
        })
    
    if not res_list:
        # Mock results for demo
        res_list = [
            {"id": 1, "exam_title": "Semester 5 End Exams", "marks_obtained": 450, "grade": "8.92", "is_pass": True, "evaluation_status": "finalized", "date": "2026-01-15"},
            {"id": 2, "exam_title": "Semester 4 End Exams", "marks_obtained": 420, "grade": "8.44", "is_pass": True, "evaluation_status": "finalized", "date": "2025-06-20"}
        ]
    return res_list

@router.post("/revaluation/apply")
def apply_revaluation(
    exam_id: int,
    subject_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: Apply for digital revaluation of a specific answer script."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Check if script exists
    script = db.query(AnswerScriptDigital).filter(
        AnswerScriptDigital.student_id == student.id,
        AnswerScriptDigital.exam_id == exam_id
    ).first()
    
    req = RevaluationRequest(
        student_id=student.id,
        exam_id=exam_id,
        subject_id=subject_id,
        payment_status="paid", # Auto-pay for demo
        status="initiated",
        tenant_id=current_user.tenant_id
    )
    db.add(req)
    db.commit()
    return {"status": "success", "message": "Revaluation request initiated"}

@router.get("/revaluation/answer-sheet")
def get_answer_sheet(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: View evaluated answer sheet after revaluation payment."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    script = db.query(AnswerScriptDigital).filter(
        AnswerScriptDigital.student_id == student.id,
        AnswerScriptDigital.exam_id == exam_id
    ).first()
    
    if not script:
        return {
            "id": 101,
            "student_name": f"{student.first_name} {student.last_name}",
            "marks": {"Q1": 5, "Q2": 8, "Q3": 7, "Q4": 10},
            "status": "evaluated",
            "remarks": "Marks accurately awarded at primary evaluation."
        }
    return script

@router.post("/deo/promote")
def promote_students(
    student_ids: List[int],
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_dean_ar)
):
    """Academic DEO: Promote students to next semester/grade level."""
    updated = 0
    for sid in student_ids:
        student = db.query(Student).filter(Student.id == sid).first()
        if student:
            # Simple logic: increment grade level if it's an integer string
            try:
                current_grade = int(student.grade_level)
                student.grade_level = str(current_grade + 1)
                updated += 1
            except (ValueError, TypeError):
                # If it's like "Year 1", maybe change to "Year 2"
                if "Year" in student.grade_level:
                    num = int(student.grade_level.split()[-1])
                    student.grade_level = f"Year {num + 1}"
                    updated += 1
    db.commit()
    return {"status": "promoted", "count": updated}

@router.post("/electives/select")
def select_elective(
    course_id: int,
    type: str, # open_elective, minor, honors
    semester: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_student)
):
    """Student: Select an elective course or minor/honors program."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    # Check if already exists
    existing = db.query(ElectiveChoice).filter(
        ElectiveChoice.student_id == student.id,
        ElectiveChoice.semester == semester,
        ElectiveChoice.type == type
    ).first()
    
    if existing:
        existing.course_id = course_id
        db.commit()
        return {"status": "updated"}
        
    choice = ElectiveChoice(
        student_id=student.id,
        course_id=course_id,
        type=type,
        semester=semester,
        tenant_id=current_user.tenant_id
    )
    db.add(choice)
    db.commit()
    return {"status": "selected"}
@router.post("/marks/bulk-upload")
def bulk_upload_marks(
    exam_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: Bulk upload marks via CSV.
    CSV Format: student_enrollment, marks, [remarks]
    """
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
        
    # Security: Ensure faculty is linked to this course
    course = db.query(Course).filter(Course.id == exam.course_id, Course.teacher_id == staff.id).first()
    if not course and current_user.role != "institution_admin":
        raise HTTPException(status_code=403, detail="You are not authorized to evaluate this course")

    content = file.file.read()
    buffer = io.StringIO(content.decode('utf-8'))
    reader = csv.DictReader(buffer)
    
    upload_count = 0
    for row in reader:
        enrollment = row.get('student_enrollment')
        marks = float(row.get('marks', 0))
        remarks = row.get('remarks', "")
        
        student = db.query(Student).filter(Student.enrollment_number == enrollment).first()
        if not student:
            continue
            
        # Update or Create Result
        result = db.query(ExamResult).filter(
            ExamResult.exam_id == exam_id, 
            ExamResult.student_id == student.id
        ).first()
        
        if result:
            result.marks_obtained = marks
            result.remarks = remarks
            result.evaluation_status = "evaluated"
        else:
            new_result = ExamResult(
                exam_id=exam_id,
                student_id=student.id,
                marks_obtained=marks,
                remarks=remarks,
                evaluation_status="evaluated",
                evaluator_id=staff.id,
                tenant_id=current_user.tenant_id
            )
            db.add(new_result)
        upload_count += 1
        
    db.commit()
    return {"status": "success", "processed": upload_count}
@router.get("/metrics/performance")
def get_performance_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD/Dean: View overall academic performance trends."""
    # Mocking for demo
    return {
        "cgpa_distribution": [
            {"label": "9.0 - 10.0", "value": 15},
            {"label": "8.0 - 9.0", "value": 35},
            {"label": "7.0 - 8.0", "value": 30},
            {"label": "6.0 - 7.0", "value": 15},
            {"label": "Below 6.0", "value": 5}
        ],
        "subject_pass_rates": [
            {"subject": "Advanced AI", "pass_rate": 92},
            {"subject": "Database Systems", "pass_rate": 85},
            {"subject": "Algorithms", "pass_rate": 78}
        ]
    }

@router.get("/course-completion")
def get_course_completion(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: Monitor syllabus completion across all courses."""
    courses = db.query(Course).filter(Course.tenant_id == current_user.tenant_id).all()
    import random
    return [
        {
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "completion": random.randint(40, 95),
            "faculty": "Faculty Member"
        }
        for c in courses
    ]

@router.post("/staff", response_model=dict)
def create_staff_user(
    staff_in: StaffCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_institution_admin)
):
    """Institution Admin: Create Dean, HOD, Faculty, or DEO with plan-based limits."""
    # 1. Enforcement: Check Staff Creation Quota
    tenant = current_user.tenant
    max_staff = tenant.plan.max_staff if (tenant and tenant.plan) else 50
    current_staff_count = db.query(Staff).filter(Staff.tenant_id == current_user.tenant_id).count()
    
    if current_staff_count >= max_staff:
        raise HTTPException(
            status_code=403, 
            detail=f"Institutional staff limit reached ({max_staff}). Please upgrade your strategic plan."
        )

    # 2. Check if user already exists
    existing_user = db.query(User).filter(User.email == staff_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="A user with this email already exists.")

    # 3. Find Role: Prioritize custom institutional roles over global ones
    from sqlalchemy import or_
    role = db.query(Role).filter(
        Role.name == staff_in.role,
        or_(Role.tenant_id == current_user.tenant_id, Role.tenant_id == None)
    ).order_by(Role.tenant_id.desc()).first()
    
    if not role:
        raise HTTPException(status_code=404, detail=f"Role '{staff_in.role}' is not available for your institution.")

    # 4. Create User
    new_user = User(
        email=staff_in.email,
        hashed_password=get_password_hash(staff_in.password),
        full_name=f"{staff_in.first_name} {staff_in.last_name}",
        role=staff_in.role,
        role_id=role.id,
        tenant_id=current_user.tenant_id,
        is_active=True
    )
    db.add(new_user)
    db.flush() # Get user ID

    # 5. Create Staff Record
    new_staff = Staff(
        first_name=staff_in.first_name,
        last_name=staff_in.last_name,
        employee_id=staff_in.employee_id,
        contact_email=staff_in.email,
        designation=staff_in.designation,
        department_id=staff_in.department_id,
        user_id=new_user.id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_staff)
    db.commit()
    
    return {"status": "success", "user_id": new_user.id, "staff_id": new_staff.id}

@router.post("/faculty/preferences")
def submit_course_preferences(
    preferences: List[CoursePreferenceCreate],
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_faculty)
):
    """Faculty: Submit subject preferences for the upcoming semester."""
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff record not found")

    # Clear old pending preferences for the same semester
    db.query(CoursePreference).filter(
        CoursePreference.staff_id == staff.id,
        CoursePreference.semester == preferences[0].semester,
        CoursePreference.academic_year == preferences[0].academic_year,
        CoursePreference.status == "pending"
    ).delete()

    for pref in preferences:
        new_pref = CoursePreference(
            staff_id=staff.id,
            course_id=pref.course_id,
            priority=pref.priority,
            semester=pref.semester,
            academic_year=pref.academic_year,
            tenant_id=current_user.tenant_id
        )
        db.add(new_pref)
    
    db.commit()
    return {"status": "success", "message": "Preferences submitted for approval."}

@router.get("/faculty/preferences/all")
def get_all_faculty_preferences(
    semester: int,
    academic_year: str,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: View all faculty preferences for a department to make assignments."""
    staff = db.query(Staff).filter(Staff.user_id == current_user.id).first()
    
    # Only show for the HOD's department
    dept_id = staff.department_id
    
    prefs = db.query(CoursePreference).join(Staff).filter(
        Staff.department_id == dept_id,
        CoursePreference.semester == semester,
        CoursePreference.academic_year == academic_year
    ).all()
    
    return prefs

@router.post("/faculty/assign")
def assign_course_to_faculty(
    assignment: CourseAssignmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD: Approve a preference and officially assign a course to faculty."""
    # 1. Create Assignment
    new_assignment = CourseAssignment(
        staff_id=assignment.staff_id,
        course_id=assignment.course_id,
        semester=assignment.semester,
        academic_year=assignment.academic_year,
        assigned_by_id=current_user.id,
        tenant_id=current_user.tenant_id
    )
    db.add(new_assignment)
    
    # 2. Update Official Course Teacher (Master Data)
    course = db.query(Course).filter(Course.id == assignment.course_id).first()
    if course:
        course.teacher_id = assignment.staff_id
    
    # 3. Mark Preference as Approved if it exists
    pref = db.query(CoursePreference).filter(
        CoursePreference.staff_id == assignment.staff_id,
        CoursePreference.course_id == assignment.course_id,
        CoursePreference.semester == assignment.semester
    ).first()
    if pref:
        pref.status = "approved"

    db.commit()
    return {"status": "success", "message": "Course officially assigned."}
