from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).all()


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectRead)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(require_director)):
    project = Project(
        name=data.name,
        location=data.location,
        client=data.client,
        description=data.description,
        planned_start_date=date.fromisoformat(data.planned_start_date),
        planned_end_date=date.fromisoformat(data.planned_end_date),
        total_budget=data.total_budget,
        currency=data.currency,
        bed_count=data.bed_count,
        hse_enabled=data.hse_enabled,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_director),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None and field.endswith("_date") and isinstance(value, str):
            value = date.fromisoformat(value)
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project
