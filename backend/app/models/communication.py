from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    room_type = Column(String) # public, private, department, course
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("chat_rooms.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class DocumentVault(Base):
    __tablename__ = "document_vault"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String) # S3 Path
    file_type = Column(String)
    version = Column(Integer, default=1)
    ocr_content = Column(Text, nullable=True) # OCR search support
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_public = Column(Boolean, default=False)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
