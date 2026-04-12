from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from db_models import LeadDB

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/summary")
def analytics_summary(db: Session = Depends(get_db)):
    total_leads = db.query(LeadDB).count()

    status_counts = (
        db.query(LeadDB.status, func.count(LeadDB.id))
        .group_by(LeadDB.status)
        .all()
    )

    source_counts = (
        db.query(LeadDB.source, func.count(LeadDB.id))
        .group_by(LeadDB.source)
        .all()
    )

    closed_leads = db.query(LeadDB).filter(LeadDB.status == "closed").count()

    return {
        "total_leads": total_leads,
        "closed_leads": closed_leads,
        "conversion_rate": round((closed_leads / total_leads) * 100, 2) if total_leads else 0,
        "status_breakdown": [
            {"name": status if status else "unknown", "value": count}
            for status, count in status_counts
        ],
        "source_breakdown": [
            {"name": source if source else "unknown", "value": count}
            for source, count in source_counts
        ],
    }