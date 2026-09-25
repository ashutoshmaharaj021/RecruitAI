from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.candidate_profile_model import CandidateProfile
from app.models.recruiter_profile_model import RecruiterProfile
from app.models.user_model import User

from app.schemas.profile import (
    CandidateProfileResponse,
    CandidateProfileUpdate,
)

from app.schemas.recruiter_profile import (
    RecruiterProfileResponse,
    RecruiterProfileUpdate,
)

from app.security.auth import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get("")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ---------------------------------
    # Candidate Profile
    # ---------------------------------
    if current_user.role == "candidate":

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
            github_url=(
                str(profile.github_url)
                if profile.github_url
                else None
            ),
            linkedin_url=(
                str(profile.linkedin_url)
                if profile.linkedin_url
                else None
            ),
            portfolio_url=(
                str(profile.portfolio_url)
                if profile.portfolio_url
                else None
            ),
        )

    # ---------------------------------
    # Recruiter Profile
    # ---------------------------------
    if current_user.role == "recruiter":

        profile = (
            db.query(RecruiterProfile)
            .filter(RecruiterProfile.user_id == current_user.id)
            .first()
        )

        if profile is None:
            profile = RecruiterProfile(
                user_id=current_user.id
            )

            db.add(profile)
            db.commit()
            db.refresh(profile)

        return RecruiterProfileResponse(
            user_id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            role=current_user.role,
            company=profile.company,
            job_title=profile.job_title,
            location=profile.location,
            bio=profile.bio,
            company_website=profile.company_website,
            linkedin_url=profile.linkedin_url,
        )

@router.put("")
def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ---------------------------------
    # Candidate Profile
    # ---------------------------------
    if current_user.role == "candidate":

        candidate_data = CandidateProfileUpdate(**profile_data)

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

        profile.phone = candidate_data.phone
        profile.date_of_birth = candidate_data.date_of_birth
        profile.location = candidate_data.location
        profile.bio = candidate_data.bio

        profile.college = candidate_data.college
        profile.course = candidate_data.course
        profile.branch = candidate_data.branch
        profile.current_year = candidate_data.current_year
        profile.graduation_year = candidate_data.graduation_year
        profile.cgpa = candidate_data.cgpa

        profile.github_url = (
            str(candidate_data.github_url)
            if candidate_data.github_url
            else None
        )

        profile.linkedin_url = (
            str(candidate_data.linkedin_url)
            if candidate_data.linkedin_url
            else None
        )

        profile.portfolio_url = (
            str(candidate_data.portfolio_url)
            if candidate_data.portfolio_url
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

    # ---------------------------------
    # Recruiter Profile
    # ---------------------------------
    if current_user.role == "recruiter":

        recruiter_data = RecruiterProfileUpdate(**profile_data)

        profile = (
            db.query(RecruiterProfile)
            .filter(RecruiterProfile.user_id == current_user.id)
            .first()
        )

        if profile is None:
            profile = RecruiterProfile(
                user_id=current_user.id
            )
            db.add(profile)

        profile.company = recruiter_data.company
        profile.job_title = recruiter_data.job_title
        profile.location = recruiter_data.location
        profile.bio = recruiter_data.bio

        profile.company_website = (
            str(recruiter_data.company_website)
            if recruiter_data.company_website
            else None
        )

        profile.linkedin_url = (
            str(recruiter_data.linkedin_url)
            if recruiter_data.linkedin_url
            else None
        )

        db.commit()
        db.refresh(profile)

        return RecruiterProfileResponse(
            user_id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            role=current_user.role,
            company=profile.company,
            job_title=profile.job_title,
            location=profile.location,
            bio=profile.bio,
            company_website=profile.company_website,
            linkedin_url=profile.linkedin_url,
        )