from pydantic import BaseModel, EmailStr, Field

from typing import List, Optional, Literal


class BusinessProfile(BaseModel):
    business_name: str
    niche: str
    city: str
    services: str
    target_audience: str
    main_offer: str
    whatsapp: str | None = ""
    website: str | None = ""
    usp: str


class ContentRequest(BaseModel):
    business_name: str
    niche: str
    city: str
    services: str
    target_audience: str
    main_offer: str
    usp: str


class AdCopyRequest(BaseModel):
    business_name: str
    niche: str
    city: str
    services: str
    main_offer: str
    usp: str


class PlannerRequest(BaseModel):
    business_name: str
    niche: str
    city: str
    services: str
    target_audience: str
    main_offer: str
    usp: str


class FollowupRequest(BaseModel):
    lead_name: str
    service: str
    city: str
    pain_point: str
    business_name: str
    main_offer: str


class CompetitorResearchRequest(BaseModel):
    business_name: str
    niche: str
    city: str
    competitor_name: str
    competitor_website: str | None = ""
    competitor_notes: str | None = ""


class WeeklyPlanRequest(BaseModel):
    business_name: str
    niche: str
    city: str
    services: str
    target_audience: str
    main_offer: str
    usp: str


class LeadCreateRequest(BaseModel):
    profile_id: int
    lead_name: str
    phone: str | None = ""
    source: str | None = ""
    service: str | None = ""
    city: str | None = ""
    status: str = "new"
    notes: str | None = ""


class LeadUpdateStatusRequest(BaseModel):
    status: str


class UserRegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6, max_length=64)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=64)

class UserPackageUpdateRequest(BaseModel):
    package_name: str = Field(..., pattern="^(starter|growth|agency)$")


class UserStatusUpdateRequest(BaseModel):
    is_active: bool

class DemoRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    business_name: str = Field(..., min_length=2, max_length=150)
    niche: str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    need: str | None = ""




class DemoRequestStatusUpdate(BaseModel):
    status: str    


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CompetitorResearchRequest(BaseModel):
    messages: List[ChatMessage]
    business_type: Optional[str] = None
    location: Optional[str] = None
    website_url: Optional[str] = None


class SourceItem(BaseModel):
    title: str
    url: str


class CompetitorResearchResponse(BaseModel):
    reply: str
    sources: List[SourceItem] = []
    tools_used: List[str] = []    

