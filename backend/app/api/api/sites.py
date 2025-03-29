from fastapi import APIRouter, HTTPException
from typing import List
from app.models.site_schema import Site
from app.services.supabase_site_manager import get_site, list_sites, create_site, update_site, delete_site

router = APIRouter(prefix="/api/sites")

@router.get("/", response_model=List[Site])
def get_all():
    return list_sites()

@router.get("/{site_id}", response_model=Site)
def get_one(site_id: str):
    site = get_site(site_id)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site

@router.post("/")
def add(site: Site):
    return create_site(site)

@router.put("/{site_id}")
def edit(site_id: str, site: Site):
    return update_site(site_id, site)

@router.delete("/{site_id}")
def remove(site_id: str):
    return delete_site(site_id)
