from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Lot(Base):
    """Work Package / Lot - represents a major scope area."""
    __tablename__ = "lots"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g. "Gros œuvre", "VRD", "Electricité"
    description = Column(Text, nullable=True)
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=True)
    status = Column(String, default="planned")  # planned, in_progress, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    deliverables = relationship("Deliverable", back_populates="lot")
    contractor = relationship("Contractor", back_populates="lots")


class Contractor(Base):
    """Entrepreneur / Contractor."""
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    specialty = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lots = relationship("Lot", back_populates="contractor")


class Deliverable(Base):
    """Livrable - a specific deliverable within a lot."""
    __tablename__ = "deliverables"

    id = Column(Integer, primary_key=True, index=True)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="planned")  # planned, in_progress, delivered, validated
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    lot = relationship("Lot", back_populates="deliverables")


class ChangeRequest(Base):
    """Demande de modification / Change Request."""
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    cost_impact = Column(Float, default=0.0)
    schedule_impact_days = Column(Integer, default=0)
    status = Column(String, default="pending")  # pending, approved, rejected
    requested_by = Column(String, nullable=True)
    approved_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
