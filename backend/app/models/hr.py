from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Personnel(Base):
    """Membre du personnel sur le chantier."""
    __tablename__ = "personnel"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # director, engineer, technician, worker
    company = Column(String, nullable=True)  # Contractor or supervision
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class DailyAttendance(Base):
    """Présence journalière — effectif par jour et entreprise."""
    __tablename__ = "daily_attendance"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    date = Column(Date, nullable=False)
    company = Column(String, nullable=False)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    workers_count = Column(Integer, default=0)
    engineers_count = Column(Integer, default=0)
    technicians_count = Column(Integer, default=0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
