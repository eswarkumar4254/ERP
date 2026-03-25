import sys
import os
from sqlalchemy import text
from sqlalchemy.orm import Session

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
import app.models
from app.models.tenant import Tenant, Plan
from app.models.rbac import Role, Module
from app.models.user import User
from app.core import security

def minimal_setup():
    print("🚀 PROCEEDING WITH AGGRESSIVE CLEANUP...")
    
    try:
        db_raw = SessionLocal()
        print("🧹 Dropping all existing tables via CASCADE...")
        # Get all tables in public schema
        result = db_raw.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';"))
        tables = [row[0] for row in result]
        
        for table in tables:
            print(f"   Dropping table {table} CASCADE...")
            db_raw.execute(text(f"DROP TABLE IF EXISTS \"{table}\" CASCADE;"))
        
        db_raw.commit()
        db_raw.close()
        
        print("🧱 Rebuilding all tables from schema definitions...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database schema is now pristine.")
    except Exception as e:
        print(f"❌ Structural cleanup failed: {e}")
        return
    
    db = SessionLocal()
    try:
        # 1. Essential Roles
        print("\n📦 Seeding Critical Roles...")
        roles = {
            "super_admin": Role(name="super_admin", description="System Super Administrator", is_system=True),
            "institution_admin": Role(name="institution_admin", description="Institutional Administrator", is_system=True),
            "faculty": Role(name="faculty", description="Academic Faculty members", is_system=False),
            "student": Role(name="student", description="Enrolled students", is_system=False)
        }
        for r in roles.values(): db.add(r)
        db.commit()
        for r in roles.values(): db.refresh(r)

        # 2. Essential Plans
        print("📦 Seeding Critical Plans...")
        plans = {
            "Enterprise": Plan(name="Enterprise", price=15000.0, max_students=100000, features="Full ERP Mesh, AI Analytics, Dedicated Support"),
            "Professional": Plan(name="Professional", price=8000.0, max_students=10000, features="LMS, TMS, Financial Hub, Advanced Reporting"),
            "Starter": Plan(name="Starter", price=2500.0, max_students=1000, features="LMS access, Basic reports")
        }
        for p in plans.values(): db.add(p)
        db.commit()
        for p in plans.values(): db.refresh(p)

        # 3. Primary System Partition (Tenant)
        print("🏢 Establishing System Admin Partition...")
        sys_tenant = Tenant(
            name="System Admin",
            domain="admin.erp",
            subscription_plan_id=plans["Enterprise"].id,
            is_active=True,
            primary_color="#1e293b"
        )
        db.add(sys_tenant)
        db.commit()
        db.refresh(sys_tenant)

        # 4. Modules for Landing Page UX
        print("📦 Re-indexing Core Modules...")
        modules_list = [
            ("LMS", "Learning Management System"),
            ("HMS", "Hostel & Hospital Management"),
            ("TMS", "Transport Management"),
            ("FMS", "Financial Management"),
            ("SMS", "Student Lifecycle Management"),
            ("CRM", "Constituent Relationship Management"),
            ("Library", "Digital Knowledge Archives")
        ]
        for name, desc in modules_list:
            db.add(Module(name=name, full_name=desc, description=desc))
        db.commit()

        # 5. The One and Only Super Admin
        print("👤 Provisioning Super Architect account...")
        sa_email = "super_admin@neuraltrix.io"
        sa_user = User(
            email=sa_email,
            full_name="Neuraltrix Super Architect",
            hashed_password=security.get_password_hash("password123"),
            role="super_admin",
            role_id=roles["super_admin"].id,
            tenant_id=sys_tenant.id,
            is_active=True
        )
        db.add(sa_user)
        db.commit()

        print("\n✨ SYSTEM CLEANUP & SECURE INITIALIZATION SUCCESSFUL!")
        print("-" * 50)
        print(f"🌍 Partition: System Admin (admin.erp)")
        print(f"🎯 Global Root: {sa_email}")
        print(f"🔐 Access Pin: password123")
        print("-" * 50)
        print("The university orchestrator is now empty and ready for dynamic onboarding.")

    except Exception as e:
        print(f"❌ Final seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    minimal_setup()
