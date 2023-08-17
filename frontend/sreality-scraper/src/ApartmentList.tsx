import { PropsWithChildren, useState } from 'react';
import useGet from './useGet';
import Listing from './Listing';
import { Pagination } from './Pagination';
import './assets/css/ApartmentList.css';

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

  function handlePerPageChange(newPerPage: number) {
    if (newPerPage !== perPage) {
      setPage(1);
      setPerPage(newPerPage);
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  const noApartments = !data || !data.apartments;
  if (noApartments) {
    return (
      <ApartmentHeader perPage={perPage} handlePerPageChange={perPage => {}}>
        <div>
          <p>We are sorry, no data is available</p>
        </div>
      </ApartmentHeader>
    );
  }

  const listings = data.apartments.map(apart => {
    return (
      <div key={apart.id} className="item-line-between">
        <Listing
          name={apart.name}
          url={apart.url}
          locality={apart.locality}
          price={apart.price}
          images={apart.images.map(img => img.url)}
        />
      </div>
    );
  });

  return (
    <ApartmentHeader perPage={perPage} handlePerPageChange={handlePerPageChange}>
      <div className="flex-column-line-between">{listings}</div>
      <footer>
        <Pagination pageClick={handlePageChange} page={page} maxPage={data.pages_count} />
      </footer>
    </ApartmentHeader>
  );
}

function ApartmentHeader({
  perPage,
  handlePerPageChange,
  children,
}: PropsWithChildren<{ perPage: number; handlePerPageChange: (newPerPage: number) => void }>) {
  return (
    <section aria-labelledby="apartment-heading" className="flex-column-around">
      <div className="apartment-list-header">
        <header>
          <h2 id="apartment-heading">Apartment listing</h2>
        </header>
        <div className="per-page">
          <label htmlFor="per-page">Per page: </label>
          <select name="per-page" defaultValue={`${perPage}`} onChange={e => handlePerPageChange(+e.target.value)}>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="60">60</option>
          </select>
        </div>
      </div>
      {children}
    </section>
  );
}
