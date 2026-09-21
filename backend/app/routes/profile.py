from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.candidate_profile_model import CandidateProfile
from app.models.user_model import User
from app.schemas.profile import (
    CandidateProfileResponse,
    CandidateProfileUpdate,
)
from app.security.roles import require_role


router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get(
    "",
    response_model=CandidateProfileResponse,
)
def get_candidate_profile(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .first()
    )

    if profile is None:
        profile = CandidateProfile(
            user_id=current_user.id
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

    return CandidateProfileResponse(
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        phone=profile.phone,
        date_of_birth=profile.date_of_birth,
        location=profile.location,
        bio=profile.bio,
        college=profile.college,
        course=profile.course,
        branch=profile.branch,
        current_year=profile.current_year,
        graduation_year=profile.graduation_year,
        cgpa=profile.cgpa,
        github_url=str(profile.github_url) if profile.github_url else None,
        linkedin_url=str(profile.linkedin_url)
        if profile.linkedin_url
        else None,
        portfolio_url=str(profile.portfolio_url)
        if profile.portfolio_url
        else None,
    )


@router.put(
    "",
    response_model=CandidateProfileResponse,
)
def update_candidate_profile(
    profile_data: CandidateProfileUpdate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .first()
    )

    if profile is None:
        profile = CandidateProfile(
            user_id=current_user.id
        )
        db.add(profile)

    profile.phone = profile_data.phone
    profile.date_of_birth = profile_data.date_of_birth
    profile.location = profile_data.location
    profile.bio = profile_data.bio

    profile.college = profile_data.college
    profile.course = profile_data.course
    profile.branch = profile_data.branch
    profile.current_year = profile_data.current_year
    profile.graduation_year = profile_data.graduation_year
    profile.cgpa = profile_data.cgpa

    profile.github_url = (
        str(profile_data.github_url)
        if profile_data.github_url
        else None
    )

    profile.linkedin_url = (
        str(profile_data.linkedin_url)
        if profile_data.linkedin_url
        else None
    )

    profile.portfolio_url = (
        str(profile_data.portfolio_url)
        if profile_data.portfolio_url
        else None
    )

    db.commit()
    db.refresh(profile)

    return CandidateProfileResponse(
        user_id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        phone=profile.phone,
        date_of_birth=profile.date_of_birth,
        location=profile.location,
        bio=profile.bio,
        college=profile.college,
        course=profile.course,
        branch=profile.branch,
        current_year=profile.current_year,
        graduation_year=profile.graduation_year,
        cgpa=profile.cgpa,
        github_url=profile.github_url,
        linkedin_url=profile.linkedin_url,
        portfolio_url=profile.portfolio_url,
    )