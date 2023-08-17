from flask import request, jsonify

from app import app, models


@app.route("/api/apartment")
def index():
    page = request.args.get("page", 1, type=int)
    apart_per_page = request.args.get("per_page", 20, type=int)
    app.logger.info(
        f"Request {request} received - page: {page}, per page: {apart_per_page}"
    )
    apartments = models.Apartment.query.paginate(
        page=page, per_page=apart_per_page, error_out=False
    )
    return jsonify(
        {
            "apartments": [
                apartment.get_json_serializible() for apartment in apartments.items
            ],
            "pages_count": apartments.pages,
        }
    )
