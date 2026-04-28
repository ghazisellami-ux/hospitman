from sqlalchemy import Column, Integer, String, Date, Float, Text, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    client = Column(String, nullable=True)  # Maitre d'ouvrage
    description = Column(Text, nullable=True)
    planned_start_date = Column(Date, nullable=False)
    planned_end_date = Column(Date, nullable=False)
    actual_start_date = Column(Date, nullable=True)
    actual_end_date = Column(Date, nullable=True)
    total_budget = Column(Float, default=0.0)
    currency = Column(String, default="TND")
    status = Column(String, default="in_progress")  # in_progress, delayed, suspended, completed
    bed_count = Column(Integer, default=300)
    hse_enabled = Column(Boolean, default=False)  # Optional HSE module
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
