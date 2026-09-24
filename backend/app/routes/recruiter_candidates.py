from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.database.db import get_db
from app.models.resume_model import Resume
from app.schemas.recruiter_candidates import RecruiterCandidateResponse
from app.security.roles import require_role

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
)


@router.get(
    "/candidates",
    response_model=list[RecruiterCandidateResponse],
)
def get_candidates(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter")),
):
    candidates = (
        db.query(Resume)
        .order_by(Resume.id.desc())
        .all()
    )

    return candidates


@router.get(
    "/candidates/{candidate_id}",
    response_model=RecruiterCandidateResponse,
)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter")),
):
    candidate = (
        db.query(Resume)
        .filter(Resume.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate resume not found",
        )

    return candidate


@router.get(
    "/candidates/{candidate_id}/resume",
)
def get_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter")),
):
    candidate = (
        db.query(Resume)
        .filter(Resume.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate resume not found",
        )

    if not candidate.filename:
        raise HTTPException(
            status_code=404,
            detail="Original resume file not found",
        )

    file_path = os.path.join("uploads", candidate.filename)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Original resume file not found",
        )

    return FileResponse(
        path=file_path,
        filename=candidate.filename,
        media_type="application/pdf",
    )