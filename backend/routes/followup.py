from fastapi import APIRouter
from models.schemas import FollowupRequest
from services.gemini_service import generate_text

router = APIRouter(prefix="/api/followup", tags=["Follow-up"])


@router.post("/generate")
def generate_followup(data: FollowupRequest):
    prompt = f"""
You are a sales follow-up assistant for a small business.

Lead details:
- Lead Name: {data.lead_name}
- Interested Service: {data.service}
- City: {data.city}
- Pain Point: {data.pain_point}

Business details:
- Business Name: {data.business_name}
- Offer: {data.main_offer}

Generate:
1. First WhatsApp follow-up
2. Friendly reminder message
3. Closing-oriented message
4. Re-engagement message after no response

Keep messages short, polite, and conversion-focused.
Format the response clearly with headings and bullet points.
"""
    result = generate_text(prompt)
    return {"result": result}