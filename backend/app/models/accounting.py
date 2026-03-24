from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Date, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    account_type = Column(String) # Asset, Liability, Equity, Revenue, Expense
    balance = Column(Float, default=0)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("ledger_accounts.id"))
    amount = Column(Float)
    transaction_type = Column(String) # debit, credit
    description = Column(String)
    date = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_person = Column(String)
    email = Column(String)
    category = Column(String)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_amount = Column(Float)
    status = Column(String, default="draft") # draft, ordered, received, closed
    created_at = Column(DateTime, server_default=func.now())
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
