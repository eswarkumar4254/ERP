from fastapi import APIRouter, Depends
from datetime import datetime
from app.api import deps
from pydantic import BaseModel

router = APIRouter(dependencies=[Depends(deps.get_current_user)])

# In-memory store for broadcasts to prevent 404s and handle UI state
MOCK_BROADCASTS = [
    {
        "id": 1,
        "title": "Welcome to Communication Mesh",
        "content": "This is a broadcast test.",
        "target_group": "all",
        "created_at": datetime.now().isoformat()
    }
]

class BroadcastCreate(BaseModel):
    title: str
    content: str
    target_group: str
    sender_id: int = 1

@router.get("/")
def get_broadcasts():
    return MOCK_BROADCASTS

@router.post("/")
def create_broadcast(payload: BroadcastCreate):
    new_id = len(MOCK_BROADCASTS) + 1
    new_broadcast = {
        "id": new_id,
        "title": payload.title,
        "content": payload.content,
        "target_group": payload.target_group,
        "created_at": datetime.now().isoformat()
    }
    MOCK_BROADCASTS.insert(0, new_broadcast)
    return new_broadcast
