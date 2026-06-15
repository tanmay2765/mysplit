from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.settlement import Settlement
from app.schemas.settlement import SettlementCreate, SettlementResponse

router = APIRouter(
    prefix="/settlements",
    tags=["Settlements"]
)


@router.post("/", response_model=SettlementResponse)
def create_settlement(
    settlement: SettlementCreate,
    db: Session = Depends(get_db)
):
    s_date = settlement.settlement_date or date.today()
    new_settlement = Settlement(
        payer_id=settlement.payer_id,
        receiver_id=settlement.receiver_id,
        group_id=settlement.group_id,
        amount=settlement.amount,
        settlement_date=s_date
    )
    db.add(new_settlement)
    db.commit()
    db.refresh(new_settlement)
    return new_settlement


@router.get("/", response_model=list[SettlementResponse])
def get_settlements(
    db: Session = Depends(get_db)
):
    return db.query(Settlement).all()