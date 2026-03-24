from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.user import User
from app.schemas.base import UserCreate
from jose import jwt # Will be used for auth logic later

class UserRepository(BaseRepository[User]):
    def get_by_email(self, db: Session, email: str) -> User:
        return db.query(self.model).filter(self.model.email == email).first()

user_repo = UserRepository(User)
