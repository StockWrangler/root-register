from pydantic import BaseModel
from typing import Optional
from datetime import date

class PlantCreate(BaseModel):
    name: str
    species: str
    location: str | None = None
    notes: str | None = None
    owner_id: str | None = None
    mother_public_id: str | None = None   # ⭐ REQUIRED

class PlantUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    location: str | None = None
    notes: str | None = None
    owner_id: str | None = None
    mother_public_id: str | None = None   # ⭐ REQUIRED