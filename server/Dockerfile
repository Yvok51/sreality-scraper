# syntax=docker/dockerfile:1

FROM python:3.9

RUN useradd scraper

WORKDIR /home/scraper

RUN apt-get update
RUN apt-get install -y tar curl

RUN curl -L https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz --output geckodriver.tar.gz
RUN tar -xvzf geckodriver.tar.gz
ENV PATH="${PATH}:/home/scraper/geckodriver"

RUN apt-get update
RUN apt-get install -y firefox-esr

COPY requirements.txt ./
RUN python3 -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY . .
RUN chmod +x boot.sh

EXPOSE 5000

RUN chown -R scraper:scraper ./
USER scraper

ENTRYPOINT [ "./boot.sh" ]
