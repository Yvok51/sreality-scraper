# Srealirt scraper

Scrape the first 500 items (title, image url) from sreality.cz (flats, sell - you can switch the web to English) and save it in the Postgresql database. Implement a simple HTTP server (or use Nginx) and show these 500 items on a nice page (with pagination)  which will use your own design and put everything to single docker-compose command so that I can just run "docker-compose up" in the Github repository and see the scraped ads on http://127.0.0.1:8080 page. Use Typescript and React for implementation.

## Setup

Run `docker-compose up` and wait for the apartments to be scraped (takes about 2 minutes). Afterwards connect to `http://localhost:8080` for the scraped apartments.

