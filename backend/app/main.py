from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.events import router as events_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import event, user, project


app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now (debug mode)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)
app.include_router(analytics_router)


@app.api_route("/", methods=["GET", "HEAD"])
def root() -> dict[str, str]:
    return {"status": "ok"}


@app.on_event("startup")
def on_startup() -> None:
    if settings.app_env == "development" and settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}

