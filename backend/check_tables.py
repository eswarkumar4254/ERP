from app.core.database import SessionLocal, engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables in DB: {tables}")
if "programs" in tables:
    print("Table 'programs' exists.")
else:
    print("Table 'programs' DOES NOT exist.")
