from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, ConfigDict


def _format_datetime_for_json(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


class FunnelResponse(BaseModel):
    login: int
    product_view: int
    add_to_cart: int
    checkout_started: int
    purchase: int


class AnalyticsOverview(BaseModel):
    model_config = ConfigDict(json_encoders={datetime: _format_datetime_for_json})

    total_events: int
    unique_users: int
    purchases: int
    funnel: dict[str, int]
    recent_events: list[dict[str, Any]] = []
