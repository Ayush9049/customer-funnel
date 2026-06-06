from fastapi import APIRouter

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("")
def create_project():
    return {
        "message": "Projects endpoint working"
    }