from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.schedule import Activity, WeeklyProgress
from app.models.user import User
from app.schemas.schemas import ActivityCreate, ActivityUpdate, ActivityRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/schedule", tags=["Schedule Management"])


@router.get("/activities", response_model=list[ActivityRead])
def list_activities(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Activity).filter(Activity.project_id == project_id).order_by(Activity.planned_start).all()


@router.post("/activities", response_model=ActivityRead)
def create_activity(project_id: int, data: ActivityCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    activity = Activity(
        project_id=project_id,
        name=data.name,
        lot_id=data.lot_id,
        description=data.description,
        wbs_code=data.wbs_code,
        planned_start=date.fromisoformat(data.planned_start),
        planned_end=date.fromisoformat(data.planned_end),
        planned_value=data.planned_value,
        weight=data.weight,
        predecessor_ids=data.predecessor_ids,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@router.put("/activities/{activity_id}", response_model=ActivityRead)
def update_activity(
    project_id: int,
    activity_id: int,
    data: ActivityUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_director),
):
    activity = db.query(Activity).filter(Activity.id == activity_id, Activity.project_id == project_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None and field in ("actual_start", "actual_end") and isinstance(value, str):
            value = date.fromisoformat(value)
        setattr(activity, field, value)

    # Auto-update status based on progress
    if activity.actual_progress >= 100:
        activity.status = "completed"
    elif activity.actual_progress > 0:
        if activity.actual_progress < activity.planned_progress:
            activity.status = "delayed"
        else:
            activity.status = "in_progress"

    db.commit()
    db.refresh(activity)
    return activity


@router.delete("/activities/{activity_id}")
def delete_activity(project_id: int, activity_id: int, db: Session = Depends(get_db), user: User = Depends(require_director)):
    activity = db.query(Activity).filter(Activity.id == activity_id, Activity.project_id == project_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    db.delete(activity)
    db.commit()
    return {"detail": "Activity deleted"}


@router.post("/activities/import")
def import_activities(project_id: int, db: Session = Depends(get_db), user: User = Depends(require_director)):
    """Placeholder for CSV/Excel import of activities."""
    # TODO: Implement file upload and parsing
    return {"detail": "Import endpoint ready — upload CSV/Excel file"}
