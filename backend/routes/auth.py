from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import get_db
from db_models import UserDB
from models.schemas import UserRegisterRequest, UserLoginRequest
from services.auth_service import hash_password, verify_password, create_access_token

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Auth"])

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


@router.post("/register")
def register_user(data: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="This email is already registered")

    user = UserDB(
        email=data.email,
        full_name=data.full_name.strip(),
        hashed_password=hash_password(data.password),
        role="user",
        package_name="starter",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Account created successfully"}


@router.post("/login")
def login_user(data: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Contact admin")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "package_name": user.package_name,
            "is_active": user.is_active,
        },
    }


@router.post("/admin-login")
def admin_login(data: UserLoginRequest):
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        raise HTTPException(status_code=500, detail="Admin credentials not configured in .env")

    if data.email != ADMIN_EMAIL or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    access_token = create_access_token("admin-env-user")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": 0,
            "email": ADMIN_EMAIL,
            "full_name": "Platform Admin",
            "role": "admin",
            "package_name": "agency",
            "is_active": True,
        },
    }