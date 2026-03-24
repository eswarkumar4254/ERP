from app.repositories.base import BaseRepository
from app.models.tenant import Tenant

class TenantRepository(BaseRepository[Tenant]):
    pass

tenant_repo = TenantRepository(Tenant)
