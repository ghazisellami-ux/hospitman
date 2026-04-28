from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.communication import Communication, ActionItem
from app.models.user import User
from app.schemas.schemas import CommunicationCreate, CommunicationRead, ActionItemCreate, ActionItemRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/communication", tags=["Communication Management"])


@router.get("/", response_model=list[CommunicationRead])
def list_communications(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Communication).filter(Communication.project_id == project_id).order_by(Communication.date.desc()).all()


@router.post("/", response_model=CommunicationRead)
def create_communication(project_id: int, data: CommunicationCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    comm = Communication(project_id=project_id, comm_type=data.comm_type, date=date.fromisoformat(data.date),
                         subject=data.subject, content=data.content, participants=data.participants)
    db.add(comm)
    db.commit()
    db.refresh(comm)
    return comm


@router.get("/actions", response_model=list[ActionItemRead])
def list_action_items(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(ActionItem).filter(ActionItem.project_id == project_id).order_by(ActionItem.deadline).all()


@router.post("/actions", response_model=ActionItemRead)
def create_action_item(project_id: int, data: ActionItemCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    action = ActionItem(project_id=project_id, communication_id=data.communication_id,
                        description=data.description, assigned_to=data.assigned_to, deadline=data.deadline)
    db.add(action)
    db.commit()
    db.refresh(action)
    return action


@router.put("/actions/{action_id}/status")
def update_action_status(project_id: int, action_id: int, status: str, db: Session = Depends(get_db), user: User = Depends(require_director)):
    action = db.query(ActionItem).filter(ActionItem.id == action_id, ActionItem.project_id == project_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")
    action.status = status
    db.commit()
    return {"detail": f"Action status updated to {status}"}
