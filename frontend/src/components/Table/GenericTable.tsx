import React, { useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '../../components/ui/table'
import { useTranslation } from "react-i18next";
import CustomPagination from "../../components/CustomPagination/CustomPagination"

interface TableProps<T extends Record<string, any>> {
  items: T[]
  columns: {
    key: keyof T | 'action' | '_index'
    label: string
    width?: string
    align?: 'left' | 'center' | 'right'
    render?: (item: T) => React.ReactNode
  }[]
  itemsPerPage?: number
}

const GenericTable = <T extends Record<string, any>>({
  items,
  columns,
  itemsPerPage = 10
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-neutral-300 p-4 shadow-md">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm sm:text-base">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  className={`whitespace-nowrap ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-gray-500">
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            )}
            {paginatedItems.map((item, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    className={`align-top px-4 py-3 ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(item) : String(item[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {items.length > itemsPerPage && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

    </div>
  )
}

export default GenericTable
