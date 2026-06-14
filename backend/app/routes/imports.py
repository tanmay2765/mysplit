from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

from app.services.import_service import process_csv

router = APIRouter(
    prefix="/import",
    tags=["CSV Import"]
)


@router.post("/")
async def import_csv(
    file: UploadFile = File(...)
):
    result = process_csv(file.file)

    return result