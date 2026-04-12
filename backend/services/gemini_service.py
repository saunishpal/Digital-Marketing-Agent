import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai
    from google.genai import types
except ImportError as e:
    raise ImportError(
        "Google GenAI SDK not installed correctly. Run: pip uninstall -y google google-generativeai google-ai-generativelanguage google-genai && pip install -U google-genai"
    ) from e

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in backend/.env")

client = genai.Client(api_key=API_KEY)


def _needs_search(text: str) -> bool:
    text = text.lower()
    keywords = [
        "research",
        "competitor",
        "competitors",
        "latest",
        "current",
        "trend",
        "trends",
        "seo",
        "keyword",
        "keywords",
        "market",
        "pricing",
        "price",
        "best",
        "top",
        "compare",
        "comparison",
        "industry",
        "audience",
        "review",
        "reviews",
    ]
    return any(word in text for word in keywords)


def _has_url(text: str) -> bool:
    text = text.lower()
    return "http://" in text or "https://" in text


def _build_system_prompt(
    business_type: Optional[str] = None,
    location: Optional[str] = None,
    website_url: Optional[str] = None,
) -> str:
    context_parts = []

    if business_type:
        context_parts.append(f"Business type: {business_type}")
    if location:
        context_parts.append(f"Target location: {location}")
    if website_url:
        context_parts.append(f"Website URL: {website_url}")

    context_block = "\n".join(context_parts) if context_parts else "No extra business context provided."

    return f"""
You are Market Mind AI, an advanced digital marketing agent.

Your tone:
- natural
- smart
- conversational
- helpful like ChatGPT/Gemini
- not robotic
- practical and business-focused

Your responsibilities:
- competitor research
- audience research
- SEO ideas
- campaign suggestions
- ad angle generation
- landing page analysis
- content strategy
- offer positioning

Use live web research when the user asks for current information, competitors, trends, SEO opportunities, pricing, reviews, or market insights.
If a website URL is provided, analyze it in context.

Business context:
{context_block}

Response rules:
1. Start with a direct answer
2. Then show key findings
3. Then recommendations
4. Then next actions
5. Do not invent facts
6. Keep the response premium and easy to understand

Preferred format:

Answer:
...

Key Findings:
- ...
- ...

Recommendations:
- ...
- ...

Next Actions:
- ...
- ...
""".strip()


def _extract_sources(response) -> List[Dict[str, str]]:
    sources: List[Dict[str, str]] = []
    seen = set()

    try:
        candidates = getattr(response, "candidates", []) or []
        if not candidates:
            return sources

        candidate = candidates[0]

        grounding_metadata = getattr(candidate, "grounding_metadata", None)
        if grounding_metadata:
            grounding_chunks = getattr(grounding_metadata, "grounding_chunks", []) or []

            for chunk in grounding_chunks:
                web_info = getattr(chunk, "web", None)
                if not web_info:
                    continue

                title = getattr(web_info, "title", None)
                url = getattr(web_info, "uri", None)

                if title and url and url not in seen:
                    seen.add(url)
                    sources.append({
                        "title": title,
                        "url": url,
                    })
    except Exception:
        pass

    return sources


def generate_text(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    return response.text or "No response generated."


def marketing_chat(
    messages: List[Dict[str, str]],
    business_type: Optional[str] = None,
    location: Optional[str] = None,
    website_url: Optional[str] = None,
) -> Dict[str, Any]:
    latest_user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            latest_user_message = msg.get("content", "")
            break

    use_search = _needs_search(latest_user_message)
    use_url_context = bool(website_url) or _has_url(latest_user_message)

    tools = []
    tools_used = []

    if use_search:
        tools.append(types.Tool(google_search=types.GoogleSearch()))
        tools_used.append("google_search")

    if use_url_context:
        tools.append(types.Tool(url_context=types.UrlContext()))
        tools_used.append("url_context")

        if "google_search" not in tools_used:
            tools.append(types.Tool(google_search=types.GoogleSearch()))
            tools_used.append("google_search")

    conversation_lines = []
    for msg in messages:
        role = "User" if msg.get("role") == "user" else "Assistant"
        content = msg.get("content", "")
        conversation_lines.append(f"{role}: {content}")

    final_prompt = f"""
{_build_system_prompt(business_type, location, website_url)}

Conversation so far:
{chr(10).join(conversation_lines)}

Now respond naturally to the latest user message.
""".strip()

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=final_prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            top_p=0.95,
            tools=tools if tools else None,
        ),
    )

    return {
        "reply": response.text or "No response generated.",
        "sources": _extract_sources(response),
        "tools_used": tools_used,
    }