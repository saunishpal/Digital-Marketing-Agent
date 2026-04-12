from fastapi import APIRouter
from models.schemas import AdCopyRequest
from services.gemini_service import generate_text

router = APIRouter(prefix="/api/adcopy", tags=["Ad Copy"])


@router.post("/generate")
def generate_adcopy(data: AdCopyRequest):
    prompt = f"""
You are an expert Meta Ads copywriter for local small businesses.

Business details:
- Business Name: {data.business_name}
- Niche: {data.niche}
- City: {data.city}
- Services: {data.services}
- Offer: {data.main_offer}
- USP: {data.usp}

Generate:
1. 3 Facebook ad primary texts
2. 5 ad headlines
3. 3 short ad descriptions
4. 2 emotional ad copies
5. 2 trust-building ad copies

Make them high-converting and suitable for local lead generation.
Format the response clearly with headings and bullet points.
"""
    result = generate_text(prompt)
    return {"result": result}