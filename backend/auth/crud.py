from sqlalchemy.orm import Session
from . import models, schemas, utils
from typing import Optional

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate, verification_token: str) -> models.User:
    hashed_password = utils.hash_password(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password,
        verification_token=verification_token,
        is_active=True,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_verification(db: Session, user: models.User, is_verified: bool):
    user.is_verified = is_verified
    user.verification_token = None
    db.commit()
    db.refresh(user)
    return user

def set_reset_token(db: Session, user: models.User, reset_token: str):
    user.reset_token = reset_token
    db.commit()
    db.refresh(user)
    return user

def reset_password(db: Session, user: models.User, new_password: str):
    user.password_hash = utils.hash_password(new_password)
    user.reset_token = None
    db.commit()
    db.refresh(user)
    return user 