# Sprint 1 - Authentication module implementation
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth, complaints
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Complaint & Maintenance Portal API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(complaints.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Smart Complaint & Maintenance Portal API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
