from fastapi import APIRouter
from models.schemas import PlannerRequest
from services.gemini_service import generate_text

router = APIRouter(prefix="/api/planner", tags=["Planner"])


@router.post("/generate")
def generate_planner(data: PlannerRequest):
    prompt = f"""
You are a performance marketer helping a small local business.

Business details:
- Business Name: {data.business_name}
- Niche: {data.niche}
- City: {data.city}
- Services: {data.services}
- Target Audience: {data.target_audience}
- Offer: {data.main_offer}
- USP: {data.usp}

Suggest:
1. Best platform to start with
2. Campaign objective
3. Audience targeting idea
4. Starting daily budget
5. 3 campaign angles to test
6. 5 practical next steps

Keep it practical for a small business with limited budget.
Format the response clearly with headings and bullet points.
"""
    result = generate_text(prompt)
    return {"result": result}