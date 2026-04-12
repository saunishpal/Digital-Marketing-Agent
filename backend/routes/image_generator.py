from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from services.image_service import generate_marketing_image

router = APIRouter(prefix="/api/image", tags=["Image Generation"])


class ImageGenerateRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None


@router.post("/generate")
def generate_image(payload: ImageGenerateRequest):
    try:
        prompt = payload.prompt.strip()

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        if payload.context:
            ctx = payload.context
            extra_lines = []

            if ctx.get("business_name"):
                extra_lines.append(f"Business: {ctx['business_name']}")
            if ctx.get("niche"):
                extra_lines.append(f"Niche: {ctx['niche']}")
            if ctx.get("city"):
                extra_lines.append(f"Location: {ctx['city']}")
            if ctx.get("services"):
                extra_lines.append(f"Services: {ctx['services']}")
            if ctx.get("target_audience"):
                extra_lines.append(f"Target audience: {ctx['target_audience']}")
            if ctx.get("main_offer"):
                extra_lines.append(f"Main offer: {ctx['main_offer']}")
            if ctx.get("usp"):
                extra_lines.append(f"USP: {ctx['usp']}")
            if ctx.get("page"):
                extra_lines.append(f"Use case: {ctx['page']}")

            if extra_lines:
                prompt = (
                    f"{prompt}\n\n"
                    f"Business context:\n" + "\n".join(extra_lines) + "\n\n"
                    "Style: professional marketing creative, premium, modern, clean, high-converting."
                )

        return generate_marketing_image(prompt)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))