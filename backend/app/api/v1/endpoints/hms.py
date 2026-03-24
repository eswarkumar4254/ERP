from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.domain import Hostel, Room, HostelAllocation
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class RoomSchema(BaseModel):
    id: int
    room_number: str
    floor: int
    capacity: int
    occupied: int
    price_per_month: float
    class Config:
        from_attributes = True

router = APIRouter(dependencies=[Depends(deps.requires_service("HMS"))])
room_repo = BaseRepository(Room)

@router.get("/rooms", response_model=List[RoomSchema])
def get_rooms(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Hostel Residency: View available rooms based on role scoping."""
    return room_repo.get_multi(db, user=current_user)

@router.post("/rooms", response_model=RoomSchema)
def create_room(
    room_in: RoomSchema,
    db: Session = Depends(get_db),
    current_user = Depends(deps.requires_permission("manage_hostel"))
):
    """Hostel Warden: Add new room capacity."""
    # Note: In a real app, we'd use a CreateSchema that doesn't include id
    return room_repo.create(db, obj_in=room_in.dict(exclude={"id"}), user=current_user)
@router.get("/residents")
def get_residents(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """Hostel Warden/Admin: View list of residents and their room info."""
    # Mock data for demo
    return [
        {"id": 1, "name": "Rahul Sharma", "room": "A-101", "course": "B.Tech CSE", "balance": 0},
        {"id": 2, "name": "Sneha Reddy", "room": "B-204", "course": "MBA", "balance": 1500},
        {"id": 3, "name": "Amit Kumar", "room": "A-105", "course": "B.Com", "balance": 0}
    ]

@router.get("/maintenance")
def get_maintenance_requests(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """View active maintenance tickets."""
    return [
        {"id": 101, "room": "A-101", "issue": "Fan not working", "status": "Pending", "priority": "High"},
        {"id": 102, "room": "C-302", "issue": "Tap leakage", "status": "In-Progress", "priority": "Medium"}
    ]

@router.get("/mess/menu")
def get_mess_menu(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Get the current week's mess menu."""
    return {
        "Monday": {"Breakfast": "Idli Sambar", "Lunch": "Rice, Dal, Veg Curry", "Dinner": "Roti, Sabzi"},
        "Tuesday": {"Breakfast": "Puri Bhaji", "Lunch": "Veg Biryani", "Dinner": "Rice, Sambhar"},
        "Wednesday": {"Breakfast": "Dosa", "Lunch": "Curd Rice, Fried Rice", "Dinner": "Paneer Curry, Roti"}
    }

@router.get("/outpass/logs")
def get_outpass_logs(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """View active outpass requests and historical logs."""
    return [
        {"id": 1, "student": "Rahul Sharma", "reason": "Home Visit", "status": "Approved", "out_time": "2026-03-15 10:00", "expected_in": "2026-03-17 18:00"},
        {"id": 2, "student": "Amit Kumar", "reason": "Medical", "status": "Pending", "out_time": "N/A", "expected_in": "N/A"}
    ]
