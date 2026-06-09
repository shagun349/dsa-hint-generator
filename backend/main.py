# main.py
# This is the entry point of your backend
# FastAPI receives requests from the frontend and coordinates
# the classifier and hint engine to produce a response

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from classifier import classify_pattern
from hint_engine import generate_hints
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware — allows your frontend (running on a different port)
# to talk to this backend without getting blocked by the browser
# Without this, your Next.js frontend on port 3000 can't call your
# FastAPI backend on port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model — defines exactly what shape of data the frontend must send
# If the request is missing any field, FastAPI automatically returns an error
# This is your input validation layer
class ProblemRequest(BaseModel):
    problem_text: str
    provider: str = "gemini"  # default to gemini since that's what we have


# Health check endpoint — lets you verify the backend is running
# Just visit http://localhost:8000/ in browser to confirm
@app.get("/")
def root():
    return {"status": "DSA Hint Generator backend is running"}


# Main endpoint — this is what your frontend calls
@app.post("/hint")
async def get_hint(request: ProblemRequest):
    
    # Step 1: validate input isn't empty
    if not request.problem_text.strip():
        raise HTTPException(status_code=400, detail="Problem text cannot be empty")
    
    # Step 2: run YOUR classifier first — no API call yet
    classification = classify_pattern(request.problem_text)
    
    # Step 3: send to the chosen AI provider with pattern context injected
    try:
        hints = await generate_hints(
            problem_text=request.problem_text,
            pattern=classification["pattern"],
            confidence=classification["confidence"],
            provider=request.provider
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI provider error: {str(e)}")
    
    # Step 4: return everything to frontend
    return {
        "classification": classification,
        "hints": hints
    }