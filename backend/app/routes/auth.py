from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user_model import User
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    UserResponse,
    GoogleAuthRequest
)
from app.security.password import hash_password, verify_password
from app.security.jwt import create_access_token
from app.security.auth import get_current_user
from app.security.google import verify_google_token


router = APIRouter()


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login_user(
    user_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        user_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db),
):
    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    # Only allow valid application roles
    if user_data.role not in {"candidate", "recruiter"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either candidate or recruiter",
        )

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/google", response_model=LoginResponse)
def google_login(
    google_data: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    google_user = verify_google_token(google_data.credential)

    google_sub = google_user.get("sub")
    email = google_user.get("email")
    name = google_user.get("name") or email.split("@")[0]

    if not google_sub or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account information is incomplete",
        )

    user = (
        db.query(User)
        .filter(User.google_sub == google_sub)
        .first()
    )

    if user:
        access_token = create_access_token(
            {
                "sub": str(user.id),
                "role": user.role,
            }
        )

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user:
        user.google_sub = google_sub
        db.commit()
        db.refresh(user)

        access_token = create_access_token(
            {
                "sub": str(user.id),
                "role": user.role,
            }
        )

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
        )

    if google_data.role not in {"candidate", "recruiter"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either candidate or recruiter",
        )

    new_user = User(
        name=name,
        email=email,
        password_hash=None,
        google_sub=google_sub,
        role=google_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        {
            "sub": str(new_user.id),
            "role": new_user.role,
        }
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
    )