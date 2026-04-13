from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import db_models

from routes.auth import router as auth_router
from routes.business_profile import router as business_profile_router
from routes.content import router as content_router
from routes.adcopy import router as adcopy_router
from routes.planner import router as planner_router
from routes.followup import router as followup_router
from routes.competitor import router as competitor_router
from routes.weekly_plan import router as weekly_plan_router
from routes.leads import router as leads_router
from routes.analytics import router as analytics_router
from routes.admin import router as admin_router
from routes.admin_users import router as admin_users_router
from routes.demo_requests import router as demo_requests_router
from fastapi.staticfiles import StaticFiles
from routes.image_generator import router as image_generator_router






Base.metadata.create_all(bind=engine)

app = FastAPI(title="MarketMind AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://digital-marketing-agent.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(business_profile_router)
app.include_router(content_router)
app.include_router(adcopy_router)
app.include_router(planner_router)
app.include_router(followup_router)
app.include_router(competitor_router)
app.include_router(weekly_plan_router)
app.include_router(leads_router)
app.include_router(analytics_router)
app.include_router(admin_router)
app.include_router(admin_users_router)
app.include_router(demo_requests_router)
app.include_router(image_generator_router)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/")
def root():
    return {"message": "Backend is live"}
