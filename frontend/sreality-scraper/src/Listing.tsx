import { useState } from 'react';
import './assets/css/Listing.css';

interface ListingProps {
  name: string;
  url: string;
  locality: string;
  price: string;
  images: string[];
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function Listing({ name, url, locality, price, images }: ListingProps) {
  const [index, setIndex] = useState(0);

  function nextImage() {
    setIndex(prev => mod(prev + 1, images.length));
  }

  function prevImage() {
    setIndex(prev => mod(prev - 1, images.length));
  }

  return (
    <section aria-label={name} className="listing listing-box">
      <div className="listing-info">
        <header>
          <h2>
            <a href={url}>{name}</a>
          </h2>
        </header>
        <p className="light-text">{locality}</p>
        <p className="light-text">{price}</p>
      </div>
      <section className="listing-photo">
        <button className="listing-nav-btn back-btn primary-colors" onClick={prevImage}>
          ◄
        </button>
        <img src={images[index]}></img>
        <button className="listing-nav-btn forward-btn primary-colors" onClick={nextImage}>
          ►
        </button>
      </section>
    </section>
  );
}
