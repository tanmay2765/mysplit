from pydantic import BaseModel
from datetime import date
from typing import Optional


class SettlementCreate(BaseModel):
    payer_id: int
    receiver_id: int
    group_id: int
    amount: float
    settlement_date: Optional[date] = None


class SettlementResponse(BaseModel):
    id: int
    payer_id: int
    receiver_id: int
    group_id: int
    amount: float
    settlement_date: date

    class Config:
        from_attributes = True
