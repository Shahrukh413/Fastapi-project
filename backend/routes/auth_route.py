from fastapi import APIRouter, HTTPException
from models.user import User
from database import db
from utils.jwt_handler import create_access_token
from passlib.hash import bcrypt

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/signup")
async def signup(user: User):
    existing_user = await db["users"].find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = bcrypt.hash(user.password)
    new_user = {"username": user.username, "password": hashed_password}
    await db["users"].insert_one(new_user)
    return {"message": "User created successfully!"}

@router.post("/login")
async def login(user: User):
    db_user = await db["users"].find_one({"username": user.username})
    if not db_user or not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    token = create_access_token({"sub": user.username})
    return {"access_token": token}
