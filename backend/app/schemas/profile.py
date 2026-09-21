from datetime import date

from pydantic import BaseModel, Field, HttpUrl


class CandidateProfileUpdate(BaseModel):
    phone: str | None = Field(default=None, max_length=20)
    date_of_birth: date | None = None
    location: str | None = Field(default=None, max_length=150)
    bio: str | None = None

    college: str | None = Field(default=None, max_length=200)
    course: str | None = Field(default=None, max_length=150)
    branch: str | None = Field(default=None, max_length=150)
    current_year: int | None = Field(default=None, ge=1, le=10)
    graduation_year: int | None = Field(default=None, ge=2000, le=2100)
    cgpa: float | None = Field(default=None, ge=0, le=10)

    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    portfolio_url: HttpUrl | None = None


class CandidateProfileResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role: str

    phone: str | None
    date_of_birth: date | None
    location: str | None
    bio: str | None

    college: str | None
    course: str | None
    branch: str | None
    current_year: int | None
    graduation_year: int | None
    cgpa: float | None

    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None

    class Config:
        from_attributes = True