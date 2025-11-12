from fastapi import APIRouter, HTTPException, status
from passlib.hash import bcrypt
from backend.models.user import User
from backend.database.db import db
from backend.utils.jwt_handler import create_access_token
from pydantic import BaseModel

# Separate models for request/response
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):
    # Check if username already exists
    existing_username = await db["users"].find_one({"username": user.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already exists"
        )
    
    # Check if email already exists
    existing_email = await db["users"].find_one({"email": user.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )

    # Hash password
    hashed_password = bcrypt.hash(user.password)
    
    # Create new user document
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }
    
    result = await db["users"].insert_one(new_user)
    
    return {
        "message": "User created successfully!",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
async def login(user: UserLogin):
    # Find user by email
    db_user = await db["users"].find_one({"email": user.email})
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    # Verify password
    if not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )

    # Create access token with user info
    token = create_access_token({
        "sub": db_user["email"],
        "username": db_user["username"],
        "user_id": str(db_user["_id"])
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": db_user["username"]
    }