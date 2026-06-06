from fastapi import APIRouter
from app.schemas.project import ProjectCreate
import secrets

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"]
)


@router.post("")
def create_project(project: ProjectCreate):
    api_key = f"pk_live_{secrets.token_hex(16)}"

    return {
        "name": project.name,
        "api_key": api_key
    }