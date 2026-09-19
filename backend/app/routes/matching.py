from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.job_model import Job
from app.models.resume_model import Resume
from app.models.user_model import User
from app.schemas.matching import MatchingResponse
from app.security.auth import get_current_user
from app.matching.matcher import calculate_skill_match


router = APIRouter(
    prefix="/matching",
    tags=["Matching"],
)


@router.get(
    "/jobs/{job_id}/resumes/{resume_id}",
    response_model=MatchingResponse,
)
def match_resume_with_job(
    job_id: int,
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Compare a resume against a job description.

    Candidates can only use their own resumes.
    Recruiters can only use their own jobs.
    """

    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # Candidate ownership check
    if current_user.role == "candidate":
        if resume.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resume",
            )

    # Recruiter ownership check
    elif current_user.role == "recruiter":
        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this job",
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user role",
        )

    result = calculate_skill_match(
        resume_skills=resume.skills or "",
        required_skills=job.required_skills or "",
    )

    return MatchingResponse(
        resume_id=resume.id,
        job_id=job.id,
        match_score=result["match_score"],
        matched_skills=result["matched_skills"],
        missing_skills=result["missing_skills"],
        matched_count=result["matched_count"],
        required_count=result["required_count"],
    )