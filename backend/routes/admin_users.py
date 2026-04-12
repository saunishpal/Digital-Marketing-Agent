from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from db_models import UserDB
from models.schemas import UserPackageUpdateRequest, UserStatusUpdateRequest

router = APIRouter(prefix="/api/admin-users", tags=["Admin Users"])


@router.get("/all")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserDB).order_by(UserDB.id.desc()).all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "package_name": user.package_name,
            "is_active": user.is_active,
        }
        for user in users
    ]


@router.put("/{user_id}/package")
def update_user_package(
    user_id: int,
    data: UserPackageUpdateRequest,
    db: Session = Depends(get_db),
):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.package_name = data.package_name
    db.commit()
    db.refresh(user)

    return {
        "message": "User package updated successfully",
        "user": {
            "id": user.id,
            "package_name": user.package_name,
        },
    }


@router.put("/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UserStatusUpdateRequest,
    db: Session = Depends(get_db),
):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = data.is_active
    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "user": {
            "id": user.id,
            "is_active": user.is_active,
        },
    }