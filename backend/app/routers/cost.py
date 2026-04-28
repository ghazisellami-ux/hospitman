from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.cost import Budget, Invoice, Variation
from app.models.user import User
from app.schemas.schemas import (
    BudgetCreate, BudgetUpdate, BudgetRead,
    InvoiceCreate, InvoiceRead,
    VariationCreate, VariationRead,
)
from app.routers.auth import get_current_user, require_director

router = APIRouter(prefix="/api/projects/{project_id}/cost", tags=["Cost Management"])


# --- Budgets ---
@router.get("/budgets", response_model=list[BudgetRead])
def list_budgets(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Budget).filter(Budget.project_id == project_id).all()


@router.post("/budgets", response_model=BudgetRead)
def create_budget(project_id: int, data: BudgetCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    budget = Budget(project_id=project_id, lot_id=data.lot_id, initial_budget=data.initial_budget)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.put("/budgets/{budget_id}", response_model=BudgetRead)
def update_budget(project_id: int, budget_id: int, data: BudgetUpdate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.project_id == project_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        if v is not None:
            setattr(budget, k, v)
    db.commit()
    db.refresh(budget)
    return budget


# --- Invoices ---
@router.get("/invoices", response_model=list[InvoiceRead])
def list_invoices(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Invoice).filter(Invoice.project_id == project_id).order_by(Invoice.date.desc()).all()


@router.post("/invoices", response_model=InvoiceRead)
def create_invoice(project_id: int, data: InvoiceCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    invoice = Invoice(
        project_id=project_id,
        lot_id=data.lot_id,
        invoice_number=data.invoice_number,
        amount=data.amount,
        description=data.description,
        date=date.fromisoformat(data.date),
        status=data.status,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


# --- Variations (Avenants) ---
@router.get("/variations", response_model=list[VariationRead])
def list_variations(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Variation).filter(Variation.project_id == project_id).all()


@router.post("/variations", response_model=VariationRead)
def create_variation(project_id: int, data: VariationCreate, db: Session = Depends(get_db), user: User = Depends(require_director)):
    variation = Variation(project_id=project_id, **data.model_dump())
    db.add(variation)
    db.commit()
    db.refresh(variation)
    return variation
