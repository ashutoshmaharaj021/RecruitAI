from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.job_model import Job
from app.models.resume_model import Resume
from app.models.user_model import User
from app.schemas.candidate_ranking import (
    CandidateProfileResponse,
    CandidateRankingResponse,
    CandidateRankingResult,
)
from app.security.roles import require_role
from app.matching.matcher import calculate_skill_match


router = APIRouter(
    prefix="/matching",
    tags=["Candidate Ranking"],
)


@router.get(
    "/jobs/{job_id}/candidates",
    response_model=CandidateRankingResponse,
)
def rank_candidates_for_job(
    job_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    """
    Find and rank candidate resumes for a recruiter's job.
    """

    # 1. Find the job and verify recruiter ownership
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == current_user.id,
        )
        .first()
    )

    if job is None:
        # We intentionally return 404 for both:
        # - job does not exist
        # - job belongs to another recruiter
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    # 2. Get all candidate resumes
    resumes = (
        db.query(Resume)
        .join(User, Resume.user_id == User.id)
        .filter(User.role == "candidate")
        .all()
    )

    ranked_candidates = []

    # 3. Match every candidate resume against the selected job
    for resume in resumes:
        result = calculate_skill_match(
            resume_skills=resume.skills or "",
            required_skills=job.required_skills or "",
        )

        ranked_candidates.append(
            CandidateRankingResult(
                resume_id=resume.id,
                candidate_name=resume.name,
                candidate_email=resume.email,
                match_score=result["match_score"],
                matched_skills=result["matched_skills"],
                missing_skills=result["missing_skills"],
                matched_count=result["matched_count"],
                required_count=result["required_count"],
            )
        )

    # 4. Sort candidates by match score
    ranked_candidates.sort(
        key=lambda candidate: candidate.match_score,
        reverse=True,
    )

    # 5. Return ranked candidates
    return CandidateRankingResponse(
        job_id=job.id,
        candidates=ranked_candidates,
    )

@router.get(
    "/candidates/{resume_id}",
    response_model=CandidateProfileResponse,
)
def get_candidate_profile(
    resume_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    """
    Get candidate profile information for a recruiter.
    """

    resume = (
        db.query(Resume)
        .join(User, Resume.user_id == User.id)
        .filter(
            Resume.id == resume_id,
            User.role == "candidate",
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    skills = []

    if resume.skills:
        skills = [
            skill.strip()
            for skill in resume.skills.split(",")
            if skill.strip()
        ]

    return CandidateProfileResponse(
        resume_id=resume.id,
        candidate_name=resume.name,
        candidate_email=resume.email,
        candidate_phone=resume.phone,
        skills=skills,
        filename=resume.filename,
    )