from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

# Many-to-Many Relationships with extend_existing=True to prevent re-definition errors
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id")),
    Column("permission_id", Integer, ForeignKey("permissions.id")),
    extend_existing=True
)

role_modules = Table(
    "role_modules",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id")),
    Column("module_id", Integer, ForeignKey("modules.id")),
    extend_existing=True
)

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g., HMS, LMS, SMS
    full_name = Column(String) # e.g., Hostel Management System
    description = Column(String)
    
    roles = relationship("Role", secondary=role_modules, back_populates="modules")

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g., mark_attendance, create_user
    description = Column(String)
    
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # Removed unique=True to allow same role name in different tenants
    description = Column(String)
    is_system = Column(Boolean, default=False) # e.g., super_admin, institution_admin
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True) # Null for global roles
    
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    modules = relationship("Module", secondary=role_modules, back_populates="roles")
    users = relationship("User", back_populates="roles_link")
