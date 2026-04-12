from fastapi import APIRouter
from models.schemas import WeeklyPlanRequest
from services.gemini_service import generate_text

router = APIRouter(prefix="/api/weekly-plan", tags=["Weekly Plan"])


@router.post("/generate")
def generate_weekly_plan(data: WeeklyPlanRequest):
    prompt = f"""
You are a digital marketing planner for a small business.

Business details:
- Business Name: {data.business_name}
- Niche: {data.niche}
- City: {data.city}
- Services: {data.services}
- Target Audience: {data.target_audience}
- Main Offer: {data.main_offer}
- USP: {data.usp}

Generate a 7-day digital marketing plan.

For each day include:
1. Platform
2. Content type
3. Topic idea
4. Caption idea
5. CTA
6. Simple execution note

Also include:
- 3 ad ideas for the week
- 3 story ideas
- 3 WhatsApp promotion ideas

Keep it simple and highly practical for a local business.
Format clearly day by day.
"""
    result = generate_text(prompt)
    return {"result": result}