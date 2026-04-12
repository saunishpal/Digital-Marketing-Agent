from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from db_models import DemoRequestDB
from models.schemas import DemoRequestCreate, DemoRequestStatusUpdate

router = APIRouter(prefix="/api/demo-requests", tags=["Demo Requests"])


@router.post("/create")
def create_demo_request(data: DemoRequestCreate, db: Session = Depends(get_db)):
    demo = DemoRequestDB(
        name=data.name,
        business_name=data.business_name,
        niche=data.niche,
        city=data.city,
        phone=data.phone,
        need=data.need,
        status="new",
    )
    db.add(demo)
    db.commit()
    db.refresh(demo)

    return {
        "message": "Demo request submitted successfully",
        "demo_request": {
            "id": demo.id,
            "name": demo.name,
            "business_name": demo.business_name,
            "status": demo.status,
        },
    }


@router.get("/all")
def get_all_demo_requests(db: Session = Depends(get_db)):
    demos = db.query(DemoRequestDB).order_by(DemoRequestDB.id.desc()).all()

    return [
        {
            "id": demo.id,
            "name": demo.name,
            "business_name": demo.business_name,
            "niche": demo.niche,
            "city": demo.city,
            "phone": demo.phone,
            "need": demo.need,
            "status": demo.status,
        }
        for demo in demos
    ]


@router.put("/{demo_id}/status")
def update_demo_status(
    demo_id: int,
    data: DemoRequestStatusUpdate,
    db: Session = Depends(get_db),
):
    demo = db.query(DemoRequestDB).filter(DemoRequestDB.id == demo_id).first()

    if not demo:
        raise HTTPException(status_code=404, detail="Demo request not found")

    demo.status = data.status
    db.commit()
    db.refresh(demo)

    return {
        "message": "Demo request status updated",
        "demo_request": {
            "id": demo.id,
            "status": demo.status,
        },
    }