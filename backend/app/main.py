from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app import models # Pre-load all models into metadata

from app.core.middleware import AuditMiddleware

from redis import asyncio as aioredis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine) # Create all tables
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}", encoding="utf8", decode_responses=False)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

app.add_middleware(AuditMiddleware)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

from fastapi.responses import RedirectResponse

@app.get("/")
def root():
    return {"message": "Welcome to Neuraltrix Education ERP API"}

@app.post("/token")
def login_redirect():
    return RedirectResponse(url="/api/v1/token")
