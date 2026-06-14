from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.expense import Expense

from app.schemas.expense import ExpenseCreate

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


@router.post("/")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    new_expense = Expense(**expense.model_dump())

    db.add(new_expense)

    db.commit()

    db.refresh(new_expense)

    return new_expense


@router.get("/")
def get_expenses(
    db: Session = Depends(get_db)
):
    return db.query(Expense).all()