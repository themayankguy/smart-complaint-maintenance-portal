from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str = "General"

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    assigned_to: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    assigned_to: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]
    owner_id: int

    class Config:
        from_attributes = True

class ComplaintAssign(BaseModel):
    assigned_to: str # Must be a technician username or ID, but model uses String

class ComplaintStatusUpdate(BaseModel):
    status: str # in_progress, resolved, closed

class ComplaintAnalytics(BaseModel):
    total: int
    pending: int
    assigned: int
    in_progress: int
    resolved: int
    closed: int
    avg_resolution_hours: float
    categories: dict
