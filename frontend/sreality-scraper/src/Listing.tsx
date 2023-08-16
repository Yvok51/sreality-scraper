import { useState } from 'react';

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
    <section aria-label={name}>
      <header>
        <h2>
          <a href={url}>{name}</a>
        </h2>
      </header>
      <p>{locality}</p>
      <p>{price}</p>
      <button onClick={prevImage}>⇦</button>
      <img src={images[index]}></img>
      <button onClick={nextImage}>⇨</button>
    </section>
  );
}
