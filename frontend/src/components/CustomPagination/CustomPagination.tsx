import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../../components/ui/pagination"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-center gap-4 px-2 pt-4 text-sm text-muted-foreground">
      {/* Left side */}
      <p className="text-nowrap">
        Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </p>

      {/* Right side pagination */}
      <Pagination>
        <PaginationContent className="flex flex-wrap gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
              href="#"
            />
          </PaginationItem>

          {totalPages > 7 && currentPage > 4 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)} href="#">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                totalPages <= 7 ||
                (page >= currentPage - 2 && page <= currentPage + 2)
            )
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}
                  href="#"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {totalPages > 7 && currentPage < totalPages - 3 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  href="#"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              aria-disabled={currentPage === totalPages}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default CustomPagination
