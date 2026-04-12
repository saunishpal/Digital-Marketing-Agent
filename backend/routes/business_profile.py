from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from db_models import BusinessProfileDB
from dependencies import get_current_user
from models.schemas import BusinessProfile

router = APIRouter(prefix="/api/business-profile", tags=["Business Profile"])


@router.post("/save")
def save_business_profile(
    profile: BusinessProfile,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = (
        db.query(BusinessProfileDB)
        .filter(
            BusinessProfileDB.owner_id == current_user.id,
            BusinessProfileDB.business_name == profile.business_name,
        )
        .first()
    )

    if existing:
        existing.niche = profile.niche
        existing.city = profile.city
        existing.services = profile.services
        existing.target_audience = profile.target_audience
        existing.main_offer = profile.main_offer
        existing.whatsapp = profile.whatsapp
        existing.website = profile.website
        existing.usp = profile.usp
        db.commit()
        db.refresh(existing)
        return {"message": "Business profile updated successfully", "profile": {"id": existing.id, "business_name": existing.business_name}}

    new_profile = BusinessProfileDB(
        owner_id=current_user.id,
        business_name=profile.business_name,
        niche=profile.niche,
        city=profile.city,
        services=profile.services,
        target_audience=profile.target_audience,
        main_offer=profile.main_offer,
        whatsapp=profile.whatsapp,
        website=profile.website,
        usp=profile.usp,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {"message": "Business profile saved successfully", "profile": {"id": new_profile.id, "business_name": new_profile.business_name}}


@router.get("/all")
def get_all_profiles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profiles = (
        db.query(BusinessProfileDB)
        .filter(BusinessProfileDB.owner_id == current_user.id)
        .all()
    )

    return [
        {
            "id": p.id,
            "business_name": p.business_name,
            "niche": p.niche,
            "city": p.city,
            "services": p.services,
            "target_audience": p.target_audience,
            "main_offer": p.main_offer,
            "whatsapp": p.whatsapp,
            "website": p.website,
            "usp": p.usp,
        }
        for p in profiles
    ]


@router.get("/{profile_id}")
def get_profile_by_id(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = (
        db.query(BusinessProfileDB)
        .filter(
            BusinessProfileDB.id == profile_id,
            BusinessProfileDB.owner_id == current_user.id,
        )
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "id": profile.id,
        "business_name": profile.business_name,
        "niche": profile.niche,
        "city": profile.city,
        "services": profile.services,
        "target_audience": profile.target_audience,
        "main_offer": profile.main_offer,
        "whatsapp": profile.whatsapp,
        "website": profile.website,
        "usp": profile.usp,
    }