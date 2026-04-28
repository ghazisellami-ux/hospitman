from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.risk import Risk
from app.models.user import User
from app.schemas.schemas import RiskCreate, RiskRead
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/risk", tags=["Risk Management"])


@router.get("/", response_model=list[RiskRead])
def list_risks(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Risk).filter(Risk.project_id == project_id).order_by(Risk.score.desc()).all()


@router.post("/", response_model=RiskRead)
def create_risk(project_id: int, data: RiskCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    score = Risk.calculate_score(data.probability, data.impact)
    risk = Risk(project_id=project_id, score=score, **data.model_dump())
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk


@router.put("/{risk_id}", response_model=RiskRead)
def update_risk(project_id: int, risk_id: int, data: RiskCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    risk = db.query(Risk).filter(Risk.id == risk_id, Risk.project_id == project_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(risk, k, v)
    risk.score = Risk.calculate_score(risk.probability, risk.impact)
    db.commit()
    db.refresh(risk)
    return risk


@router.delete("/{risk_id}")
def delete_risk(project_id: int, risk_id: int, db: Session = Depends(get_db), user: User = Depends(require_director)):
    risk = db.query(Risk).filter(Risk.id == risk_id, Risk.project_id == project_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    db.delete(risk)
    db.commit()
    return {"detail": "Risk deleted"}


@router.get("/matrix")
def get_risk_matrix(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Returns risk matrix data for the heatmap visualization."""
    risks = db.query(Risk).filter(Risk.project_id == project_id, Risk.status != "resolved").all()
    matrix = {}
    for r in risks:
        key = f"{r.probability}_{r.impact}"
        if key not in matrix:
            matrix[key] = {"probability": r.probability, "impact": r.impact, "count": 0, "risks": []}
        matrix[key]["count"] += 1
        matrix[key]["risks"].append({"id": r.id, "description": r.description, "category": r.category})
    return list(matrix.values())
