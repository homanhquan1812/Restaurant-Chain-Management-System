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
  return (
    <div className="flex justify-between items-center py-4 bg-gray-50 px-4">
      <span>
        Showing {(currentPage - 1) * 8 + 1} -{" "}
        {Math.min(currentPage * 8, totalPages * 8)} of {totalPages * 8}
      </span>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border border-neutral-300 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ◀
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border border-neutral-300 rounded-md ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border  border-neutral-300 rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pagination;
