from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base
from app.database import engine

from app.models import *

from app.routes.auth import router as auth_router
from app.routes.groups import router as group_router
from app.routes.expenses import router as expense_router
from app.routes.imports import router as import_router
from app.routes.balances import router as balance_router
from app.routes.settlements import router as settlement_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shared Expense App API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(group_router)
app.include_router(expense_router)
app.include_router(import_router)
app.include_router(balance_router)
app.include_router(settlement_router)


@app.get("/")
def root():
    return {"message": "Shared Expense API Running"}


@app.get("/health")
def health():
    return {"status": "healthy"}