import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilterBar from "./FilterBar";
import OrderTable from "./OrderTable";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchOrders, removeOrder } from "../../redux/slices/orderSlice";
import type { RootState } from "../../redux/store";
import { useLoading } from "../../contexts/LoadingContext";

const OrderList: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.trim().toUpperCase().replace(/\s+/g, "_");

  useEffect(() => {
    if (role === "UTOPIA_MANAGER" || role === "BRAND_MANAGER") {
      navigate("/unauthorized");
    }
  }, []);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<{
    full_name?: string;
    date_added?: string;
    status?: string;
    type?: string;
    branch?: string;
  }>({});
useEffect(() => {
  setLoading(true);
  dispatch(fetchOrders(filters))
    .unwrap()
    .catch((error) => {
      console.error("Error fetching orders:", error);
    })
    .finally(() => {
      setLoading(false);
    });
}, [filters]);
  const handleFilterChange = (newFilters: typeof filters) => {
  setFilters(newFilters);
};

  const {
    items: orders,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.orders);
;

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm(t("orders.deleteConfirm"))) {
      try {
        setLoading(true);
        await dispatch(removeOrder(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete order:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("orders.orderList")}</h1>
          {(role === "BRANCH_MANAGER" || role === "BRANCH_EMPLOYEE") && (
            <button
              onClick={() => navigate("/order/add")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
            >
              {t("orders.addNewOrder")}
            </button>
          )}
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading && <p>{t("orders.loadingOrders")}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders.length === 0 && (
        <p>{t("orders.noOrdersFound")}</p>
      )}
        <OrderTable
          items={orders}
          onEdit={(id) => navigate(`/order/edit/${id}`)}
          onDelete={handleDeleteOrder}
          role={role}
          branchId={user.branch_id}
        />
    </div>
  );
};

export default OrderList;
