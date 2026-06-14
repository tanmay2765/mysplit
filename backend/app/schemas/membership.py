from pydantic import BaseModel
from datetime import date
from typing import Optional

class MembershipCreate(BaseModel):
    user_id: int
    group_id: int
    joined_at: Optional[date] = None

class MembershipResponse(BaseModel):
    id: int
    user_id: int
    group_id: int
    joined_at: date
    left_at: Optional[date] = None

    class Config:
        from_attributes = True
