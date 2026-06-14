# ImportReport Model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text

from app.database import Base


class ImportReport(Base):
    __tablename__ = "import_reports"

    id = Column(Integer, primary_key=True)

    total_rows = Column(Integer)

    anomalies_found = Column(Integer)

    report_json = Column(Text)