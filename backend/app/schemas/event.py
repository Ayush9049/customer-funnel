from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EventTrackRequest(BaseModel):
    api_key: str

    user_id: str | None = Field(default=None, description="External user identifier")

    anonymous_id: str | None = Field(
        default=None,
        description="Anonymous browser identifier"
    )

    event_name: str

    properties: dict[str, Any] = Field(default_factory=dict)
    @field_validator("event_name")
    @classmethod
    def validate_event_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("event_name is required")
        return stripped


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str | None
    anonymous_id: str | None
    event_name: str
    properties: dict[str, Any]
    created_at: datetime


class EventListResponse(BaseModel):
    data: list[EventRead]
    page: int
    page_size: int
    total: int
    total_pages: int
