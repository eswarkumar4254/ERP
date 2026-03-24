from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.api import deps
from app.models.tenant import Tenant, Plan, SaasInvoice
from app.models.user import User
from datetime import datetime, timedelta
from fastapi_cache.decorator import cache
import random

router = APIRouter()

@router.get("/analytics/overview")
@cache(expire=60)
def get_global_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_super_admin)
):
    """Platform-wide analytics for Super Admin."""
    total_tenants = db.query(Tenant).count()
    total_users = db.query(User).count()
    
    # Mocking some trend data since we don't have full historical tracking in this simple schema yet
    # In a real app, these would come from audit logs or time-series DBs
    return {
        "kpis": [
            {"label": "Total Active Users", "value": f"{total_users:,}", "change": "+12.4%", "up": True, "color": "var(--primary-color)", "icon": "Users", "sub": "Across all tenants"},
            {"label": "API Requests / Day", "value": "6.2M", "change": "+8.1%", "up": True, "color": "var(--secondary-color)", "icon": "Activity", "sub": "Avg last 24h"},
            {"label": "Avg Response Time", "value": "142ms", "change": "-18ms", "up": True, "color": "#10b981", "icon": "Clock", "sub": "P95 latency"},
            {"label": "Platform Uptime", "value": "99.98%", "change": "+0.01%", "up": True, "color": "#f59e0b", "icon": "Server", "sub": "SLA target: 99.9%"},
            {"label": "Data Processed", "value": "18.7 TB", "change": "+22%", "up": True, "color": "#ec4899", "icon": "Database", "sub": "Total this month"},
            {"label": "Active Tenants", "value": str(total_tenants), "change": "+3", "up": True, "color": "#8b5cf6", "icon": "Layers", "sub": "New this month"},
        ],
        "resource_metrics": [
            {"label": "CPU Utilization", "value": 42, "color": "var(--primary-color)", "icon": "Cpu"},
            {"label": "Memory Usage", "value": 61, "color": "#8b5cf6", "icon": "HardDrive"},
            {"label": "Storage Consumed", "value": 38, "color": "#10b981", "icon": "Database"},
            {"label": "Network Bandwidth", "value": 55, "color": "#f59e0b", "icon": "Zap"},
        ],
        "bar_data": [random.randint(50, 95) for _ in range(12)]
    }

@router.get("/billing/overview")
@cache(expire=60)
def get_saas_billing(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_super_admin)
):
    """Revenue and subscription analytics."""
    # Fetch full plan catalog
    all_plans = db.query(Plan).all()
    plans_data = []
    
    # Calculate MRR based on active tenants
    active_tenants = db.query(Tenant).join(Plan).all()
    mrr = sum([t.plan.price for t in active_tenants if t.plan])
    
    for p in all_plans:
        tenant_count = db.query(Tenant).filter(Tenant.subscription_plan_id == p.id).count()
        plans_data.append({
            "id": p.id,
            "name": p.name,
            "price": f"₹{p.price:,.0f}",
            "max_students": p.max_students,
            "features": p.features if isinstance(p.features, list) else [],
            "tenants": tenant_count,
            "revenue": f"₹{(p.price * tenant_count / 100000):.1f}L/mo",
            "period": "/mo per institution",
            "color": "var(--primary-color)" if "Nexus" in p.name else "#8b5cf6" if "Premium" in p.name else "#6b7280"
        })

    invoices_db = db.query(SaasInvoice).join(Tenant).all()
    invoices_data = []
    
    for inv in invoices_db:
        invoices_data.append({
            "id": inv.id,
            "tenant": inv.tenant.name if inv.tenant else "Unknown",
            "plan": inv.plan_name,
            "amount": f"₹{inv.amount:,.0f}",
            "date": inv.issue_date.strftime("%d %b %Y") if inv.issue_date else datetime.now().strftime("%d %b %Y"),
            "due": inv.due_date.strftime("%d %b %Y") if inv.due_date else (datetime.now() + timedelta(days=15)).strftime("%d %b %Y"),
            "status": inv.status
        })

    return {
        "mrr": f"₹{(mrr / 100000):.1f}L",
        "arr": f"₹{(mrr * 12 / 10000000):.2f}Cr",
        "stats": [
            {"label": "MRR (Monthly Recurring)", "value": f"₹{(mrr / 100000):.1f}L", "change": "+0.0%", "up": True, "color": "#10b981", "icon": "TrendingUp", "sub": "Live MRR"},
            {"label": "ARR (Annual Run Rate)", "value": f"₹{(mrr * 12 / 10000000):.2f}Cr", "change": "+0.0%", "up": True, "color": "var(--primary-color)", "icon": "BarChart3", "sub": "Projected ARR"},
            {"label": "Net Revenue (Period)", "value": f"₹{(sum([inv.amount for inv in invoices_db if inv.status == 'PAID']) / 100000):.1f}L", "change": "0.0%", "up": True, "color": "#f59e0b", "icon": "DollarSign", "sub": "Direct from Ledger"},
            {"label": "Churn Rate", "value": "0.0%", "change": "0.0%", "up": True, "color": "#ec4899", "icon": "TrendingDown", "sub": "Healthy"},
        ],
        "plans": plans_data,
        "revenue_trend": [0] * 12, # In a real app, this would be grouped by month
        "invoices": invoices_data
    }
