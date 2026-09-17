from fastapi import Depends, HTTPException, status

from app.models.user_model import User
from app.security.auth import get_current_user


def require_role(required_role: str):
    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:

        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return current_user

    return role_checker