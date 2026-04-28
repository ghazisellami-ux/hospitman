from datetime import date
from sqlalchemy.orm import Session
from app.models.schedule import Activity
from app.models.cost import Budget
from app.models.project import Project


def calculate_evm(db: Session, project_id: int) -> dict:
    """Calculate Earned Value Management metrics for the project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    activities = db.query(Activity).filter(Activity.project_id == project_id).all()
    budgets = db.query(Budget).filter(Budget.project_id == project_id).all()

    if not project or not activities:
        return {"pv": 0, "ev": 0, "ac": 0, "spi": 0, "cpi": 0, "eac": 0, "etc": 0, "vac": 0}

    # Sum planned value, earned value, actual cost from all activities
    total_pv = sum(a.planned_value for a in activities)
    total_ev = sum(a.earned_value for a in activities)
    total_ac = sum(a.actual_cost for a in activities)

    # Schedule Performance Index
    spi = round(total_ev / total_pv, 2) if total_pv > 0 else 0.0

    # Cost Performance Index
    cpi = round(total_ev / total_ac, 2) if total_ac > 0 else 0.0

    # Budget At Completion
    bac = project.total_budget if project.total_budget > 0 else sum(b.initial_budget for b in budgets)

    # Estimate At Completion
    eac = round(bac / cpi, 2) if cpi > 0 else bac

    # Estimate To Complete
    etc = round(eac - total_ac, 2)

    # Variance At Completion
    vac = round(bac - eac, 2)

    return {
        "pv": round(total_pv, 2),
        "ev": round(total_ev, 2),
        "ac": round(total_ac, 2),
        "spi": spi,
        "cpi": cpi,
        "bac": round(bac, 2),
        "eac": eac,
        "etc": etc,
        "vac": vac,
    }


def calculate_overall_progress(db: Session, project_id: int) -> dict:
    """Calculate weighted average progress (planned vs actual)."""
    activities = db.query(Activity).filter(Activity.project_id == project_id).all()
    if not activities:
        return {"planned": 0.0, "actual": 0.0}

    total_weight = sum(a.weight for a in activities)
    if total_weight == 0:
        return {"planned": 0.0, "actual": 0.0}

    planned = sum(a.planned_progress * a.weight for a in activities) / total_weight
    actual = sum(a.actual_progress * a.weight for a in activities) / total_weight

    return {"planned": round(planned, 1), "actual": round(actual, 1)}
