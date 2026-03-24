import io
import re
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from pypdf import PdfReader

from app.core.database import get_db
from app.api import deps
from app.models.domain import Exam, ExamQuestion, ExamAttempt, ExamAnswer

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

class ExamBase(BaseModel):
    title: str
    course_id: int
    duration_minutes: int = 60
    total_marks: int = 100

@router.post("/upload-pdf")
async def upload_exam_pdf(
    title: str = Form(...),
    course_id: int = Form(...),
    duration_minutes: int = Form(60),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Exam Cell Service: Upload a question paper PDF, automatically extract questions,
    and provision a digital examination hall.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n"
        
        # Simple extraction logic: Look for Q1, Q2... or 1., 2....
        # Pattern: Question followed by options a, b, c, d
        questions_found = []
        
        # This regex looks for: 
        # (Digit or Q+Digit) + dot/paren + Question Text
        # then captures options a), b), c), d)
        pattern = r"(?P<q_num>(?:Q)?\d+[\.\)])\s*(?P<question>.*?)(?=a[\.\)]|b[\.\)]|c[\.\)]|d[\.\)]|\d+[\.\)]|Q\d+[\.\)]|$)"
        # Note: This is a simplistic extractor. In production, we'd use more robust NLP or specific markers.
        
        # Let's try a split-based approach for more reliability on common formats
        raw_chunks = re.split(r"(\d+[\.\)])", full_text)
        
        # Create the Exam record first
        exam = Exam(
            title=title,
            course_id=course_id,
            duration_minutes=duration_minutes,
            total_marks=0, # Will update based on questions
            tenant_id=current_user.tenant_id,
            status="scheduled"
        )
        db.add(exam)
        db.flush()

        current_q = ""
        current_options = {}
        
        # Heuristic parser
        lines = full_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Start of a new question? (e.g., "1. What is...")
            if re.match(r"^\d+[\.\)]", line):
                if current_q.strip():
                    # Save previous
                    q_obj = ExamQuestion(
                        exam_id=exam.id,
                        question_text=current_q,
                        option_a=current_options.get('a', 'Option A'),
                        option_b=current_options.get('b', 'Option B'),
                        option_c=current_options.get('c', 'Option C'),
                        option_d=current_options.get('d', 'Option D'),
                        correct_option='a', # UI should let them fix this, defaulting to 'a'
                        marks=1
                    )
                    db.add(q_obj)
                    exam.total_marks += 1
                
                current_q = re.sub(r"^\d+[\.\)]", "", line).strip()
                current_options = {}
            elif current_q:
                # Check for options
                opt_match = re.match(r"^([a-d])[\.\)]\s*(.*)", line, re.IGNORECASE)
                if opt_match:
                    current_options[opt_match.group(1).lower()] = opt_match.group(2).strip()
                else:
                    # Append to current question text if it's not an option
                    current_q += " " + line

        # Final question
        if current_q:
            q_obj = ExamQuestion(
                exam_id=exam.id,
                question_text=current_q,
                option_a=current_options.get('a', 'Option A'),
                option_b=current_options.get('b', 'Option B'),
                option_c=current_options.get('c', 'Option C'),
                option_d=current_options.get('d', 'Option D'),
                correct_option='a',
                marks=1
            )
            db.add(q_obj)
            exam.total_marks += 1

        db.commit()
        db.refresh(exam)

        return {
            "message": "Exam provisioned successfully from PDF.",
            "exam_id": exam.id,
            "questions_count": len(exam.questions),
            "total_marks": exam.total_marks
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"PDF Processing Failed: {str(e)}")

@router.get("/")
def list_exams(db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(Exam).filter(Exam.tenant_id == current_user.tenant_id).all()

@router.get("/{exam_id}/questions")
def get_exam_questions(exam_id: int, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    return db.query(ExamQuestion).filter(ExamQuestion.exam_id == exam_id).all()

@router.post("/attempts")
def create_attempt(payload: dict, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    attempt = ExamAttempt(
        exam_id=payload['exam_id'],
        student_id=payload['student_id'],
        tenant_id=current_user.tenant_id,
        status="in_progress"
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

@router.post("/attempts/answers")
def save_answer(payload: dict, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    # Check if answer exists and update, or create new
    ans = db.query(ExamAnswer).filter(
        ExamAnswer.attempt_id == payload['attempt_id'],
        ExamAnswer.question_id == payload['question_id']
    ).first()
    
    q = db.query(ExamQuestion).get(payload['question_id'])
    is_correct = (payload['selected_option'] == q.correct_option)
    
    if ans:
        ans.selected_option = payload['selected_option']
        ans.is_correct = is_correct
    else:
        ans = ExamAnswer(
            attempt_id=payload['attempt_id'],
            question_id=payload['question_id'],
            selected_option=payload['selected_option'],
            is_correct=is_correct,
            tenant_id=current_user.tenant_id
        )
        db.add(ans)
    
    db.commit()
    return {"status": "saved"}

@router.post("/attempts/{attempt_id}/finish")
def finish_attempt(attempt_id: int, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    attempt = db.query(ExamAttempt).get(attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    # Calculate score
    answers = db.query(ExamAnswer).filter(ExamAnswer.attempt_id == attempt_id).all()
    # To include weightage:
    score = 0
    for ans in answers:
        if ans.is_correct:
            q = db.query(ExamQuestion).get(ans.question_id)
            score += q.marks
            
    attempt.score = score
    attempt.status = "completed"
    attempt.end_time = datetime.now()
    db.commit()
    return {"score": score}
