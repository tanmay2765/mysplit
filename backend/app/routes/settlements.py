from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.settlement import Settlement

router = APIRouter(
    prefix="/settlements",
    tags=["Settlements"]
)


@router.get("/")
def get_settlements(
    db: Session = Depends(get_db)
):

    return db.query(
        Settlement
    ).all()