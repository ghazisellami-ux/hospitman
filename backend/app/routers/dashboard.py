from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.database import get_db
from app.models.project import Project
from app.models.schedule import Activity, WeeklyProgress
from app.models.cost import Budget
from app.models.risk import Risk
from app.models.quality import NCR
from app.models.scope import ChangeRequest
from app.models.hr import DailyAttendance
from app.models.user import User
from app.schemas.schemas import DashboardKPIs, SCurveData
from app.services.evm import calculate_evm, calculate_overall_progress
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/projects/{project_id}/dashboard", tags=["Dashboard"])


@router.get("/kpis", response_model=DashboardKPIs)
def get_dashboard_kpis(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return DashboardKPIs(overall_progress_planned=0, overall_progress_actual=0,
                             spi=0, cpi=0, budget_consumed_pct=0, days_remaining=0,
                             total_budget=0, total_actual_cost=0, active_critical_risks=0,
                             open_ncrs=0, pending_change_requests=0, total_personnel_today=0)

    evm = calculate_evm(db, project_id)
    progress = calculate_overall_progress(db, project_id)

    # Budget consumed
    total_ac = evm["ac"]
    budget_pct = round((total_ac / project.total_budget * 100), 1) if project.total_budget > 0 else 0

    # Days remaining
    today = date.today()
    days_remaining = (project.planned_end_date - today).days if project.planned_end_date else 0

    # Active critical risks (score >= 12)
    critical_risks = db.query(Risk).filter(
        Risk.project_id == project_id, Risk.score >= 12, Risk.status != "resolved"
    ).count()

    # Open NCRs
    open_ncrs = db.query(NCR).filter(NCR.project_id == project_id, NCR.status != "closed").count()

    # Pending change requests
    pending_crs = db.query(ChangeRequest).filter(
        ChangeRequest.project_id == project_id, ChangeRequest.status == "pending"
    ).count()

    # Today's personnel
    today_attendance = db.query(func.sum(
        DailyAttendance.workers_count + DailyAttendance.engineers_count + DailyAttendance.technicians_count
    )).filter(DailyAttendance.project_id == project_id, DailyAttendance.date == today).scalar() or 0

    return DashboardKPIs(
        overall_progress_planned=progress["planned"],
        overall_progress_actual=progress["actual"],
        spi=evm["spi"],
        cpi=evm["cpi"],
        budget_consumed_pct=budget_pct,
        days_remaining=max(days_remaining, 0),
        total_budget=project.total_budget,
        total_actual_cost=total_ac,
        active_critical_risks=critical_risks,
        open_ncrs=open_ncrs,
        pending_change_requests=pending_crs,
        total_personnel_today=today_attendance,
    )


@router.get("/s-curve")
def get_s_curve(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Return weekly S-curve data for charting."""
    data = db.query(WeeklyProgress).filter(
        WeeklyProgress.project_id == project_id
    ).order_by(WeeklyProgress.week_date).all()

    return [
        {
            "week_date": str(d.week_date),
            "planned_progress": d.cumulative_planned_progress,
            "actual_progress": d.cumulative_actual_progress,
            "planned_value": d.cumulative_planned_value,
            "earned_value": d.cumulative_earned_value,
            "actual_cost": d.cumulative_actual_cost,
        }
        for d in data
    ]


@router.get("/budget-breakdown")
def get_budget_breakdown(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Budget breakdown by lot for stacked bar chart."""
    budgets = db.query(Budget).filter(Budget.project_id == project_id).all()
    return [
        {
            "lot_id": b.lot_id,
            "initial_budget": b.initial_budget,
            "committed_cost": b.committed_cost,
            "actual_cost": b.actual_cost,
            "eac": b.estimate_at_completion,
        }
        for b in budgets
    ]
