from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.quality import Inspection, NCR
from app.models.user import User
from app.schemas.schemas import InspectionCreate, InspectionRead, NCRCreate, NCRRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/quality", tags=["Quality Management"])


@router.get("/inspections", response_model=list[InspectionRead])
def list_inspections(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Inspection).filter(Inspection.project_id == project_id).order_by(Inspection.date.desc()).all()


@router.post("/inspections", response_model=InspectionRead)
def create_inspection(project_id: int, data: InspectionCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    insp = Inspection(project_id=project_id, lot_id=data.lot_id, inspection_type=data.inspection_type,
                      date=date.fromisoformat(data.date), inspector=data.inspector, result=data.result,
                      observations=data.observations)
    db.add(insp)
    db.commit()
    db.refresh(insp)
    return insp


@router.get("/ncrs", response_model=list[NCRRead])
def list_ncrs(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(NCR).filter(NCR.project_id == project_id).order_by(NCR.created_at.desc()).all()


@router.post("/ncrs", response_model=NCRRead)
def create_ncr(project_id: int, data: NCRCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    ncr = NCR(project_id=project_id, **data.model_dump())
    db.add(ncr)
    db.commit()
    db.refresh(ncr)
    return ncr


@router.put("/ncrs/{ncr_id}/status")
def update_ncr_status(project_id: int, ncr_id: int, status: str, db: Session = Depends(get_db), user: User = Depends(require_director)):
    ncr = db.query(NCR).filter(NCR.id == ncr_id, NCR.project_id == project_id).first()
    if not ncr:
        raise HTTPException(status_code=404, detail="NCR not found")
    ncr.status = status
    db.commit()
    return {"detail": f"NCR status updated to {status}"}
