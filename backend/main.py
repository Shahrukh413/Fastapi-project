from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_route import router as auth_router  # or your routes
# from routes.book_route import router as book_router  # optional

# ✅ 1️⃣ Create the FastAPI app FIRST
app = FastAPI()

# ✅ 2️⃣ Then add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev, allow all; restrict later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 3️⃣ Now include your routers
app.include_router(auth_router, prefix="/api/auth")
# app.include_router(book_router, prefix="/api/books")

# ✅ 4️⃣ Root route (for testing)
@app.get("/")
def root():
    return {"message": "Backend is running!"}
