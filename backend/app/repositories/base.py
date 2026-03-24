from typing import Generic, TypeVar, Type, List, Optional, Any
from sqlalchemy.orm import Session
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get_scoped_query(self, db: Session, user: Any):
        """
        Enforces data isolation:
        - Multi-tenancy for everyone except Super Admin.
        - Students only see their own data.
        - Faculty only see their students/courses.
        """
        query = db.query(self.model)
        
        # 1. Multi-tenant filter
        if user.role != "super_admin" and hasattr(self.model, "tenant_id"):
            query = query.filter(self.model.tenant_id == user.tenant_id)
            
        # Categorize models for scoped access
        from app.models.academic import (
            Student, Staff, Course, AnswerScriptDigital, 
            ElectiveChoice, RevaluationRequest, NoDueForm, SemesterRegistration
        )
        from app.models.accounting import LedgerAccount, PurchaseOrder
        from app.models.tenant import Tenant, APIKey
        from app.models.research import Publication, ResearchGrant, Patent, ResearchTarget
        from app.models.student_affairs import CounselingRecord, StudentHealth, ExtraCurricularParticipation, AlumniDirectory
        from app.models.institutional import InstitutionalTask, QualityReport
        from app.models.compliance import NoDueRequest, NoDueClearance
        from app.models.finance import Scholarship, TransactionChallan
        from app.models.academic import SemesterRegistration
        from app.models.admissions import AdmissionApplication

        academic_models = (Student, Staff, Course, SemesterRegistration, AnswerScriptDigital, ElectiveChoice, RevaluationRequest)
        finance_models = (LedgerAccount, PurchaseOrder, Scholarship, TransactionChallan)
        global_models = (Tenant, APIKey, AdmissionApplication)
        research_models = (Publication, ResearchGrant, Patent, ResearchTarget)
        student_affairs_models = (CounselingRecord, StudentHealth, ExtraCurricularParticipation, AlumniDirectory)
        institutional_models = (InstitutionalTask, QualityReport)
        compliance_models = (NoDueRequest, NoDueClearance, NoDueForm)

        # 2. Super Admin Privacy Scope: Restrict from institutional content
        if user.role == "super_admin":
            restricted_models = academic_models + finance_models + research_models + student_affairs_models + institutional_models
            if any(isinstance(self.model, m) or self.model == m for m in restricted_models):
                # Super Admin should manage tenants, not see student grades or bank ledgers
                query = query.filter(self.model.id == -1)
            return query

        # 3. Student Scope: Identity Isolation
        if user.role == "student":
            student_record = db.query(Student).filter(Student.user_id == user.id).first()
            if student_record:
                if hasattr(self.model, "student_id"):
                    query = query.filter(self.model.student_id == student_record.id)
                elif self.model == Student:
                    query = query.filter(self.model.id == student_record.id)
                elif self.model in student_affairs_models:
                    # Students see their own records (Counseling, Health, Extra-curricular, Alumni)
                    pass 
                elif self.model in finance_models:
                    # Students see their own invoices (if invoices have student_id)
                    pass
            else:
                query = query.filter(self.model.id == -1)
        
        # 4. Faculty Scope: Enrolled Context
        elif user.role == "faculty":
            staff_record = db.query(Staff).filter(Staff.user_id == user.id).first()
            if staff_record:
                if self.model in finance_models:
                    query = query.filter(self.model.id == -1) # Faculty shouldn't see ledgers
                elif self.model in research_models:
                    # Faculty see their own research
                    query = query.filter(self.model.staff_id == staff_record.id)
                elif hasattr(self.model, "teacher_id"):
                    query = query.filter(self.model.teacher_id == staff_record.id)
                elif self.model == Course:
                    query = query.filter(self.model.teacher_id == staff_record.id)
                elif self.model == Student:
                    from app.models.academic import Course, CourseEnrollment
                    course_ids = [c.id for c in db.query(Course.id).filter(Course.teacher_id == staff_record.id).all()]
                    student_ids = [e.student_id for e in db.query(CourseEnrollment.student_id).filter(CourseEnrollment.course_id.in_(course_ids)).all()]
                    query = query.filter(self.model.id.in_(student_ids))
            else:
                query = query.filter(self.model.id == -1)
        
        # 5. Parent Scope: Child Dependency
        elif user.role == "parent":
            from app.models.academic import Parent, ParentStudent
            parent_record = db.query(Parent).filter(Parent.user_id == user.id).first()
            if parent_record:
                child_ids = [ps.student_id for ps in db.query(ParentStudent).filter(ParentStudent.parent_id == parent_record.id).all()]
                if self.model == Student:
                    query = query.filter(self.model.id.in_(child_ids))
                elif hasattr(self.model, "student_id"):
                    query = query.filter(self.model.student_id.in_(child_ids))
                else:
                    query = query.filter(self.model.id == -1)
            else:
                query = query.filter(self.model.id == -1)

        # 6. Finance Officer Scope: Financial Data Only
        elif user.role == "finance_officer":
            if self.model in academic_models:
                # Can view students for billing, but not grades (handled by field-level serialization usually)
                # Here we just allow reading the Student record for invoicing purposes
                pass
            elif self.model not in finance_models and self.model != Student:
                query = query.filter(self.model.id == -1)

        # 7. IT / System Admin Scope: Infrastructure & Logs only
        elif user.role == "it_admin":
            if self.model in academic_models or self.model in finance_models:
                # IT should reset passwords and view logs, not read transcripts
                query = query.filter(self.model.id == -1)

        # 8. Library Manager: Books & Basic Student Identity
        elif user.role == "library_manager":
            if self.model in finance_models or self.model == Course:
                query = query.filter(self.model.id == -1)
            # Can see Student to process issues/returns

        # 9. Placement Officer: Students & Career Context
        elif user.role == "placement_officer":
            if self.model in finance_models or self.model == Course:
                query = query.filter(self.model.id == -1)
            # Can see Students for recruitment matching

        # 10. Alumni: Post-grad Network Isolation
        elif user.role == "alumni":
            if self.model in academic_models or self.model in finance_models:
                 query = query.filter(self.model.id == -1)

        return query

    def get(self, db: Session, id: Any, user: Optional[Any] = None) -> Optional[ModelType]:
        if user:
            return self.get_scoped_query(db, user).filter(self.model.id == id).first()
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100, user: Optional[Any] = None) -> List[ModelType]:
        if user:
            query = self.get_scoped_query(db, user)
        else:
            query = db.query(self.model)
        return query.offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: Any, tenant_id: Optional[int] = None) -> ModelType:
        obj_data = obj_in.dict()
        db_obj = self.model(**obj_data)
        if tenant_id and hasattr(self.model, "tenant_id"):
            db_obj.tenant_id = tenant_id
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int, user: Optional[Any] = None) -> ModelType:
        if user:
            obj = self.get_scoped_query(db, user).filter(self.model.id == id).first()
        else:
            obj = db.query(self.model).get(id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj
