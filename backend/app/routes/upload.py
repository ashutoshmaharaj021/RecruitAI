from app.database.db import SessionLocal
from app.models.resume_model import Resume

from fastapi import APIRouter, UploadFile, File
import fitz
import os

from app.parsers.resume_parser import parse_resume

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text from PDF
    text = ""

    pdf = fitz.open(file_path)

    for page in pdf:
        text += page.get_text()

    # Parse resume
    parsed_data = parse_resume(text)

    db = SessionLocal()
    resume = Resume(name=parsed_data["name"],
                    email=parsed_data["email"],
                    phone=parsed_data["phone"],
                    skills=", ".join(parsed_data["skills"]),
                    raw_text=text)

    db.add(resume)
    db.commit()
    print("Resume saved successfully")
    db.refresh(resume)
    db.close()

    return {
        "filename": file.filename,
        "parsed_data": parsed_data,
        "raw_text": text[:2000]
    }
@router.get("/resumes")
def get_resumes():
    db = SessionLocal()

    try:
        resumes = db.query(Resume).all()

        return [
            {
                "id": resume.id,
                "name": resume.name,
                "email": resume.email,
                "phone": resume.phone,
                "skills": resume.skills,
                "raw_text": resume.raw_text
            }
            for resume in resumes
        ]

    finally:
        db.close()