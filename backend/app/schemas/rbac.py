from pydantic import BaseModel
from typing import List, Optional

class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None

class Permission(PermissionBase):
    id: int
    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    name: str
    full_name: str
    description: Optional[str] = None

class Module(ModuleBase):
    id: int
    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []
    modules: List[Module] = []
    class Config:
        from_attributes = True
