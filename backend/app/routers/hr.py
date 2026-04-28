from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.hr import Personnel, DailyAttendance
from app.models.user import User
from app.schemas.schemas import PersonnelCreate, PersonnelRead, DailyAttendanceCreate, DailyAttendanceRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/hr", tags=["HR Management"])


@router.get("/personnel", response_model=list[PersonnelRead])
def list_personnel(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Personnel).filter(Personnel.project_id == project_id).all()


@router.post("/personnel", response_model=PersonnelRead)
def create_personnel(project_id: int, data: PersonnelCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    person = Personnel(project_id=project_id, **data.model_dump())
    db.add(person)
    db.commit()
    db.refresh(person)
    return person


@router.delete("/personnel/{person_id}")
def delete_personnel(project_id: int, person_id: int, db: Session = Depends(get_db), user: User = Depends(require_director)):
    person = db.query(Personnel).filter(Personnel.id == person_id, Personnel.project_id == project_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(person)
    db.commit()
    return {"detail": "Deleted"}


@router.get("/attendance", response_model=list[DailyAttendanceRead])
def list_attendance(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(DailyAttendance).filter(DailyAttendance.project_id == project_id).order_by(DailyAttendance.date.desc()).all()


@router.post("/attendance", response_model=DailyAttendanceRead)
def create_attendance(project_id: int, data: DailyAttendanceCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    att = DailyAttendance(project_id=project_id, date=date.fromisoformat(data.date), company=data.company,
                          lot_id=data.lot_id, workers_count=data.workers_count, engineers_count=data.engineers_count,
                          technicians_count=data.technicians_count, notes=data.notes)
    db.add(att)
    db.commit()
    db.refresh(att)
    return att
