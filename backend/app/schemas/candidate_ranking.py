from pydantic import BaseModel


class CandidateRankingResult(BaseModel):
    resume_id: int
    candidate_name: str | None
    candidate_email: str | None

    match_score: float

    matched_skills: list[str]
    missing_skills: list[str]

    matched_count: int
    required_count: int


class CandidateRankingResponse(BaseModel):
    job_id: int
    candidates: list[CandidateRankingResult]


class CandidateProfileResponse(BaseModel):
    resume_id: int
    candidate_name: str | None
    candidate_email: str | None
    candidate_phone: str | None
    skills: list[str]
    filename: str | None