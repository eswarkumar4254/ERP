import sys
import os

# Set Python path to include current directory
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.user import User
from app.models.rbac import Role
from sqlalchemy import or_

db = SessionLocal()
try:
    user = db.query(User).filter(User.email == "nimmi@gmail.com").first()
    if user:
        print(f"User found: {user.email}, tenant_id: {user.tenant_id}")
        roles = db.query(Role).filter(
            or_(Role.tenant_id == user.tenant_id, Role.tenant_id == None)
        ).all()
        print(f"Roles available: {[r.name for r in roles]}")
    else:
        print("User nimmi@gmail.com not found. Checking all roles:")
        roles = db.query(Role).all()
        print(f"All roles in DB: {[r.name for r in roles]}")
finally:
    db.close()
