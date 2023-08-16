from time import sleep
from random import uniform
from urllib.parse import urlencode
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from app import app

SREALITY_URL = "https://www.sreality.cz"
FLATS_SEARCH_URL = SREALITY_URL + "/en/search/apartments"
FLATS_URL = SREALITY_URL + "/en/search/for-sale/apartments"


def main():
    print(scrape_info())


def scrape_info():
    """
    Scrape the first 500 apartment listings from sreality.cz
    :return: The apartment listings in the form {'name': str, 'url': str, 'locality': str, 'price': str, 'images': list[str]}
    """
    driver = setup_driver()
    try:
        get_through_consent(driver)
        apartments_info = scrape_apartments(driver, app.config["SCRAPED_APARTMENTS"])

    finally:
        driver.close()

    return apartments_info


def setup_driver():
    """
    Setup a webdriver for scraping

    :return: Selenium Firefox webdriver ready for scraping
    """
    opts = Options()
    opts.add_argument("-headless")
    assert opts.headless
    return webdriver.Firefox(options=opts)


def get_through_consent(driver):
    """
    Get through the consent dialog of sreality.cz
    """
    # When first visiting the sreality.cz website a consent dialog shows up.
    # The button to confirm choices is inside a closed shadow root and thus difficult to access.
    # However when we reload the page, the redirect does not happen again.
    driver = get_url(driver, FLATS_URL)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "szn-cmp-dialog-container"))
    )
    driver = get_url(driver, FLATS_URL)


def scrape_apartments(driver, apartments_to_scrape):
    """
    Scrape the apartment information of the first n listings from sreality.cz

    :param driver: The selenium webdriver to use
    :param apartments_to_scrape: The number of apartment listings to scrape
    :return: The first n listings for apartments
    """
    apartments = []
    page = 1
    while len(apartments) < apartments_to_scrape:
        url = get_page_url(FLATS_URL, page)
        driver = get_url(driver, url)
        scraped = scrape_single_page(driver)
        app.logger.info(
            f"Page {page} ({url}) scraped - {len(scraped)} apartments added"
        )
        apartments += scraped
        page += 1

    return apartments[:apartments_to_scrape]


def get_page_url(base, page_number):
    """
    Add the page number as a query to the base url

    :param base: The base url
    :param page_number: The number to set the page query variable to
    :return: The base url with a query containing page=page_number
    """
    return base + "?" + urlencode({"page": page_number})


def scrape_single_page(driver):
    """
    Scrape a single page for all apartment listings

    :param driver: driver to use with the page already loaded
    :return: Information about the apartment listings on the current page in the form {'name': str, 'url': str, 'locality': str, 'price': str, 'images': list[str]}
    """
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "dir-property-list"))
    )
    return list(
        map(lambda listing: get_aparment_info(listing), get_apartment_list(driver))
    )


def get_aparment_info(apartment_listing):
    """
    Get all of the information about a single apartment listing

    :param apartment_listing: The listing to get information about
    :return: Information about apartment listing in the form {'name': str, 'url': str, 'locality': str, 'price': str, 'images': list[str]}
    """
    name_element = get_element_by_class(apartment_listing, "span", "name")
    name = get_element_text(name_element)
    url = get_parent(name_element).get_attribute("href")
    locality = get_element_text(
        get_element_by_class(apartment_listing, "span", "locality")
    )
    price = get_element_text(get_element_by_class(apartment_listing, "span", "price"))
    images = get_apartment_image_urls(apartment_listing)

    return {
        "name": name,
        "url": url,
        "locality": locality,
        "price": price,
        "images": images,
    }


def get_element_text(element):
    """
    Get the inner text of an HTML element
    """
    return element.get_attribute("innerText").replace("\xa0", " ")


def get_apartment_image_urls(apartment_listing) -> list[str]:
    """
    Get the urls for the images used in an apartment listing
    """
    urls = []
    for img in apartment_listing.find_elements(By.TAG_NAME, "img"):
        urls.append(img.get_attribute("src"))
    return urls[:6]


def get_apartment_list(driver) -> list[any]:
    """
    Get the list of apartments listed on this page
    """
    apartment_list = driver.find_element(By.CLASS_NAME, "dir-property-list")
    return apartment_list.find_elements(By.CLASS_NAME, "property")


def get_element_by_class(parent_element, tag: str, class_name: str):
    """
    Get the first element that is of the given tag and is decorated with the given class
    """
    return parent_element.find_element(By.CSS_SELECTOR, f"{tag}.{class_name}")


def get_parent(element):
    """
    Get the direct parent of a selected element
    """
    return element.find_element(By.XPATH, "..")


def get_url(driver, url, sleep_min=0.3, sleep_max=0.7):
    """
    Load the driver with a new url
    """
    sleep_random_time(sleep_min, sleep_max)
    driver.get(url)
    return driver


def sleep_random_time(min_s, max_s):
    sleep(uniform(min_s, max_s))


if __name__ == "__main__":
    main()
