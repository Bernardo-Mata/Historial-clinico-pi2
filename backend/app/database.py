from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from pathlib import Path

# Obtener la ruta del directorio backend
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / '.env'

# Cargar el archivo .env
load_dotenv(dotenv_path=env_path)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Usar los nombres de variables que tienes en tu .env
MYSQL_USER = os.getenv("DB_USER")
MYSQL_PASSWORD = os.getenv("DB_PASSWORD")
MYSQL_HOST = os.getenv("DB_HOST")
MYSQL_DB = os.getenv("DB_NAME")


SQLALCHEMY_DATABASE_URL = (
    f"mysql+mysqldb://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()