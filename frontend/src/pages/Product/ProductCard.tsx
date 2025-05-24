import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import type { ProductItem } from "../../types/ProductItem";

const ProductCard: React.FC<{ product: ProductItem }> = ({ product }) => {
  const { t } = useTranslation();

  const handleEdit = () => {
    console.log("Edit Product:", product);
  };

  const handleDelete = () => {
    console.log("Delete Product:", product);
  };

  const formatPrice = (price: string) => {
    return price;
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
      <div className="relative w-full aspect-[4/3] flex justify-center items-center bg-gray-100">
        <img
          src={product.imageUrl || "/assets/images/no-image.png"}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = "/assets/images/no-image.png";
          }}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-105"
        />

        {product.brandLogo && (
          <img
            src={`/assets/images/${product.brandLogo}`}
            alt={product.brand}
            className="absolute top-2 right-2 w-10 h-10 rounded-full border bg-white p-1"
          />
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-blue-600 font-bold text-sm mt-1">
          {formatPrice(product.price)}
        </p>

        <p className="text-gray-600 text-sm mt-1">
          {product.description.length > 50
            ? product.description.slice(0, 50) + "..."
            : product.description}
        </p>

        <div className="flex items-center text-yellow-500 mt-2">
          {"★".repeat(5)}
          <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {t("products.quantity")}: {product.stock}
        </p>
      </div>

      <div className="flex justify-between px-4 pb-4 space-x-2">
        <button
          onClick={handleEdit}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-md bg-blue-500 text-white hover:bg-blue-600 flex-1"
        >
          <FontAwesomeIcon icon={faPen} size="sm" />
          {t("products.editProduct")}
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-md bg-red-500 text-white hover:bg-red-600 flex-1"
        >
          <FontAwesomeIcon icon={faTrash} size="sm" />
          {t("products.deleteProduct")}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
