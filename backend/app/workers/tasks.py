from app.workers.celery_app import celery_app
import time

@celery_app.task
def generate_report_task(report_id: int):
    print(f"Starting report generation for {report_id}...")
    time.sleep(5) # Simulate long work
    print(f"Report {report_id} generated!")
    return True

@celery_app.task
def send_notification_task(user_id: int, message: str):
    print(f"Sending notification to user {user_id}: {message}")
    return True
