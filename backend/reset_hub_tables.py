from app.core.database import SessionLocal, engine, Base
from app.models import curriculum 
from sqlalchemy import text

# Tables to reset for Knowledge Hub
hub_tables = ["curriculums", "departments", "programs", "course_enrollments", "courses"]

with engine.connect() as conn:
    # Disable FK checks temporarily for PG
    conn.execute(text("SET session_replication_role = 'replica';"))
    for table in hub_tables:
        print(f"Dropping {table}...")
        conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE;"))
    conn.execute(text("SET session_replication_role = 'origin';"))
    conn.commit()

# Recreate them
print("Recreating Knowledge Hub tables...")
from app.models import academic
academic.Base.metadata.create_all(bind=engine)
curriculum.Base.metadata.create_all(bind=engine)
print("Done.")
