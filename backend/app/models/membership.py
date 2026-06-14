# Membership Model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import Date

from app.database import Base


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    group_id = Column(
        Integer,
        ForeignKey("groups.id")
    )

    joined_at = Column(Date)

    left_at = Column(Date, nullable=True)