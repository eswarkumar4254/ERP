from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Neuraltrix Education ERP"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-me" # Should be in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    SQLALCHEMY_DATABASE_URL: str = "postgresql://postgres:admin123@localhost:5432/erp_db"
    
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True

settings = Settings()
