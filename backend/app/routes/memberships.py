from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.membership import Membership
from app.schemas.membership import MembershipCreate, MembershipResponse

router = APIRouter(
    prefix="/memberships",
    tags=["Memberships"]
)

@router.post("/", response_model=MembershipResponse)
def create_membership(
    membership: MembershipCreate,
    db: Session = Depends(get_db)
):
    joined = membership.joined_at or date.today()
    new_membership = Membership(
        user_id=membership.user_id,
        group_id=membership.group_id,
        joined_at=joined
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)
    return new_membership

@router.get("/group/{group_id}", response_model=list[MembershipResponse])
def get_group_memberships(
    group_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Membership).filter(Membership.group_id == group_id).all()


@router.delete("/group/{group_id}/user/{user_id}")
def delete_membership(
    group_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    membership = db.query(Membership).filter(
        Membership.group_id == group_id,
        Membership.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    db.delete(membership)
    db.commit()
    return {"message": "Membership deleted successfully"}

