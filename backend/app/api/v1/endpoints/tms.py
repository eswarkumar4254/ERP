from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api import deps
from app.models.domain import TransportRoute, Vehicle, TransportMapping
from app.repositories.base import BaseRepository
from pydantic import BaseModel

class RouteSchema(BaseModel):
    id: int
    title: str
    vehicle_number: str
    driver_name: str
    monthly_fee: float
    start_point: str = None
    end_point: str = None
    class Config:
        from_attributes = True

router = APIRouter(dependencies=[Depends(deps.requires_service("TMS"))])
route_repo = BaseRepository(TransportRoute)

@router.get("/routes", response_model=List[RouteSchema])
def get_routes(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Transport Logistics: View available routes."""
    return route_repo.get_multi(db, user=current_user)

@router.post("/routes", response_model=RouteSchema)
def create_route(
    route_in: RouteSchema,
    db: Session = Depends(get_db),
    current_user = Depends(deps.requires_permission("manage_transport"))
):
    """Transport Manager: Define new route."""
    return route_repo.create(db, obj_in=route_in.dict(exclude={"id"}), user=current_user)
@router.get("/fleet/status")
def get_fleet_status(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """View real-time status of all vehicles."""
    return [
        {"id": 1, "bus_no": "BUS-042", "route": "Guntur-Main", "status": "Moving", "speed": 45, "fuel": 78},
        {"id": 2, "bus_no": "BUS-012", "route": "Vijayawada-City", "status": "Stopped", "speed": 0, "fuel": 12},
        {"id": 3, "bus_no": "BUS-088", "route": "Tenali-Express", "status": "Maintenance", "speed": 0, "fuel": 95}
    ]

@router.get("/commuters")
def get_commuter_list(
    db: Session = Depends(get_db),
    current_user = Depends(deps.allow_hod)
):
    """HOD/Transport Admin: View list of students registered for transport."""
    return [
        {"id": 1, "name": "Rahul Sharma", "route": "Guntur-Main", "stop": "Signal Point", "fee_status": "Paid"},
        {"id": 2, "name": "Sneha Reddy", "route": "Vijayawada-City", "stop": "Benz Circle", "fee_status": "Overdue"}
    ]

@router.get("/drivers/rankings")
def get_driver_rankings(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """View driver performance based on safety and punctuality."""
    return [
        {"name": "Srinivas Rao", "rating": 4.9, "experience": "12 yrs", "safety_score": 98},
        {"name": "Venkatesh K.", "rating": 4.7, "experience": "8 yrs", "safety_score": 95}
    ]
