from typing import Any

from pydantic import BaseModel


class FunnelResponse(BaseModel):
    login: int
    product_view: int
    add_to_cart: int
    checkout_started: int
    purchase: int


class AnalyticsOverview(BaseModel):
    total_events: int
    unique_users: int
    purchases: int
    funnel: dict[str, int]
    recent_events: list[dict[str, Any]] = []
