from fastapi import APIRouter
from models.schemas import ContentRequest
from services.gemini_service import generate_text

router = APIRouter(prefix="/api/content", tags=["Content"])


@router.post("/generate")
def generate_content(data: ContentRequest):
    prompt = f"""
You are a digital marketing expert for small businesses.

Business details:
- Business Name: {data.business_name}
- Niche: {data.niche}
- City: {data.city}
- Services: {data.services}
- Target Audience: {data.target_audience}
- Main Offer: {data.main_offer}
- USP: {data.usp}

Generate:
1. 7 Instagram post ideas
2. 5 reel ideas
3. 10 engaging hooks
4. 10 hashtags
5. 5 CTA lines

Keep the language simple, persuasive, and suitable for Indian small business marketing.
Format the response clearly with headings and bullet points.
"""
    result = generate_text(prompt)
    return {"result": result}