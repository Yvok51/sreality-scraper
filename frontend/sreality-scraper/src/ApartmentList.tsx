import { useState } from 'react';
import useGet from './useGet';
import Listing from './Listing';
import { Pagination } from './Pagination';

const APARTMENTS_URL = '/api/apartment';

function create_url(base: string, searchParams: URLSearchParams): string {
  return base.toString() + '?' + searchParams.toString();
}

function apartment_url(page: number, perPage: number): string {
  return create_url(APARTMENTS_URL, new URLSearchParams({ page: page.toString(), per_page: perPage.toString() }));
}

interface Image {
  id: number;
  url: string;
}

interface Apartment {
  id: number;
  name: string;
  url: string;
  locality: string;
  price: string;
  images: Image[];
}

interface ApartmentResponse {
  apartments: Apartment[];
  pages_count: number;
}

export default function ApartmentList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const { data, error, loading } = useGet<ApartmentResponse>(apartment_url(page, perPage));

  function handlePageChange(page: number) {
    setPage(page);
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  if (!data || !data.apartments) {
    return <h1>Nothing here</h1>;
  }

  const listings = data.apartments.map(apart => {
    return (
      <Listing
        key={apart.id}
        name={apart.name}
        url={apart.url}
        locality={apart.locality}
        price={apart.price}
        images={apart.images.map(img => img.url)}
      />
    );
  });

  return (
    <section aria-labelledby="apartment-heading">
      <header>
        <h2 id="apartment-heading">Apartment listing</h2>
      </header>
      <div>
        <label htmlFor="per-page">Per page:</label>
        <select name="per-page" defaultValue={`${perPage}`} onChange={e => setPerPage(+e.target.value)}>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="60">60</option>
        </select>
      </div>
      {listings}
      <footer>
        <Pagination pageClick={handlePageChange} page={page} maxPage={data.pages_count} />
      </footer>
    </section>
  );
}
