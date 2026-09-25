from pydantic import BaseModel, HttpUrl
from typing import Optional


class RecruiterProfileUpdate(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    company_website: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None


class RecruiterProfileResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role: str

    company: Optional[str] = None
    job_title: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    company_website: Optional[str] = None
    linkedin_url: Optional[str] = None

    class Config:
        from_attributes = True