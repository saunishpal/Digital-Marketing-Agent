from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from db_models import LeadDB, BusinessProfileDB
from dependencies import get_current_user
from models.schemas import LeadCreateRequest, LeadUpdateStatusRequest

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.post("/create")
def create_lead(
    data: LeadCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = (
        db.query(BusinessProfileDB)
        .filter(
            BusinessProfileDB.id == data.profile_id,
            BusinessProfileDB.owner_id == current_user.id,
        )
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    lead = LeadDB(
        profile_id=data.profile_id,
        lead_name=data.lead_name,
        phone=data.phone,
        source=data.source,
        service=data.service,
        city=data.city,
        status=data.status,
        notes=data.notes,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    return {"message": "Lead created successfully", "lead": {"id": lead.id, "lead_name": lead.lead_name}}


@router.get("/profile/{profile_id}")
def get_profile_leads(
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

    leads = db.query(LeadDB).filter(LeadDB.profile_id == profile_id).order_by(LeadDB.id.desc()).all()

    return [
        {
            "id": lead.id,
            "lead_name": lead.lead_name,
            "phone": lead.phone,
            "source": lead.source,
            "service": lead.service,
            "city": lead.city,
            "status": lead.status,
            "notes": lead.notes,
        }
        for lead in leads
    ]