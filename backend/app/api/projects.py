from fastapi import APIRouter
from app.schemas.project import ProjectCreate

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("")
def create_project(project: ProjectCreate):
    return {
        "name": project.name
    }