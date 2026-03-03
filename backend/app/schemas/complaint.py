from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    assigned_to: Optional[str]
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
