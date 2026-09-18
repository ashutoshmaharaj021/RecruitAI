from datetime import datetime

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    company: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=10)
    required_skills: str = Field(min_length=2)


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    company: str
    description: str
    required_skills: str
    created_at: datetime

    class Config:
        from_attributes = True