from sqlalchemy import Column, Integer, String, Date, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Activity(Base):
    """Activité / Task in the project schedule."""
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    wbs_code = Column(String, nullable=True)  # Work Breakdown Structure code

    # Planned dates
    planned_start = Column(Date, nullable=False)
    planned_end = Column(Date, nullable=False)

    # Actual dates
    actual_start = Column(Date, nullable=True)
    actual_end = Column(Date, nullable=True)

    # Progress
    planned_progress = Column(Float, default=0.0)  # 0-100
    actual_progress = Column(Float, default=0.0)  # 0-100

    # Earned Value fields
    planned_value = Column(Float, default=0.0)  # Budgeted Cost of Work Scheduled (BCWS)
    earned_value = Column(Float, default=0.0)  # Budgeted Cost of Work Performed (BCWP)
    actual_cost = Column(Float, default=0.0)  # Actual Cost of Work Performed (ACWP)

    # Dependencies
    predecessor_ids = Column(String, nullable=True)  # Comma-separated IDs

    # Weight for weighted average progress calculation
    weight = Column(Float, default=1.0)

    status = Column(String, default="not_started")  # not_started, in_progress, delayed, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class WeeklyProgress(Base):
    """Snapshot hebdomadaire de l'avancement pour la courbe en S."""
    __tablename__ = "weekly_progress"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    week_date = Column(Date, nullable=False)  # Start of the week (Monday)
    cumulative_planned_progress = Column(Float, default=0.0)
    cumulative_actual_progress = Column(Float, default=0.0)
    cumulative_planned_value = Column(Float, default=0.0)
    cumulative_earned_value = Column(Float, default=0.0)
    cumulative_actual_cost = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
