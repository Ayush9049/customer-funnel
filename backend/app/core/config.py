from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="Analytics Platform MVP", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/analytics_platform",
        alias="DATABASE_URL",
    )
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"], alias="CORS_ORIGINS")
    auto_create_tables: bool = Field(default=True, alias="AUTO_CREATE_TABLES")

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
