from sqlalchemy import create_all, select, func
from app.core.database import SessionLocal
from app.models.user import User
from app.models.academic import Student

db = SessionLocal()
try:
    user_count = db.query(func.count(User.id)).scalar()
    student_count = db.query(func.count(Student.id)).scalar()
    print(f"Users: {user_count}")
    print(f"Students: {student_count}")
    
    if student_count > 0:
        first_student = db.query(Student).first()
        student_user = db.query(User).filter(User.id == first_student.user_id).first()
        print(f"Sample Student: {first_student.first_name} {first_student.last_name}")
        print(f"Enrollment: {first_student.enrollment_number}")
        print(f"User Email: {student_user.email if student_user else 'No User linked'}")
finally:
    db.close()
