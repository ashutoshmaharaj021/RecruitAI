from pydantic import BaseModel


class MatchingResponse(BaseModel):
    resume_id: int
    job_id: int

    match_score: float

    matched_skills: list[str]
    missing_skills: list[str]

    matched_count: int
    required_count: int