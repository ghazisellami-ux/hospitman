from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, project, scope, schedule, cost, hr, quality, communication, risk, dashboard

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HospitMan API",
    description="Hospital Construction Management Platform — 300 Beds Project",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(project.router)
app.include_router(scope.router)
app.include_router(schedule.router)
app.include_router(cost.router)
app.include_router(hr.router)
app.include_router(quality.router)
app.include_router(communication.router)
app.include_router(risk.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "app": "HospitMan",
        "version": "1.0.0",
        "description": "Hospital Construction Management Platform",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
