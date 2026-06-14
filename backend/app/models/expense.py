from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import ForeignKey

from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)

    title = Column(String)

    amount = Column(Float)

    currency = Column(String)

    split_type = Column(String)

    expense_date = Column(Date)

    paid_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    group_id = Column(
        Integer,
        ForeignKey("groups.id")
    )