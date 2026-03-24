from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    isbn = Column(String, unique=True, index=True)
    category = Column(String)
    quantity = Column(Integer, default=1)
    available_quantity = Column(Integer, default=1)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class BookIssue(Base):
    __tablename__ = "book_issues"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    issue_date = Column(DateTime, server_default=func.now())
    due_date = Column(DateTime)
    return_date = Column(DateTime, nullable=True)
    status = Column(String, default="issued") # issued, returned, overdue
    fine_amount = Column(Integer, default=0)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class DigitalResource(Base):
    __tablename__ = "digital_resources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String) # Research, Journal, E-Book
    url = Column(String)
    file_type = Column(String, default="PDF")
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class LibrarySeat(Base):
    __tablename__ = "library_seats"
    id = Column(Integer, primary_key=True, index=True)
    seat_identifier = Column(String) # e.g. S-101
    floor = Column(Integer)
    status = Column(String, default="Available") # Available, Occupied, Reserved, Maintenance
    booked_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
