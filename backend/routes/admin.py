from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from db_models import UserDB, BusinessProfileDB, LeadDB, DemoRequestDB

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/overview")
def admin_overview(db: Session = Depends(get_db)):
    total_users = db.query(UserDB).count()
    total_clients = db.query(BusinessProfileDB).count()
    total_leads = db.query(LeadDB).count()
    total_demo_requests = db.query(DemoRequestDB).count()

    recent_users = db.query(UserDB).order_by(UserDB.id.desc()).limit(5).all()
    recent_clients = (
        db.query(BusinessProfileDB)
        .order_by(BusinessProfileDB.id.desc())
        .limit(5)
        .all()
    )
    recent_leads = db.query(LeadDB).order_by(LeadDB.id.desc()).limit(5).all()
    recent_demo_requests = (
        db.query(DemoRequestDB)
        .order_by(DemoRequestDB.id.desc())
        .limit(5)
        .all()
    )

    return {
        "stats": {
            "total_users": total_users,
            "total_clients": total_clients,
            "total_leads": total_leads,
            "total_demo_requests": total_demo_requests,
        },
        "recent_users": [
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
            }
            for user in recent_users
        ],
        "recent_clients": [
            {
                "id": client.id,
                "business_name": client.business_name,
                "city": client.city,
                "niche": client.niche,
            }
            for client in recent_clients
        ],
        "recent_leads": [
            {
                "id": lead.id,
                "lead_name": lead.lead_name,
                "status": lead.status,
                "source": lead.source,
                "city": lead.city,
            }
            for lead in recent_leads
        ],
        "recent_demo_requests": [
            {
                "id": demo.id,
                "name": demo.name,
                "business_name": demo.business_name,
                "status": demo.status,
                "city": demo.city,
            }
            for demo in recent_demo_requests
        ],
    }