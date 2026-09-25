from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.db import Base


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    company = Column(String(150), nullable=True)

    job_title = Column(String(150), nullable=True)

    location = Column(String(150), nullable=True)

    bio = Column(Text, nullable=True)

    company_website = Column(String(255), nullable=True)

    linkedin_url = Column(String(255), nullable=True)