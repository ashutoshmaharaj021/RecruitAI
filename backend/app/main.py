from fastapi import FastAPI  # type: ignore[import]
from app.routes.upload import router as upload_router
from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.matching import router as matching_router
from app.routes.candidate_ranking import router as candidate_ranking_router

from app.database.db import engine, Base
from app.models.resume_model import Resume
from app.models.user_model import User
from app.models.job_model import Job

from fastapi.middleware.cors import CORSMiddleware
     
app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(matching_router)
app.include_router(candidate_ranking_router)

@app.get("/")
def root():
    return {"message": "Resume Parser API Running"}

