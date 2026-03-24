from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# === Examination System ===
class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    exam_date = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer, default=60)
    total_marks = Column(Integer, default=100)
    type = Column(String, default="internal")
    status = Column(String, default="scheduled")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

    questions = relationship("ExamQuestion", back_populates="exam")

class ExamQuestion(Base):
    __tablename__ = "exam_questions"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    question_text = Column(Text, nullable=False)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_option = Column(String) # a, b, c, or d
    marks = Column(Integer, default=1)
    
    exam = relationship("Exam", back_populates="questions")

class ExamAttempt(Base):
    __tablename__ = "exam_attempts"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    start_time = Column(DateTime, server_default=func.now())
    end_time = Column(DateTime, nullable=True)
    score = Column(Float, default=0.0)
    status = Column(String, default="in_progress") # in_progress, completed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ExamAnswer(Base):
    __tablename__ = "exam_answers"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("exam_attempts.id"))
    question_id = Column(Integer, ForeignKey("exam_questions.id"))
    selected_option = Column(String)
    is_correct = Column(Boolean)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    marks_obtained = Column(Float, default=0.0)
    grade = Column(String, nullable=True)
    is_pass = Column(Boolean, default=True)
    remarks = Column(Text, nullable=True)
    
    # Digital Evaluation Workflow
    evaluation_status = Column(String, default="unevaluated") # unevaluated, evaluated, scrutinized, finalized
    evaluator_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    scrutinizer_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    question_wise_marks = Column(JSON, nullable=True) # {"Q1": 8, "Q2": 10...}
    is_locked = Column(Boolean, default=False)
    
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

# === Facilities (HMS) ===
class Hostel(Base):
    __tablename__ = "hostels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    warden_name = Column(String)
    total_capacity = Column(Integer)
    type = Column(String) # Boys, Girls, Co-ed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    hostel_id = Column(Integer, ForeignKey("hostels.id"))
    room_number = Column(String)
    floor = Column(Integer)
    capacity = Column(Integer)
    occupied = Column(Integer, default=0)
    price_per_month = Column(Float)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class HostelAllocation(Base):
    __tablename__ = "hostel_allocations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, default="active") # active, closed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class HostelComplaint(Base):
    __tablename__ = "hostel_complaints"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    description = Column(String)
    status = Column(String, default="pending") # pending, resolving, resolved
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

# === Transport (TMS) ===
class TransportRoute(Base):
    __tablename__ = "transport_routes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    vehicle_number = Column(String)
    driver_name = Column(String)
    monthly_fee = Column(Float)
    start_point = Column(String)
    end_point = Column(String)
    stops = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True)
    capacity = Column(Integer)
    driver_name = Column(String)
    driver_contact = Column(String)
    status = Column(String, default="active") # active, maintenance, retired
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class TransportMapping(Base):
    __tablename__ = "transport_mappings"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    route_id = Column(Integer, ForeignKey("transport_routes.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    status = Column(String, default="active")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

# === Infrastructure (IMS) ===
class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    asset_tag = Column(String, unique=True, index=True)
    category = Column(String)
    location = Column(String)
    condition = Column(String, default="good")
    purchase_cost = Column(Float, default=0.0)
    status = Column(String, default="active") # active, maintenance, disposed
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    title = Column(String)
    description = Column(String)
    priority = Column(String) # low, medium, high, critical
    status = Column(String, default="pending") # pending, scheduled, completed
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

# === Alumni Management ===
class Alumni(Base):
    __tablename__ = "alumnis"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    graduation_year = Column(Integer, index=True)
    current_company = Column(String)
    job_title = Column(String)
    industry = Column(String)
    location = Column(String)
    linkedin_url = Column(String, nullable=True)
    mentorship_opt_in = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class AlumniEvent(Base):
    __tablename__ = "alumni_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    event_date = Column(DateTime)
    location = Column(String)
    is_virtual = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
# === Learning Analytics & Predictions ===
class StudentRiskAssessment(Base):
    __tablename__ = "student_risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    risk_score = Column(Float, default=0.0) # 1.0 (Critical) to 0.0 (Safe)
    status = Column(String, default="safe") # safe, warning, critical
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
    primary_reasons = Column(JSON, nullable=True) # ["low_attendance", "grade_drop"]
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

# === Advanced Fee Management (Strategic Expansion) ===
class StudentFinance(Base):
    __tablename__ = "student_finances"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    total_due = Column(Float, default=0.0)
    total_paid = Column(Float, default=0.0)
    due_date = Column(DateTime, nullable=True)
    is_defaulter = Column(Boolean, default=False)
    payment_plan_active = Column(Boolean, default=False)
    last_payment_date = Column(DateTime, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
