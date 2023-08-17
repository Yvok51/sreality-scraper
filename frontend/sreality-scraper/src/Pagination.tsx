import { FunctionComponent } from 'react';

interface PaginationProps {
  pageClick: (page: number) => void;
  page: number;
  maxPage: number;
  neighbours?: number;
  startPage?: number;
}

export const Pagination: FunctionComponent<PaginationProps> = ({
  pageClick,
  page,
  maxPage,
  neighbours = 2,
  startPage = 1,
}: PaginationProps) => {
  const frontButton = page > startPage;
  const frontEllipses = page - neighbours - 1 > startPage;
  const backEllipses = page + neighbours + 1 < maxPage;
  const backButton = page < maxPage;

  const frontNeighbours = Array.from(Array(neighbours).keys())
    .map(n => n + page - neighbours)
    .filter(n => n > startPage)
    .map(pageNumber => <PaginationButton key={pageNumber} pageClick={pageClick} pageNumber={pageNumber} />);
  const backNeighbours = Array.from(Array(neighbours).keys())
    .map(n => n + page + 1)
    .filter(n => n < maxPage)
    .map(pageNumber => <PaginationButton key={pageNumber} pageClick={pageClick} pageNumber={pageNumber} />);

  return (
    <nav className="pagination">
      {frontButton ? <PaginationButton pageClick={pageClick} pageNumber={startPage} /> : null}
      {frontEllipses ? <p>...</p> : null}
      {frontNeighbours}
      <CurrentPaginationButton pageNumber={page} />
      {backNeighbours}
      {backEllipses ? <p>...</p> : null}
      {backButton ? <PaginationButton pageClick={pageClick} pageNumber={maxPage} /> : null}
    </nav>
  );
};

function PaginationButton({ pageClick, pageNumber }: { pageClick: (page: number) => void; pageNumber: number }) {
  return (
    <button className="pagination-btn link-pagination-btn secondary-colors" onClick={() => pageClick(pageNumber)}>
      {pageNumber}
    </button>
  );
}

function CurrentPaginationButton({ pageNumber }: { pageNumber: number }) {
  return <button className="pagination-btn curr-pagination-btn secondary-colors">{pageNumber}</button>;
}
