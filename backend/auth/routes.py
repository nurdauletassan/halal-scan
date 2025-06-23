from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from . import schemas, models, crud, utils, database
from jose import JWTError, jwt
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

# Dependency

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    verification_code = utils.generate_verification_code()
    db_user = crud.create_user(db, user, verification_code)
    # Отправка письма
    utils.send_email(
        db_user.email,
        "Verify your email",
        f"Verification code: {verification_code}"
    )
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not utils.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    access_token = utils.create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(minutes=utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-email")
def verify_email(data: schemas.EmailVerification, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.verification_token == data.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
    crud.update_user_verification(db, user, True)
    return {"message": "Email verified"}

@router.post("/resend-verification")
def resend_verification(data: schemas.ResendVerification, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    verification_token = utils.generate_verification_code()
    user.verification_token = verification_token
    db.commit()
    utils.send_email(
        user.email,
        "Verify your email",
        f"Verification code: {verification_token}"
    )
    return {"message": "Verification email resent"}

@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    reset_token = utils.generate_token()
    crud.set_reset_token(db, user, reset_token)
    utils.send_email(
        user.email,
        "Reset your password",
        f"Reset token: {reset_token}"
    )
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.reset_token == data.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")
    crud.reset_password(db, user, data.new_password)
    return {"message": "Password reset successful"} 