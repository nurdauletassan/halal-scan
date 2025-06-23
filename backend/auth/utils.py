from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import secrets
import random
import string

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Пароли

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Email токены

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def generate_verification_code() -> str:
    return "".join(random.choices(string.digits, k=6))

# Заглушка для отправки email

def send_email(to_email: str, subject: str, body: str):
    print(f"Send email to {to_email}: {subject}\n{body}") 