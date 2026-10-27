from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.supabase_client import supabase
from app.services.photo_service import save_photo
from typing import List
import os

router = APIRouter(prefix="/photo-api", tags=["photos"])

@router.post("/register/{public_id}")
async def register_photos(public_id: str, photos: List[UploadFile] = File(None)):
    photo_urls = []

    if photos:
        for file in photos[:6]:
            url = save_photo(file)
            photo_urls.append(url)

    supabase.table("plants").update({"photos": photo_urls}).eq("public_id", public_id).execute()
    return {"status": "ok", "photos": photo_urls}


@router.post("/update/{public_id}")
async def update_photos(public_id: str, photos: List[UploadFile] = File(None)):
    plant = supabase.table("plants").select("*").eq("public_id", public_id).single().execute().data
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    existing_photos = plant.get("photos") or []

    if photos:
        for file in photos[:6]:
            url = save_photo(file)
            existing_photos.append(url)

        existing_photos = existing_photos[:6]

    supabase.table("plants").update({"photos": existing_photos}).eq("public_id", public_id).execute()
    return {"status": "ok", "photos": existing_photos}


@router.post("/delete/{public_id}")
async def delete_photo(public_id: str, payload: dict):
    url = payload["url"]

    plant = supabase.table("plants").select("*").eq("public_id", public_id).single().execute().data
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    existing = plant.get("photos") or []
    updated_photos = [p for p in existing if p != url]

    supabase.table("plants").update({"photos": updated_photos}).eq("public_id", public_id).execute()

    # Delete local file
    filename = url.split("/photos/")[1]
    filepath = f"photos/{filename}"
    if os.path.exists(filepath):
        os.remove(filepath)

    return {"photos": updated_photos}
