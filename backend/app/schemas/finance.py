from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class InvoiceBase(BaseModel):
    title: str
    amount: float
    due_date: datetime
    student_id: int
    challan_number: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: int
    status: str
    tenant_id: int
    class Config:
        from_attributes = True

class ScholarshipBase(BaseModel):
    scheme_name: str
    amount_awarded: float
    academic_year: str

class ScholarshipCreate(ScholarshipBase):
    student_id: int

class Scholarship(ScholarshipBase):
    id: int
    student_id: int
    status: str
    tenant_id: int
    class Config:
        from_attributes = True

class TransactionChallanBase(BaseModel):
    invoice_id: int
    payment_mode: str
    amount_paid: float
    challan_ref: str

class TransactionChallanCreate(TransactionChallanBase):
    pass

class TransactionChallan(TransactionChallanBase):
    id: int
    payment_date: datetime
    receipt_url: Optional[str] = None
    tenant_id: int
    class Config:
        from_attributes = True
