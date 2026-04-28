from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Inspection(Base):
    """Inspection qualité sur chantier."""
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    inspection_type = Column(String, nullable=False)  # concrete, steel, waterproofing, mep, etc.
    date = Column(Date, nullable=False)
    inspector = Column(String, nullable=False)
    result = Column(String, default="pending")  # conforming, non_conforming, pending
    observations = Column(Text, nullable=True)
    photos = Column(String, nullable=True)  # JSON array of file paths
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NCR(Base):
    """Non-Conformity Report."""
    __tablename__ = "ncrs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    inspection_id = Column(Integer, ForeignKey("inspections.id"), nullable=True)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    ncr_number = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    corrective_action = Column(Text, nullable=True)
    responsible = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(String, default="open")  # open, in_progress, closed
    severity = Column(String, default="minor")  # minor, major, critical
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class HSEIncident(Base):
    """HSE Incident (optional module)."""
    __tablename__ = "hse_incidents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    date = Column(Date, nullable=False)
    incident_type = Column(String, nullable=False)  # accident, near_miss, environmental
    description = Column(Text, nullable=False)
    severity = Column(String, default="low")  # low, medium, high, critical
    corrective_action = Column(Text, nullable=True)
    responsible = Column(String, nullable=True)
    status = Column(String, default="open")  # open, investigating, closed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
