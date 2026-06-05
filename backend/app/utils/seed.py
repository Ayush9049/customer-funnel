from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.event import Event
from app.models.user import User


SAMPLE_USERS = [
    "user-1001",
    "user-1002",
]

SAMPLE_EVENTS = [
    {"user_id": "user-1001", "event_name": "login", "properties": {}},
    {"user_id": "user-1001", "event_name": "product_view", "properties": {"product_id": "P001"}},
    {"user_id": "user-1001", "event_name": "add_to_cart", "properties": {"product_id": "P001"}},
    {"user_id": "user-1001", "event_name": "checkout_started", "properties": {"cart_value": 49.99}},
    {"user_id": "user-1001", "event_name": "purchase", "properties": {"order_id": "O1001"}},
    {"user_id": "user-1002", "event_name": "login", "properties": {}},
    {"user_id": "user-1002", "event_name": "product_view", "properties": {"product_id": "P002"}},
    {"anonymous_id": "anon-abc-001", "event_name": "product_view", "properties": {"product_id": "P003"}},
]


def seed_demo_data(db: Session) -> None:
    for external_user_id in SAMPLE_USERS:
        existing = db.query(User).filter(User.external_user_id == external_user_id).one_or_none()
        if existing is None:
            db.add(User(external_user_id=external_user_id))

    db.flush()

    existing_events = db.query(Event).count()
    if existing_events == 0:
        for item in SAMPLE_EVENTS:
            db.add(Event(**item))

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_demo_data(db)
        print("Seed data created successfully.")
    finally:
        db.close()
