from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

logger = logging.getLogger(__name__)
config = {}

keyVaultName = os.environ.get("KEY_VAULT_NAME")
KVUri = f"https://{keyVaultName}.vault.azure.net"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=KVUri, credential=credential)

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

    for env_var, param_name in required_params.items():
        try:
            secret = client.get_secret(env_var)
            value = secret.value
            if not value:
                missing_params.append(env_var)
            config[param_name] = value
        except Exception as e:
            logger.error(f"Failed to retrieve secret {env_var}: {e}")
            missing_params.append(env_var)

    if missing_params:
        raise ValueError(f"Missing required database parameters: {', '.join(missing_params)}")

    return config

try:
    db_config = get_db_config()
    DATABASE_URL = f"postgresql+asyncpg://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
except ValueError as e:
    logger.error(f"Configuration error: {e}")

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session
