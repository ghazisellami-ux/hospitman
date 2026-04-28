from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func

from app.database import Base

# Probability and Impact scoring map
PROBABILITY_SCORES = {
    "very_low": 1,
    "low": 2,
    "medium": 3,
    "high": 4,
    "very_high": 5,
}

IMPACT_SCORES = {
    "minor": 1,
    "moderate": 2,
    "major": 3,
    "critical": 4,
}


class Risk(Base):
    """Risk register entry."""
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # technical, financial, schedule, hse, contractual
    probability = Column(String, default="medium")  # very_low, low, medium, high, very_high
    impact = Column(String, default="moderate")  # minor, moderate, major, critical
    score = Column(Float, default=0.0)  # Auto-calculated: probability × impact
    mitigation_plan = Column(Text, nullable=True)
    responsible = Column(String, nullable=True)
    status = Column(String, default="identified")  # identified, mitigating, resolved, accepted
    lot_id = Column(Integer, ForeignKey("lots.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @staticmethod
    def calculate_score(probability: str, impact: str) -> float:
        p = PROBABILITY_SCORES.get(probability, 3)
        i = IMPACT_SCORES.get(impact, 2)
        return float(p * i)
