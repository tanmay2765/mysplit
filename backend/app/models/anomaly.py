# Anomaly Model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.database import Base


class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True)

    anomaly_type = Column(String)

    description = Column(Text)

    action_taken = Column(Text)

    severity = Column(String)