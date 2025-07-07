from fastapi import FastAPI
from core.database import engine
from models.models import Base
from api.v1.endpoints.users import router as user_router

app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(user_router, prefix="/api", tags=["users"])