from pydantic import BaseModel
from datetime import date


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    currency: str
    split_type: str
    expense_date: date
    paid_by: int
    group_id: int