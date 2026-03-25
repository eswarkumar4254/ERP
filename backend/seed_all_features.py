from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.tenant import Tenant, Plan
from app.models.academic import Student, Staff, Course, Attendance, Section, InternalMark
from app.models.curriculum import CourseEnrollment
from app.models.rbac import Role, Module
from app.models.user import User
from app.models.finance import Invoice, FeeStructure
from app.models.communication import DocumentVault
from app.models.extra_features import StudyPlan, Grievance, CourseModule, StudentModuleCompletion, GlobalAnnouncement
from app.core import security
from datetime import datetime, timedelta
import random

def seed_complete_features():
    db = SessionLocal()
    try:
        print("🌱 Seeding Dynamic Data for All New Features...")
        
        # 1. Get existing data from minimal_setup
        role_objs = {r.name: r for r in db.query(Role).all()}
        enterprise_plan = db.query(Plan).filter(Plan.name == "Enterprise").first()
        
        # 2. Create Test University
        univ_name = "Neuraltrix University"
        univ_tenant = db.query(Tenant).filter(Tenant.name == univ_name).first()
        if not univ_tenant:
            univ_tenant = Tenant(
                name=univ_name,
                domain="neuraltrix.edu",
                subscription_plan_id=enterprise_plan.id,
                is_active=True,
                primary_color="#4f46e5"
            )
            db.add(univ_tenant)
            db.commit()
            db.refresh(univ_tenant)

        # 3. Create Faculty
        faculty_email = "faculty@neuraltrix.edu"
        faculty_user = db.query(User).filter(User.email == faculty_email).first()
        if not faculty_user:
            faculty_user = User(
                email=faculty_email,
                hashed_password=security.get_password_hash("password123"),
                full_name="Prof. John Doe",
                role="faculty",
                role_id=role_objs["faculty"].id,
                tenant_id=univ_tenant.id
            )
            db.add(faculty_user)
            db.commit()
            db.refresh(faculty_user)
            
            faculty_staff = Staff(
                user_id=faculty_user.id,
                employee_id="FAC001",
                first_name="John",
                last_name="Doe",
                department="Computer Science",
                designation="Assistant Professor",
                contact_email=faculty_email,
                tenant_id=univ_tenant.id
            )
            db.add(faculty_staff)
            db.commit()
            db.refresh(faculty_staff)
        else:
            faculty_staff = db.query(Staff).filter(Staff.user_id == faculty_user.id).first()

        # 4. Create Students
        student_emails = ["student@neuraltrix.edu", "alice@neuraltrix.edu"]
        students = []
        for i, email in enumerate(student_emails):
            if not db.query(User).filter(User.email == email).first():
                u = User(
                    email=email,
                    hashed_password=security.get_password_hash("password123"),
                    full_name=f"{'Demo' if i == 0 else 'Alice'} Student",
                    role="student",
                    role_id=role_objs["student"].id,
                    tenant_id=univ_tenant.id
                )
                db.add(u)
                db.commit()
                db.refresh(u)
                
                s = Student(
                    user_id=u.id,
                    enrollment_number=f"STU00{i+1}",
                    first_name='Demo' if i == 0 else 'Alice',
                    last_name='Student',
                    grade_level="4th Year",
                    branch="CSE",
                    admission_year=2021,
                    current_year=4,
                    current_semester=7,
                    contact_email=email,
                    tenant_id=univ_tenant.id
                )
                db.add(s)
                db.commit()
                db.refresh(s)
                students.append(s)
            else:
                students.append(db.query(Student).filter(Student.contact_email == email).first())

        # 5. Create Course & Section
        course_name = "Cloud Architecture"
        course_code = "CS-401"
        course = db.query(Course).filter(Course.code == course_code).first()
        if not course:
            course = Course(
                name=course_name,
                code=course_code,
                description="Principles of distributed cloud systems.",
                credits=4,
                teacher_id=faculty_staff.id,
                tenant_id=univ_tenant.id
            )
            db.add(course)
            db.commit()
            db.refresh(course)
            
            section = Section(
                name="Section A",
                course_id=course.id,
                faculty_id=faculty_staff.id,
                academic_year="2024-25",
                semester=7,
                tenant_id=univ_tenant.id
            )
            db.add(section)
            db.commit()
            db.refresh(section)
            
            # Enroll Students
            for s in students:
                enroll = CourseEnrollment(student_id=s.id, course_id=course.id, status="active", tenant_id=univ_tenant.id)
                db.add(enroll)
                s.section_id = section.id
            db.commit()

        # 6. Feature Details: Syllabus Modules
        modules_data = [
            ("Core Virtulization", "Hypervisors, KVM, Xen.", 1),
            ("Storage Mesh", "S3, EBS, Elastic Block Storage.", 2),
            ("Serverless Functions", "Lambda, Edge computing.", 3),
            ("FinOps", "Cost optimization in AWS.", 4)
        ]
        for m_name, m_desc, m_order in modules_data:
            m = CourseModule(course_id=course.id, name=m_name, description=m_desc, order=m_order, tenant_id=univ_tenant.id)
            db.add(m)
            db.commit()
            db.refresh(m)
            # Mark first 2 as completed for demo student
            if m_order <= 2:
                comp = StudentModuleCompletion(student_id=students[0].id, module_id=m.id, is_completed=True, completed_at=datetime.now(), tenant_id=univ_tenant.id)
                db.add(comp)
        db.commit()

        # 7. Feature Details: Study Plan
        plan = StudyPlan(
            student_id=students[0].id,
            title="Sessional Prep Week",
            tasks=[
                {"title": "Review Cloud IAM", "done": True},
                {"title": "Finish FinOps Assignment", "done": False},
                {"title": "Practice AWS CLI", "done": False}
            ],
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=7),
            tenant_id=univ_tenant.id
        )
        db.add(plan)

        # 8. Feature Details: Grievance
        g = Grievance(
            student_id=students[0].id,
            category="facility",
            subject="Library AC Malfunction",
            description="The central library AC is not working since Tuesday.",
            status="in-progress",
            priority="medium",
            tenant_id=univ_tenant.id
        )
        db.add(g)

        # 9. Feature Details: Global Announcement
        ann = GlobalAnnouncement(
            title="University Convocation 2024",
            content="We are pleased to announce the 12th Convocation for the graduating batch.",
            target_role="all",
            sender_id=db.query(User).filter(User.role == "super_admin").first().id,
            tenant_id=univ_tenant.id
        )
        db.add(ann)

        # 10. Feature Details: Finance (Invoices)
        inv = Invoice(
            title="Semester 7 Tuition Fee",
            amount=45000.0,
            status="pending",
            due_date=datetime.now() + timedelta(days=15),
            student_id=students[0].id,
            tenant_id=univ_tenant.id
        )
        db.add(inv)

        # 11. Feature Details: Resource Repository
        res = DocumentVault(
            title="AWS Certified Architect - Handbook",
            file_path="/uploads/cloud_handbook.pdf",
            file_type="PDF",
            owner_id=faculty_user.id,
            is_public=True,
            tags=["Cloud", "Exams"],
            tenant_id=univ_tenant.id
        )
        db.add(res)

        db.commit()
        print("✨ Seeding Complete! Systems are ready for dynamic exploration.")

    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_complete_features()
