from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional

from models.schemas import CompetitorResearchRequest
from services.gemini_service import generate_text, marketing_chat

router = APIRouter(prefix="/api/competitor", tags=["Competitor Research"])


@router.post("/analyze")
def analyze_competitor(data: CompetitorResearchRequest):
    prompt = f"""
You are a digital marketing strategist for small businesses.

Business details:
- Business Name: {data.business_name}
- Niche: {data.niche}
- City: {data.city}

Competitor details:
- Competitor Name: {data.competitor_name}
- Competitor Website: {data.competitor_website}
- Competitor Notes: {data.competitor_notes}

Analyze the competitor and generate:
1. Possible strengths
2. Possible weaknesses
3. Likely marketing angle
4. Offer positioning
5. What my business should do differently
6. 5 practical ways to beat this competitor locally

Keep it practical, realistic, and useful for a small business.
Format with headings and bullet points.
"""
    result = generate_text(prompt)
    return {"result": result}


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CompetitorChatRequest(BaseModel):
    messages: List[ChatMessage]
    business_type: Optional[str] = None
    location: Optional[str] = None
    website_url: Optional[str] = None


@router.post("/chat")
def competitor_chat(payload: CompetitorChatRequest):
    try:
        result = marketing_chat(
            messages=[msg.model_dump() for msg in payload.messages],
            business_type=payload.business_type,
            location=payload.location,
            website_url=payload.website_url,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))