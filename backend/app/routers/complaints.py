from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.post("/", response_model=ComplaintResponse)
def create_complaint(complaint: ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_complaint = Complaint(**complaint.dict(), owner_id=current_user.id)
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Complaint).filter(Complaint.owner_id == current_user.id).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id, Complaint.owner_id == current_user.id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(complaint_id: int, complaint_update: ComplaintUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id, Complaint.owner_id == current_user.id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    for var, value in complaint_update.dict(exclude_unset=True).items():
        setattr(db_complaint, var, value)
    
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.delete("/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_complaint(complaint_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id, Complaint.owner_id == current_user.id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db.delete(db_complaint)
    db.commit()
    return None
