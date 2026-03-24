from app.core.database import Base
from app.models.tenant import Tenant, Plan
from app.models.user import User, AuditLog
from app.models.academic import Course, Student, Staff, Attendance, LeaveRequest, ODRequest, ProjectBatch
from app.models.finance import Invoice, FeeStructure, Expense
from app.models.library import Book, BookIssue
from app.models.domain import (
    Exam, ExamResult, Hostel, TransportRoute, Asset,
    Room, HostelAllocation, HostelComplaint,
    Vehicle, TransportMapping, MaintenanceRequest
)
from app.models.campus import Notification, Alumni, ResearchProject
from app.models.workflow import Workflow, WorkflowInstance
from app.models.curriculum import Program, Department, Curriculum, CourseEnrollment
from app.models.hr import Payroll, Appraisal
from app.models.accounting import LedgerAccount, Transaction, Vendor, PurchaseOrder
from app.models.communication import ChatRoom, Message, DocumentVault
from app.models.infrastructure import ComplianceAudit, IoTDevice, IoTMetric
from app.models.placement import PlacementDrive, StudentPlacement, Internship
from app.models.research import Publication, ResearchGrant, Patent, ResearchTarget
from app.models.student_affairs import CounselingRecord, StudentHealth, ExtraCurricularParticipation, AlumniDirectory
from app.models.institutional import InstitutionalTask, QualityReport
from app.models.compliance import NoDueRequest, NoDueClearance
from app.models.admissions import AdmissionApplication
from app.models.rbac import Role, Permission, Module

# This allows easy access to all models and metadata for migrations
metadata = Base.metadata
