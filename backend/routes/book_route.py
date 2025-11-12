from fastapi import APIRouter, Depends, HTTPException
from utils.jwt_handler import get_current_user
from database import db
from typing import List

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.post("/", summary="Add a book (protected)")
async def add_book(book: dict, payload: dict = Depends(get_current_user)):
    # book is any dict with title/author etc.
    book["owner_email"] = payload.get("email")
    res = await db.books.insert_one(book)
    return {"id": str(res.inserted_id)}

@router.get("/", summary="List books for the owner")
async def list_books(payload: dict = Depends(get_current_user)):
    owner = payload.get("email")
    docs = await db.books.find({"owner_email": owner}).to_list(100)
    # remove _id object for JSON friendliness (if you prefer include, convert to str)
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

@router.delete("/{book_id}", summary="Delete a book (owner only)")
async def delete_book(book_id: str, payload: dict = Depends(get_current_user)):
    from bson import ObjectId
    owner = payload.get("email")
    res = await db.books.delete_one({"_id": ObjectId(book_id), "owner_email": owner})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found or not allowed")
    return {"deleted": book_id}
