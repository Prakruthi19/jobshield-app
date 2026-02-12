import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      {/* Prev */}
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        ← Prev
      </button>

      {/* Page indicator */}
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
