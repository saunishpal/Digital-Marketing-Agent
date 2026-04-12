from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import get_db
from db_models import UserDB
from services.auth_service import decode_access_token

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


class EnvAdminUser:
    id = 0
    email = ADMIN_EMAIL or "admin@marketmind.com"
    full_name = "Platform Admin"
    role = "admin"
    package_name = "agency"
    is_active = True


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = decode_access_token(token)

    if not user_id:
      raise HTTPException(status_code=401, detail="Invalid or expired token")

    if user_id == "admin-env-user":
        return EnvAdminUser()

    try:
        user_id_int = int(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token subject")

    user = db.query(UserDB).filter(UserDB.id == user_id_int).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user