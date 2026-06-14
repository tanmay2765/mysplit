from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.expense import Expense

from app.services.balance_service import (
    calculate_balances
)

router = APIRouter(
    prefix="/balances",
    tags=["Balances"]
)


@router.get("/")
def get_balances(
    db: Session = Depends(get_db)
):

    expenses = db.query(
        Expense
    ).all()

    balances = calculate_balances(
        expenses
    )

    return balances