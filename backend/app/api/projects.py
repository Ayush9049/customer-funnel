from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import secrets

from app.schemas.project import ProjectCreate
from app.models.project import Project
from app.core.database import get_db

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"]
)


@router.post("")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    api_key = f"pk_live_{secrets.token_hex(16)}"

    new_project = Project(
        name=project.name,
        api_key=api_key
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "id": new_project.id,
        "name": new_project.name,
        "api_key": new_project.api_key,
        "created_at": new_project.created_at
    }