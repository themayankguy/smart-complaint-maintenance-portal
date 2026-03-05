from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintResponse, ComplaintAssign, ComplaintStatusUpdate, ComplaintAnalytics
from app.utils.security import get_current_user, RoleChecker
from app.models.user import User
from sqlalchemy import func
from datetime import datetime
import pytz

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.get("/analytics", response_model=ComplaintAnalytics)
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(RoleChecker(["admin"]))):
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == "pending").count()
    assigned = db.query(Complaint).filter(Complaint.status == "assigned").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "in_progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "resolved").count()
    closed = db.query(Complaint).filter(Complaint.status == "closed").count()
    
    # Calculate categories
    categories_data = db.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).all()
    categories_dict = {cat: count for cat, count in categories_data}
    
    # Calculate average resolution time (in hours)
    resolved_complaints = db.query(Complaint).filter(Complaint.status.in_(["resolved", "closed"]), Complaint.resolved_at.isnot(None), Complaint.created_at.isnot(None)).all()
    
    total_hours = 0
    if resolved_complaints:
        for comp in resolved_complaints:
            # Ensure both are timezone aware for subtraction
            created = comp.created_at
            resolved_time = comp.resolved_at
            if created.tzinfo is None:
                created = created.replace(tzinfo=pytz.UTC)
            if resolved_time.tzinfo is None:
                resolved_time = resolved_time.replace(tzinfo=pytz.UTC)
            
            diff = resolved_time - created
            total_hours += diff.total_seconds() / 3600.0
            
        avg_resolution_hours = total_hours / len(resolved_complaints)
    else:
        avg_resolution_hours = 0.0

    return {
        "total": total,
        "pending": pending,
        "assigned": assigned,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed,
        "avg_resolution_hours": round(avg_resolution_hours, 1),
        "categories": categories_dict
    }

@router.post("/", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_complaint = Complaint(**complaint.dict(), owner_id=current_user.id)
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        return db.query(Complaint).all()
    elif current_user.role == "technician":
        return db.query(Complaint).filter(Complaint.assigned_to == current_user.username).all()
    return db.query(Complaint).filter(Complaint.owner_id == current_user.id).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Complaint).filter(Complaint.id == complaint_id)
    if current_user.role == "admin":
        complaint = query.first()
    elif current_user.role == "technician":
        complaint = query.filter(Complaint.assigned_to == current_user.username).first()
    else:
        complaint = query.filter(Complaint.owner_id == current_user.id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}/assign", response_model=ComplaintResponse)
def assign_complaint(complaint_id: int, assign_data: ComplaintAssign, db: Session = Depends(get_db), current_user: User = Depends(RoleChecker(["admin"]))):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    technician = db.query(User).filter(User.username == assign_data.assigned_to, User.role == "technician").first()
    if not technician:
        raise HTTPException(status_code=400, detail="Technician not found or user is not a technician")
    
    complaint.assigned_to = technician.username
    complaint.status = "assigned"
    db.commit()
    db.refresh(complaint)
    return complaint

@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(complaint_id: int, status_update: ComplaintStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(RoleChecker(["technician"]))):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id, Complaint.assigned_to == current_user.username).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found or not assigned to you")
    
    allowed_statuses = ["in_progress", "resolved", "closed"]
    if status_update.status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {', '.join(allowed_statuses)}")
    
    complaint.status = status_update.status
    
    if status_update.status in ["resolved", "closed"] and not complaint.resolved_at:
        complaint.resolved_at = datetime.utcnow()
        
    db.commit()
    db.refresh(complaint)
    return complaint

@router.delete("/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_complaint(complaint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Complaint).filter(Complaint.id == complaint_id)
    if current_user.role != "admin":
        query = query.filter(Complaint.owner_id == current_user.id)
    
    db_complaint = query.first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db.delete(db_complaint)
    db.commit()
    return None
