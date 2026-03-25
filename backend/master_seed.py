from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.tenant import Tenant, Plan, SaasInvoice
from app.models.academic import Student, Staff, Course
from app.models.rbac import Role, Permission, Module
from app.models.user import User
from app.models.library import Book
from app.core import security
from datetime import datetime, timedelta
import random

def seed_data():
    db = SessionLocal()
    try:
        print("Starting master seed...")
        
        # 1. Ensure Roles exist
        roles_to_create = ["super_admin", "institution_admin", "faculty", "student", "staff", "librarian"]
        role_objs = {}
        for rname in roles_to_create:
            role = db.query(Role).filter(Role.name == rname).first()
            if not role:
                role = Role(name=rname, description=f"{rname} role")
                db.add(role)
                db.commit()
                db.refresh(role)
            role_objs[rname] = role

        # 2. Get Plans
        plans = db.query(Plan).all()
        if not plans:
            print("Error: No plans found. Run seed_plans.py first.")
            return

        # 3. Create a Primary Test Institution
        print("Creating Test Institution...")
        univ_name = "Neuraltrix University"
        univ_tenant = db.query(Tenant).filter(Tenant.name == univ_name).first()
        if not univ_tenant:
            enterprise_plan = db.query(Plan).filter(Plan.name == "Enterprise").first() or plans[0]
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

        # 4. Create Institution Admin
        admin_email = "admin@neuraltrix.edu"
        if not db.query(User).filter(User.email == admin_email).first():
            admin_user = User(
                email=admin_email,
                hashed_password=security.get_password_hash("password123"),
                full_name="Neuraltrix Admin",
                role="institution_admin",
                role_id=role_objs["institution_admin"].id,
                tenant_id=univ_tenant.id
            )
            db.add(admin_user)
            db.commit()

        # 5. Create Faculty & Courses
        print("Seeding Faculty & Courses...")
        faculty_data = [
            ("Dr. Sarah Chen", "CS-101", "Computer Science", "Professor"),
            ("Prof. James Wilson", "ME-202", "Mechanical Engineering", "Associate Prof"),
            ("Dr. Emily Blunt", "BA-303", "Business Admin", "Assistant Prof"),
        ]
        
        courses_data = [
            ("Introduction to Algorithms", "CS101", 4, "Core algorithms and data structures.", "Computer Science"),
            ("Thermodynamics I", "ME201", 3, "Fundamental principles of energy and heat.", "Mechanical Engineering"),
            ("Executive Leadership", "BA501", 3, "Strategic management and decision making.", "Business Admin"),
        ]
 
        faculty_records = []
        for name, eid, dept, desig in faculty_data:
            email = f"{eid.lower()}@neuraltrix.edu"
            u = db.query(User).filter(User.email == email).first()
            if not u:
                u = User(
                    email=email,
                    hashed_password=security.get_password_hash("password123"),
                    full_name=name,
                    role="faculty",
                    role_id=role_objs["faculty"].id,
                    tenant_id=univ_tenant.id
                )
                db.add(u)
                db.commit()
                db.refresh(u)
                
                staff = Staff(
                    user_id=u.id,
                    employee_id=eid,
                    department=dept,
                    designation=desig,
                    first_name=name.split()[0],
                    last_name=" ".join(name.split()[1:]),
                    contact_email=email,
                    tenant_id=univ_tenant.id
                )
                db.add(staff)
                db.commit()
                db.refresh(staff)
                faculty_records.append(staff)
            else:
                staff = db.query(Staff).filter(Staff.user_id == u.id).first()
                if staff: faculty_records.append(staff)

        for i, (cname, ccode, creds, desc, dept) in enumerate(courses_data):
            if not db.query(Course).filter(Course.code == ccode, Course.tenant_id == univ_tenant.id).first():
                course = Course(
                    name=cname,
                    code=ccode,
                    credits=creds,
                    description=desc,
                    teacher_id=faculty_records[i % len(faculty_records)].id if faculty_records else None,
                    tenant_id=univ_tenant.id
                )
                db.add(course)
        db.commit()

        # 6. Create Students
        print("Seeding Students...")
        student_data = [
            ("Alice Johnson", "STU001", "CS", "4th Year"),
            ("Bob Smith", "STU002", "CS", "2nd Year"),
            ("Charlie Brown", "STU003", "ME", "3rd Year"),
            ("Diana Prince", "STU004", "BA", "1st Year"),
            ("Ethan Hunt", "STU005", "CS", "4th Year"),
        ]
        for name, sid, dept, year in student_data:
            email = f"{sid.lower()}@neuraltrix.edu"
            if not db.query(User).filter(User.email == email).first():
                u = User(
                    email=email,
                    hashed_password=security.get_password_hash("password123"),
                    full_name=name,
                    role="student",
                    role_id=role_objs["student"].id,
                    tenant_id=univ_tenant.id
                )
                db.add(u)
                db.commit()
                db.refresh(u)
                
                student = Student(
                    user_id=u.id,
                    enrollment_number=sid,
                    grade_level=year,
                    first_name=name.split()[0],
                    last_name=" ".join(name.split()[1:]),
                    contact_email=email,
                    tenant_id=univ_tenant.id
                )
                db.add(student)
        db.commit()

        # 7. Seed Library Books
        print("Seeding Library Books...")
        books_data = [
            ("Introduction to Algorithms", "Thomas H. Cormen", "978-0262033848", "CS"),
            ("Heat and Mass Transfer", "Yunus A. Cengel", "978-0073398181", "ME"),
            ("Strategic Management", "Michael Porter", "978-1416551341", "BA"),
        ]
        for title, author, isbn, cat in books_data:
            if not db.query(Book).filter(Book.isbn == isbn, Book.tenant_id == univ_tenant.id).first():
                book = Book(
                    title=title,
                    author=author,
                    isbn=isbn,
                    category=cat,
                    quantity=10,
                    available_quantity=10,
                    tenant_id=univ_tenant.id
                )
                db.add(book)
        db.commit()

        # 8. Seed SaaS Invoices
        print("Seeding SaaS Invoices...")
        other_tenants = [
            ("Delhi Alpha Academy", "delhi-a.edu", "Professional"),
            ("Mumbai Tech Institute", "mumbai-t.edu", "Starter"),
            ("Chennai Science Hub", "chennai-s.edu", "Enterprise"),
        ]
        for tname, tdom, tplan in other_tenants:
            plan_obj = db.query(Plan).filter(Plan.name == tplan).first()
            t = db.query(Tenant).filter(Tenant.domain == tdom).first()
            if not t:
                t = Tenant(name=tname, domain=tdom, subscription_plan_id=plan_obj.id if plan_obj else None, is_active=True)
                db.add(t)
                db.commit()
                db.refresh(t)
            
            for i in range(3):
                inv_id = f"INV-{t.id}-{2024}-{random.randint(1000, 9999)}"
                if not db.query(SaasInvoice).filter(SaasInvoice.id == inv_id).first():
                    inv = SaasInvoice(
                        id=inv_id,
                        tenant_id=t.id,
                        plan_name=tplan,
                        amount=plan_obj.price if plan_obj else 3000.0,
                        status="PAID" if i < 2 else "PENDING",
                        issue_date=datetime.now() - timedelta(days=30*i),
                        due_date=datetime.now() + timedelta(days=15)
                    )
                    db.add(inv)
        db.commit()

        print("Master seed completed successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
