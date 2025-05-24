import React, { useState } from "react";
import ProductCard from "./ProductCard";
import type { ProductItem } from "../../types/ProductItem";
import CustomPagination from "../../components/CustomPagination/CustomPagination";

interface ProductListProps {
  products: ProductItem[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  return (
    <div className="bg-gray-50 min-h-screen">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {products.length > itemsPerPage && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
  );
};

export default ProductList;
