from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# --- User Schemas ---
class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "consultant"
    preferred_language: str = "fr"


class UserLogin(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    preferred_language: str
    telegram_chat_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# --- Project Schemas ---
class ProjectCreate(BaseModel):
    name: str
    location: Optional[str] = None
    client: Optional[str] = None
    description: Optional[str] = None
    planned_start_date: str  # ISO format date
    planned_end_date: str
    total_budget: float = 0.0
    currency: str = "TND"
    bed_count: int = 300
    hse_enabled: bool = False


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    client: Optional[str] = None
    description: Optional[str] = None
    planned_start_date: Optional[str] = None
    planned_end_date: Optional[str] = None
    actual_start_date: Optional[str] = None
    actual_end_date: Optional[str] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    bed_count: Optional[int] = None
    hse_enabled: Optional[bool] = None


class ProjectRead(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    client: Optional[str] = None
    description: Optional[str] = None
    planned_start_date: Optional[str] = None
    planned_end_date: Optional[str] = None
    actual_start_date: Optional[str] = None
    actual_end_date: Optional[str] = None
    total_budget: float
    currency: str
    status: str
    bed_count: int
    hse_enabled: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Contractor Schemas ---
class ContractorCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    specialty: Optional[str] = None


class ContractorRead(BaseModel):
    id: int
    project_id: int
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    specialty: Optional[str] = None

    class Config:
        from_attributes = True


# --- Lot (Scope) Schemas ---
class LotCreate(BaseModel):
    name: str
    description: Optional[str] = None
    contractor_id: Optional[int] = None


class LotRead(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str] = None
    contractor_id: Optional[int] = None
    status: str

    class Config:
        from_attributes = True


# --- Deliverable Schemas ---
class DeliverableCreate(BaseModel):
    name: str
    description: Optional[str] = None
    due_date: Optional[str] = None


class DeliverableRead(BaseModel):
    id: int
    lot_id: int
    name: str
    description: Optional[str] = None
    status: str
    due_date: Optional[str] = None

    class Config:
        from_attributes = True


# --- Change Request Schemas ---
class ChangeRequestCreate(BaseModel):
    title: str
    description: str
    lot_id: Optional[int] = None
    cost_impact: float = 0.0
    schedule_impact_days: int = 0
    requested_by: Optional[str] = None


class ChangeRequestRead(BaseModel):
    id: int
    project_id: int
    lot_id: Optional[int] = None
    title: str
    description: str
    cost_impact: float
    schedule_impact_days: int
    status: str
    requested_by: Optional[str] = None
    approved_by: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Activity (Schedule) Schemas ---
class ActivityCreate(BaseModel):
    name: str
    lot_id: Optional[int] = None
    description: Optional[str] = None
    wbs_code: Optional[str] = None
    planned_start: str
    planned_end: str
    planned_value: float = 0.0
    weight: float = 1.0
    predecessor_ids: Optional[str] = None


class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    planned_progress: Optional[float] = None
    actual_progress: Optional[float] = None
    earned_value: Optional[float] = None
    actual_cost: Optional[float] = None
    status: Optional[str] = None


class ActivityRead(BaseModel):
    id: int
    project_id: int
    lot_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    wbs_code: Optional[str] = None
    planned_start: Optional[str] = None
    planned_end: Optional[str] = None
    actual_start: Optional[str] = None
    actual_end: Optional[str] = None
    planned_progress: float
    actual_progress: float
    planned_value: float
    earned_value: float
    actual_cost: float
    weight: float
    status: str
    predecessor_ids: Optional[str] = None

    class Config:
        from_attributes = True


# --- Budget Schemas ---
class BudgetCreate(BaseModel):
    lot_id: int
    initial_budget: float = 0.0


class BudgetUpdate(BaseModel):
    committed_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    estimate_at_completion: Optional[float] = None


class BudgetRead(BaseModel):
    id: int
    project_id: int
    lot_id: int
    initial_budget: float
    committed_cost: float
    actual_cost: float
    estimate_at_completion: float

    class Config:
        from_attributes = True


# --- Invoice Schemas ---
class InvoiceCreate(BaseModel):
    lot_id: Optional[int] = None
    invoice_number: str
    amount: float
    description: Optional[str] = None
    date: str
    status: str = "pending"


class InvoiceRead(BaseModel):
    id: int
    project_id: int
    lot_id: Optional[int] = None
    invoice_number: str
    amount: float
    description: Optional[str] = None
    date: Optional[str] = None
    status: str
    file_path: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Variation Schemas ---
class VariationCreate(BaseModel):
    lot_id: Optional[int] = None
    title: str
    amount: float
    description: Optional[str] = None
    justification: Optional[str] = None


class VariationRead(BaseModel):
    id: int
    project_id: int
    lot_id: Optional[int] = None
    title: str
    amount: float
    description: Optional[str] = None
    justification: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Personnel Schemas ---
class PersonnelCreate(BaseModel):
    full_name: str
    role: str
    company: Optional[str] = None
    lot_id: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class PersonnelRead(BaseModel):
    id: int
    project_id: int
    full_name: str
    role: str
    company: Optional[str] = None
    lot_id: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

    class Config:
        from_attributes = True


# --- Daily Attendance Schemas ---
class DailyAttendanceCreate(BaseModel):
    date: str
    company: str
    lot_id: Optional[int] = None
    workers_count: int = 0
    engineers_count: int = 0
    technicians_count: int = 0
    notes: Optional[str] = None


class DailyAttendanceRead(BaseModel):
    id: int
    project_id: int
    date: Optional[str] = None
    company: str
    lot_id: Optional[int] = None
    workers_count: int
    engineers_count: int
    technicians_count: int

    class Config:
        from_attributes = True


# --- Inspection Schemas ---
class InspectionCreate(BaseModel):
    lot_id: Optional[int] = None
    inspection_type: str
    date: str
    inspector: str
    result: str = "pending"
    observations: Optional[str] = None


class InspectionRead(BaseModel):
    id: int
    project_id: int
    lot_id: Optional[int] = None
    inspection_type: str
    date: Optional[str] = None
    inspector: str
    result: str
    observations: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- NCR Schemas ---
class NCRCreate(BaseModel):
    inspection_id: Optional[int] = None
    lot_id: Optional[int] = None
    ncr_number: str
    description: str
    corrective_action: Optional[str] = None
    responsible: Optional[str] = None
    deadline: Optional[str] = None
    severity: str = "minor"


class NCRRead(BaseModel):
    id: int
    project_id: int
    ncr_number: str
    description: str
    corrective_action: Optional[str] = None
    responsible: Optional[str] = None
    deadline: Optional[str] = None
    status: str
    severity: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Communication Schemas ---
class CommunicationCreate(BaseModel):
    comm_type: str
    date: str
    subject: str
    content: Optional[str] = None
    participants: Optional[str] = None


class CommunicationRead(BaseModel):
    id: int
    project_id: int
    comm_type: str
    date: Optional[str] = None
    subject: str
    content: Optional[str] = None
    participants: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Action Item Schemas ---
class ActionItemCreate(BaseModel):
    communication_id: int
    description: str
    assigned_to: Optional[str] = None
    deadline: Optional[str] = None


class ActionItemRead(BaseModel):
    id: int
    project_id: int
    communication_id: int
    description: str
    assigned_to: Optional[str] = None
    deadline: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


# --- Risk Schemas ---
class RiskCreate(BaseModel):
    description: str
    category: str
    probability: str = "medium"
    impact: str = "moderate"
    mitigation_plan: Optional[str] = None
    responsible: Optional[str] = None
    lot_id: Optional[int] = None


class RiskRead(BaseModel):
    id: int
    project_id: int
    description: str
    category: str
    probability: str
    impact: str
    score: float
    mitigation_plan: Optional[str] = None
    responsible: Optional[str] = None
    status: str
    lot_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Dashboard Schemas ---
class DashboardKPIs(BaseModel):
    overall_progress_planned: float
    overall_progress_actual: float
    spi: float  # Schedule Performance Index
    cpi: float  # Cost Performance Index
    budget_consumed_pct: float
    days_remaining: int
    total_budget: float
    total_actual_cost: float
    active_critical_risks: int
    open_ncrs: int
    pending_change_requests: int
    total_personnel_today: int


class SCurveData(BaseModel):
    week_date: str
    planned_progress: float
    actual_progress: float
    planned_value: float
    earned_value: float
    actual_cost: float


class RiskMatrixCell(BaseModel):
    probability: str
    impact: str
    count: int
    risks: list[dict]
