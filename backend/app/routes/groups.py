from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.group import Group

from app.schemas.group import GroupCreate

router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)


@router.post("/")
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db)
):
    new_group = Group(
        name=group.name
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return new_group


@router.get("/")
def get_groups(
    db: Session = Depends(get_db)
):
    return db.query(Group).all()