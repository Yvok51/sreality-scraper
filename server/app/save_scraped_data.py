from app import app, db, scrape_apartments
from app.models import Apartment, Image


def init_db():
    """
    Initialize the database i.e. scrape the apartments and insert them into the database
    """
    app.logger.info("Starting scraping...")
    apartments = scrape_apartments.scrape_info()
    app.logger.info(f"Scraping done - {len(apartments)} apartments scraped")
    app.logger.info("Adding scraped apartments to database...")
    db.session.add_all(create_apartments(apartments))
    db.session.commit()
    app.logger.info("Apartments added")


def create_apartments(apartments):
    """
    Create the Apartment objects to insert into database

    :param apartments: Information about apartments to insert
    :return: The Apartment objects to insert
    """
    data = []
    for apart in apartments:
        apartment = Apartment(
            name=apart["name"],
            url=apart["url"],
            locality=apart["locality"],
            price=apart["price"],
        )
        apartment.images = create_images(apartment, apart["images"])
        data.append(apartment)

    return data


def create_images(apartment: Apartment, image_urls: list[str]):
    """
    Create the Image objects which we will insert into database

    :param apartment: The apartment the images belong to
    :param image_urls: The images to add
    :return: The created Image objects
    """
    return [Image(url=url, apartment=apartment) for url in image_urls]
