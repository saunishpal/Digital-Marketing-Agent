import os
import uuid
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai
    from google.genai import types
except ImportError as e:
    raise ImportError(
        "Google GenAI SDK not installed correctly. Run: pip install -U google-genai"
    ) from e

API_KEY = os.getenv("GEMINI_API_KEY")
IMAGE_MODEL_NAME = os.getenv("IMAGE_MODEL_NAME", "gemini-3.1-flash-image-preview")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in backend/.env")

client = genai.Client(api_key=API_KEY)

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static" / "generated"
STATIC_DIR.mkdir(parents=True, exist_ok=True)


def generate_marketing_image(prompt: str) -> dict:
    response = client.models.generate_content(
        model=IMAGE_MODEL_NAME,
        contents=prompt,
    )

    image_bytes = None

    candidates = getattr(response, "candidates", []) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        parts = getattr(content, "parts", []) if content else []

        for part in parts:
            inline_data = getattr(part, "inline_data", None)
            if inline_data and getattr(inline_data, "data", None):
                image_bytes = inline_data.data
                break

        if image_bytes:
            break

    if image_bytes is None:
        raise ValueError("No image bytes were returned by Gemini.")

    filename = f"{uuid.uuid4().hex}.png"
    filepath = STATIC_DIR / filename

    with open(filepath, "wb") as f:
        f.write(image_bytes)

    return {
        "image_url": f"/static/generated/{filename}"
    }