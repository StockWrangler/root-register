from fastapi import APIRouter, HTTPException
from app.schemas.plant import PlantCreate, PlantUpdate
from app.services.supabase_client import supabase
from app.services.id_generator import generate_public_id, generate_snowflake_id
from datetime import datetime

router = APIRouter()

import os

@router.post("/registerPlant")
def register_plant(plant: PlantCreate):
    internal_id = generate_snowflake_id()
    public_id = generate_public_id(internal_id)

    data = {
        "internal_id": internal_id,
        "public_id": public_id,
        "name": plant.name,
        "species": plant.species,
        "location": plant.location,
        "notes": plant.notes,
        "owner_id": plant.owner_id,
        "mother_public_id": plant.mother_public_id,   # ⭐ FIXED
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    response = supabase.table("plants").insert(data).execute()
    return {"status": "ok", "data": response.data}


@router.get("/plants")
def get_plants(mother_public_id: str | None = None):
    try:
        if mother_public_id:
            result = supabase.table("plants") \
                .select("*") \
                .eq("mother_public_id", mother_public_id) \
                .execute()
            return result.data or []

        result = supabase.table("plants").select("*").execute()
        return result.data or []
    except Exception as e:
        return {"status": "error", "details": str(e)}, 500


@router.get("/plants/{public_id}")
def get_plant(public_id: str):
    try:
        response = (
            supabase.table("plants")
            .select("*")
            .eq("public_id", public_id)
            .execute()
        )
        if response.data and len(response.data) > 0:
            return response.data[0]
        return {"status": "error", "details": "Plant not found"}
    except Exception as e:
        return {"status": "error", "details": str(e)}


@router.put("/plants/{public_id}")
def update_plant(public_id: str, updates: PlantUpdate):
    try:
        response = (
            supabase.table("plants")
            .update(updates.dict(exclude_none=True))
            .eq("public_id", public_id)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"status": "error", "details": str(e)}


@router.delete("/plants/{public_id}")
def delete_plant(public_id: str):
    try:
        response = (
            supabase.table("plants")
            .delete()
            .eq("public_id", public_id)
            .execute()
        )
        return response.data
    except Exception as e:
        return {"status": "error", "details": str(e)}


@router.post("/photos/delete/{public_id}")
def delete_photo(public_id: str, payload: dict):
    url = payload["url"]

    plant = supabase.table("plants").select("*").eq("public_id", public_id).single().execute().data
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    existing = plant.get("photos") or []
    updated_photos = [p for p in existing if p != url]

    supabase.table("plants").update({"photos": updated_photos}).eq("public_id", public_id).execute()

    filename = url.split("/photos/")[1]
    filepath = f"photos/{filename}"
    if os.path.exists(filepath):
        os.remove(filepath)

    return {"photos": updated_photos}
