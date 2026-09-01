from fastapi import FastAPI  # type: ignore[import]
from app.routes.upload import router as upload_router

from app.database.db import engine, Base
from app.models.resume_model import Resume

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

@app.get("/")
def root():
    return {"message": "Resume Parser API Running"}

