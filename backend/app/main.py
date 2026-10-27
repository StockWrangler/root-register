from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from dotenv import load_dotenv

from app.services.supabase_client import supabase
from app.routes.plant_routes import router as plant_router
from app.routes.photo_routes import router as photo_router

load_dotenv()

app = FastAPI()

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

# ---------------------------------------------------------
# Static Photo Directory
# ---------------------------------------------------------
PHOTOS_DIR = "photos"
os.makedirs(PHOTOS_DIR, exist_ok=True)

# ⭐ Correct static mount — this is the fix
app.mount("/photos", StaticFiles(directory=PHOTOS_DIR), name="photos")

# ---------------------------------------------------------
# Root
# ---------------------------------------------------------
@app.get("/")
def root():
    return {"status": "Root Register API running"}

# ---------------------------------------------------------
# Supabase Test
# ---------------------------------------------------------
@app.get("/testSupabase")
def test_supabase():
    try:
        response = supabase.table("plants").select("*").limit(1).execute()
        return {"status": "connected", "sample": response.data}
    except Exception as e:
        return {"status": "error", "details": str(e)}

# ---------------------------------------------------------
# Routers
# ---------------------------------------------------------
app.include_router(plant_router)
app.include_router(photo_router)
