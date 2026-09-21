from datetime import date

from sqlalchemy import Column, Integer, String, Text, Float, Date, ForeignKey
from app.database.db import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    phone = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    location = Column(String(150), nullable=True)
    bio = Column(Text, nullable=True)

    college = Column(String(200), nullable=True)
    course = Column(String(150), nullable=True)
    branch = Column(String(150), nullable=True)
    current_year = Column(Integer, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)

    github_url = Column(String(300), nullable=True)
    linkedin_url = Column(String(300), nullable=True)
    portfolio_url = Column(String(300), nullable=True)