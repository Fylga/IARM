from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
import logging

logger = logging.getLogger(__name__)

# Attempting to retrieve Azure environment variables
def get_db_config() -> dict[str, str]:
    logger.info("Retrieving database connection parameters")

    required_params = {
        "DBHOST": "host",
        "DBUSER": "user",
        "DBPASS": "password"
    }

    missing_params = []

    for env_var, param_name in required_params.items():
        value = os.environ.get(env_var)
        if not value:
            missing_params.append(env_var)
        config[param_name] = value

    if missing_params:
        error_msg = f"Missing required database parameters: {', '.join(missing_params)}"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    config["database"] = os.environ.get("DBNAME", "postgres")
    config["port"] = os.environ.get("DBPORT", 5432)

    return config

try:
    db_config = get_db_config()
    db_url = f"postgresql+asyncpg://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
except ValueError as e:
    logger.error(f"Configuration error: {e}")

engine = create_async_engine(db_url, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session
