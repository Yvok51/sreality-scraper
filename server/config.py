import os


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key"
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL")
        or "postgresql://postgres:postgres@localhost/postgres"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SCRAPED_APARTMENTS = int(os.environ.get("SCRAPED_APARTMENTS") or "500")
