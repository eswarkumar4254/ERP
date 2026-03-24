from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.accounting import LedgerAccount, PurchaseOrder, Vendor
from app.models.finance import Invoice, Scholarship, TransactionChallan
from app.repositories.base import BaseRepository
from app.schemas.finance import (
    Invoice as InvoiceSchema, Scholarship as ScholarshipSchema,
    TransactionChallan as ChallanSchema, TransactionChallanCreate
)

router = APIRouter(dependencies=[Depends(deps.requires_service("FMS"))])

ledger_repo = BaseRepository(LedgerAccount)
invoice_repo = BaseRepository(Invoice)
scholarship_repo = BaseRepository(Scholarship)
challan_repo = BaseRepository(TransactionChallan)

@router.get("/accounts")
def read_ledger_accounts(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    return ledger_repo.get_multi(db, user=current_user)

# Student Invoices (Fees)
@router.get("/invoices", response_model=List[InvoiceSchema])
def read_invoices(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    return invoice_repo.get_multi(db, user=current_user)

# Scholarships
@router.get("/scholarships", response_model=List[ScholarshipSchema])
def read_scholarships(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    return scholarship_repo.get_multi(db, user=current_user)

# Payment Challans
@router.post("/challans", response_model=ChallanSchema)
def post_challan(
    *,
    db: Session = Depends(get_db),
    obj_in: TransactionChallanCreate,
    current_user = Depends(deps.get_current_user)
):
    """Post a bank challan or online payment receipt."""
    # Logic to update invoice status after challan posting
    challan = challan_repo.create(db, obj_in=obj_in, tenant_id=current_user.tenant_id)
    
    invoice = db.query(Invoice).filter(Invoice.id == obj_in.invoice_id).first()
    if invoice:
        invoice.status = "paid"
        invoice.challan_number = obj_in.challan_ref
        db.commit()
        
    return challan

@router.get("/procurement/orders")
def read_purchase_orders(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_admin)
):
    return db.query(PurchaseOrder).filter(PurchaseOrder.tenant_id == current_user.tenant_id).all()
