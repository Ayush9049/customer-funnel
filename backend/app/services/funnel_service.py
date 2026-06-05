from sqlalchemy import distinct, func
from sqlalchemy.orm import Session

from app.models.event import Event

FUNNEL_EVENTS = ["login", "product_view", "add_to_cart", "checkout_started", "purchase"]


class FunnelService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_funnel_counts(self) -> dict[str, int]:
        rows = (
            self.db.query(Event.event_name, func.count(Event.id).label("count"))
            .filter(Event.event_name.in_(FUNNEL_EVENTS))
            .group_by(Event.event_name)
            .all()
        )
        counts = {name: 0 for name in FUNNEL_EVENTS}
        for event_name, count in rows:
            counts[event_name] = int(count)
        return counts

    def get_overview(self) -> dict[str, object]:
        funnel = self.get_funnel_counts()
        total_events = self.db.query(func.count(Event.id)).scalar() or 0
        unique_users = (
            self.db.query(func.count(distinct(func.coalesce(Event.user_id, Event.anonymous_id)))).scalar() or 0
        )
        recent_events = (
            self.db.query(Event)
            .order_by(Event.created_at.desc())
            .limit(5)
            .all()
        )
        return {
            "total_events": int(total_events),
            "unique_users": int(unique_users),
            "purchases": int(funnel.get("purchase", 0)),
            "funnel": funnel,
            "recent_events": [
                {
                    "id": event.id,
                    "user_id": event.user_id,
                    "anonymous_id": event.anonymous_id,
                    "event_name": event.event_name,
                    "created_at": event.created_at,
                }
                for event in recent_events
            ],
        }
