from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="Analytics Platform MVP", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    secret_key: str = Field(default="change-me-to-a-random-secret-in-production", alias="SECRET_KEY")
    database_url: str = Field(
        default="sqlite:///analytics.db",
        alias="DATABASE_URL",
    )
    postgres_db: str = Field(default="analytics_platform", alias="POSTGRES_DB")
    postgres_user: str = Field(default="postgres", alias="POSTGRES_USER")
    postgres_password: str = Field(default="postgres", alias="POSTGRES_PASSWORD")
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"], alias="CORS_ORIGINS")
    auto_create_tables: bool = Field(default=True, alias="AUTO_CREATE_TABLES")
    demo_project_api_key: str = Field(default="demo-key", alias="DEMO_PROJECT_API_KEY")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> List[str]:
        if value is None or value == "":
            return ["http://localhost:5173"]
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        if isinstance(value, list):
            return value
        return [str(value)]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
