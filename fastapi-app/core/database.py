from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
import logging
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

logger = logging.getLogger(__name__)
config = {}

keyVaultName = os.environ.get("KEY_VAULT_NAME")
KVUri = f"https://{keyVaultName}.vault.azure.net"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=KVUri, credential=credential)

# Attempting to retrieve Azure environment variables
def get_db_config() -> dict[str, str]:
    logger.info("Retrieving database connection parameters")

    required_params = {
        "DBHOST": "host",
        "DBUSER": "user",
        "DBPASS": "password",
        "DBNAME": "database",
        "DBPORT": "port"
    }

    config = {}
    missing_params = []

    for secret_name, param_name in required_params.items():
        try:
            secret = client.get_secret(secret_name)
            config[param_name] = secret.value
        except Exception as e:
            logger.error(f"Error fetching secret {secret_name}: {e}")
            missing_params.append(secret_name)

    if missing_params:
        raise ValueError(f"Missing required database parameters: {', '.join(missing_params)}")

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
