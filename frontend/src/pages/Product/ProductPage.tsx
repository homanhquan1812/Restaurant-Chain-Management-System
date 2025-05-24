import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductList from "./ProductList";
import type { Product } from "../../services/product.service";
import type { ProductItem } from "../../types/ProductItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import FilterBar from "./FilterBar";
import { useNavigate } from "react-router-dom";

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: rawProducts, loading, error } = useAppSelector(
    (state: RootState) => state.products
  );

  const mappedProducts = useMemo<ProductItem[]>(
    () =>
      rawProducts.map((product: Product) => ({
        id: product.id,
        imageUrl: product.photo || "",
        name: product.name,
        price: product.price.toLocaleString() + " đ",
        description: product.description,
        stock: 0,
        reviews: 0,
        brand: product.brand_id || "Unknown",
        brandLogo: "",
      })),
    [rawProducts]
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-6">
          <div className="mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-800">
                {t("products.productList")}
              </h1>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 py-2 rounded-md transition"
                onClick={() => navigate("/product/add")}
              >
                {t("products.addNewProduct")}
              </button>
            </div>

            {/* Filter bar */}
            <FilterBar />

            {/* Status */}
            {loading && <p>{t("products.loadingProducts")}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && mappedProducts.length === 0 && (
              <p>{t("products.noProductsFound")}</p>
            )}

            {/* Product list */}
            {!loading && mappedProducts.length > 0 && (
              <ProductList products={mappedProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
