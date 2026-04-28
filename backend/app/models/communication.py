from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Communication(Base):
    """Communication record — meetings, RFIs, correspondence."""
    __tablename__ = "communications"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    comm_type = Column(String, nullable=False)  # meeting, minutes, correspondence, rfi
    date = Column(Date, nullable=False)
    subject = Column(String, nullable=False)
    content = Column(Text, nullable=True)  # PV / body
    participants = Column(String, nullable=True)  # JSON array of names
    attachments = Column(String, nullable=True)  # JSON array of file paths
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to action items handled via foreign key in ActionItem


class ActionItem(Base):
    """Action item arising from a communication."""
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    communication_id = Column(Integer, ForeignKey("communications.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    description = Column(Text, nullable=False)
    assigned_to = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(String, default="open")  # open, in_progress, closed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
