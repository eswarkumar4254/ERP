import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.academic import Student
from app.models.user import User

def fix_student_user_links():
    db = SessionLocal()
    try:
        # Get all students without user_id
        students = db.query(Student).filter(Student.user_id == None).all()
        print(f"Found {len(students)} students to link.")
        
        for student in students:
            # Find user with matching email
            user = db.query(User).filter(User.email == student.contact_email).first()
            if user:
                student.user_id = user.id
                print(f"Linked student {student.first_name} {student.last_name} to user {user.email}")
            else:
                print(f"No user found for student {student.contact_email}")
        
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_student_user_links()
