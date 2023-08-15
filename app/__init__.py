from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging
from logging.handlers import RotatingFileHandler
import os


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


from app import routes, models, save_scraped_data

if not app.debug:
    if not os.path.exists("logs"):
        os.mkdir("logs")
    logs_handler = RotatingFileHandler(
        "logs/scraper.log", maxBytes=10240, backupCount=10
    )
    logs_handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
        )
    )
    logs_handler.setLevel(logging.INFO)
    app.logger.addHandler(logs_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info("sreality.cz scraper starting")


def delete_previous():
    app.logger.info("Deleting any previous scraped apartments")
    models.Image.query.delete()
    models.Apartment.query.delete()


with app.app_context():
    delete_previous()
    app.logger.info("Starting scraping and database initialization")
    save_scraped_data.init_db()
    app.logger.info("Apartments scraped, starting server...")
