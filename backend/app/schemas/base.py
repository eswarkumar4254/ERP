from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: Optional[str] = None
    tenant_id: int

class TokenData(BaseModel):
    email: Optional[str] = None
    tenant_id: Optional[int] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    role: str = "student"
    tenant_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class ModuleSchema(BaseModel):
    name: str
    full_name: Optional[str]
    class Config:
        from_attributes = True

class PlanSchema(BaseModel):
    name: str
    max_students: Optional[int] = 0
    max_roles: Optional[int] = 5
    price: Optional[float] = 0.0
    modules: List[ModuleSchema] = []
    class Config:
        from_attributes = True

class TenantBase(BaseModel):
    name: str
    domain: str

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    primary_color: Optional[str] = None
    pan_number: Optional[str] = None
    registration_id: Optional[str] = None
    contact_email: Optional[str] = None

class Tenant(TenantBase):
    id: int
    is_active: bool
    created_at: datetime
    primary_color: Optional[str] = None
    pan_number: Optional[str] = None
    registration_id: Optional[str] = None
    contact_email: Optional[str] = None
    plan: Optional[PlanSchema] = None
    
    class Config:
        from_attributes = True

class StaffCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    employee_id: str
    department_id: int
    designation: str # dean, hod, faculty, deo
    role: str # institution_admin, faculty, staff, dean, hod etc

class CoursePreferenceCreate(BaseModel):
    course_id: int
    priority: int
    semester: int
    academic_year: str

class CourseAssignmentCreate(BaseModel):
    staff_id: int
    course_id: int
    semester: int
    academic_year: str
