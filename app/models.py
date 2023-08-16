from app import db


class Apartment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    locality = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    images = db.relationship("Image", backref="apartment", lazy="dynamic")

    def __repr__(self):
        return f"<Apartment {self.name}>"

    def get_json_serializible(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "locality": self.locality,
            "price": self.price,
            "images": [image.get_json_serializible() for image in self.images],
        }


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    apartment_id = db.Column(db.Integer, db.ForeignKey("apartment.id"))

    def __repr__(self):
        return f"<Image {self.url}>"

    def get_json_serializible(self):
        return {"id": self.id, "url": self.url}
