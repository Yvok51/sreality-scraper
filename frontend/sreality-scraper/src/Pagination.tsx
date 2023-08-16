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
  const frontEllipses = page - neighbours - 1 > startPage;
  const backEllipses = page + neighbours + 1 < maxPage;

  const frontNeighbours = Array.from(Array(neighbours))
    .map(n => n + page - neighbours)
    .filter(n => n > startPage)
    .map(pageNumber => <PaginationButton pageClick={pageClick} pageNumber={pageNumber} />);
  const backNeighbours = Array.from(Array(neighbours))
    .map(n => n + page + 1)
    .filter(n => n < maxPage)
    .map(pageNumber => <PaginationButton pageClick={pageClick} pageNumber={pageNumber} />);

  return (
    <nav>
      <PaginationButton pageClick={pageClick} pageNumber={startPage} />
      {frontEllipses ? <p>...</p> : null}
      {frontNeighbours}
      <PaginationButton pageClick={pageClick} pageNumber={page} />
      {backNeighbours}
      {backEllipses ? <p>...</p> : null}
      <PaginationButton pageClick={pageClick} pageNumber={maxPage} />
    </nav>
  );
};

function PaginationButton({ pageClick, pageNumber }: { pageClick: (page: number) => void; pageNumber: number }) {
  return <button onClick={() => pageClick(pageNumber)}>{pageNumber}</button>;
}
