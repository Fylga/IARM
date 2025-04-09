from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging
from urllib.parse import quote_plus
from datetime import datetime

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)

db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DATABASE_URL")
db_name = os.getenv("DB_NAME")
db_port = os.getenv("DB_PORT")

sql_url = 'postgresql://{}:{}@{}:{}/{}?sslmode={}'.format(db_user, db_password, db_host, db_port, db_name, "require")

engine = create_engine(sql_url, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session
