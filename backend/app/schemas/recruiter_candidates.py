from pydantic import BaseModel


class RecruiterCandidateResponse(BaseModel):
    id: int
    user_id: int
    name: str | None
    email: str | None
    phone: str | None
    skills: str | None
    filename: str | None

    class Config:
        from_attributes = True