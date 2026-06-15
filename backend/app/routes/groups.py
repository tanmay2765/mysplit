from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.group import Group
from app.models.membership import Membership
from app.models.expense import Expense

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


@router.delete("/{group_id}")
def delete_group(
    group_id: int,
    db: Session = Depends(get_db)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    # Clean up associated memberships & expenses
    db.query(Membership).filter(Membership.group_id == group_id).delete()
    db.query(Expense).filter(Expense.group_id == group_id).delete()

    db.delete(group)
    db.commit()

    return {"message": "Group deleted successfully"}