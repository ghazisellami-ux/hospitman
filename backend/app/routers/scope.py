from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.scope import Lot, Contractor, Deliverable, ChangeRequest
from app.models.user import User
from app.schemas.schemas import (
    LotCreate, LotRead, ContractorCreate, ContractorRead,
    DeliverableCreate, DeliverableRead, ChangeRequestCreate, ChangeRequestRead,
)
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/scope", tags=["Scope Management"])


# --- Contractors ---
@router.get("/contractors", response_model=list[ContractorRead])
def list_contractors(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Contractor).filter(Contractor.project_id == project_id).all()


@router.post("/contractors", response_model=ContractorRead)
def create_contractor(project_id: int, data: ContractorCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    contractor = Contractor(project_id=project_id, **data.model_dump())
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return contractor


# --- Lots ---
@router.get("/lots", response_model=list[LotRead])
def list_lots(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Lot).filter(Lot.project_id == project_id).all()


@router.post("/lots", response_model=LotRead)
def create_lot(project_id: int, data: LotCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    lot = Lot(project_id=project_id, **data.model_dump())
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot


@router.put("/lots/{lot_id}", response_model=LotRead)
def update_lot(project_id: int, lot_id: int, data: LotCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    lot = db.query(Lot).filter(Lot.id == lot_id, Lot.project_id == project_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(lot, k, v)
    db.commit()
    db.refresh(lot)
    return lot


@router.delete("/lots/{lot_id}")
def delete_lot(project_id: int, lot_id: int, db: Session = Depends(get_db), user: User = Depends(require_director)):
    lot = db.query(Lot).filter(Lot.id == lot_id, Lot.project_id == project_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    db.delete(lot)
    db.commit()
    return {"detail": "Lot deleted"}


# --- Deliverables ---
@router.get("/lots/{lot_id}/deliverables", response_model=list[DeliverableRead])
def list_deliverables(lot_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user), project_id: int = None):
    return db.query(Deliverable).filter(Deliverable.lot_id == lot_id).all()


@router.post("/lots/{lot_id}/deliverables", response_model=DeliverableRead)
def create_deliverable(lot_id: int, data: DeliverableCreate, db: Session = Depends(get_db), user: User = Depends(require_director), project_id: int = None):
    deliverable = Deliverable(lot_id=lot_id, **data.model_dump())
    db.add(deliverable)
    db.commit()
    db.refresh(deliverable)
    return deliverable


# --- Change Requests ---
@router.get("/change-requests", response_model=list[ChangeRequestRead])
def list_change_requests(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(ChangeRequest).filter(ChangeRequest.project_id == project_id).all()


@router.post("/change-requests", response_model=ChangeRequestRead)
def create_change_request(project_id: int, data: ChangeRequestCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    cr = ChangeRequest(project_id=project_id, **data.model_dump())
    db.add(cr)
    db.commit()
    db.refresh(cr)
    return cr


@router.put("/change-requests/{cr_id}", response_model=ChangeRequestRead)
def update_change_request(project_id: int, cr_id: int, status: str, db: Session = Depends(get_db), user: User = Depends(require_director)):
    cr = db.query(ChangeRequest).filter(ChangeRequest.id == cr_id, ChangeRequest.project_id == project_id).first()
    if not cr:
        raise HTTPException(status_code=404, detail="Change request not found")
    cr.status = status
    if status == "approved":
        cr.approved_by = user.full_name
    db.commit()
    db.refresh(cr)
    return cr
