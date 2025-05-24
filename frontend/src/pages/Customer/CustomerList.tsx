import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilterBar from "./FilterBar";
import CustomerTable from "./CustomerTable";
import "../Dashboard/Dashboard.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCustomers,
  removeCustomer,
} from "../../redux/slices/customerSlice";
import type { RootState } from "../../redux/store";
import type { CustomerItem } from "../../types/CustomerItem";
import { useLoading } from "../../contexts/LoadingContext";
import type { ComboboxItem } from "../../components/Combobox/Combobox";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const {
    items: rawCustomers,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.customers);
  const location = useLocation();
  const [filters, setFilters] = useState<{ keyword?: string; status?: string; dateAdded?: string }>({});

  const customers = useMemo<CustomerItem[]>(() =>
    rawCustomers.map((c) => ({
      id: c.customer_id,
      displayId: c.display_id,
      customer_id: c.customer_id,
      fullName: c.full_name,
      email: c.email,
      phone: c.phone,
      gender: c.gender,
      avatar: c.avatar,
      dateOfBirth: c.dob ? new Date(c.dob).toLocaleDateString() : "",
      address: c.address,
      username: c.username,
      role: c.role,
      brandId: c.brand_id,
      brandName: c.brand_name,
      status: c.status,
      totalOrder: Number(c.total_orders || 0),
      dateJoined: new Date(c.date_added).toLocaleDateString(),
    })),
    [rawCustomers]
  );

  useEffect(() => {
    setLoading(true);
    dispatch(fetchCustomers(filters)).finally(() => setLoading(false));
  }, [dispatch, filters]);

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm(t("customer.deleteConfirm"))) {
      try {
        setLoading(true);
        await dispatch(removeCustomer(id)).unwrap();
        toast.success(t("customer.deleteSuccess")); // ✅ Thêm dòng này
      } catch (error) {
        console.error("Failed to delete customer:", error);
        alert(t("customer.deleteError"));
      } finally {
        setLoading(false);
      }
    }
  };
  
  const keywordOptions = useMemo<ComboboxItem[]>(
    () =>
      rawCustomers.map((c) => ({
        label: `${c.full_name}`, // hiển thị trong dropdown
        value: `${c.full_name}`, // giá trị khi chọn
      })),
    [rawCustomers]
  );


  const handleSearch = (searchFilters: { keyword?: string; status?: string; date?: Date }) => {
    const dateAdded = searchFilters.date ? searchFilters.date.toISOString().split("T")[0] : undefined;
    setFilters({
      keyword: searchFilters.keyword,
      status: searchFilters.status,
      dateAdded,
    });
  };
  useEffect(() => {
    if (location.state?.updated) {
      setLoading(true);
      dispatch(fetchCustomers(filters)).finally(() => {
        setLoading(false);
        // Reset state để không refetch liên tục
        navigate(location.pathname, { replace: true });
      });
    }
  }, [location]);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          {t("customer.customerList")}
        </h1>
        <button
          onClick={() => navigate("/customer/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
        >
          {t("customer.addNewCustomer")}
        </button>
      </div>

      <FilterBar onSearch={handleSearch} keywordOptions={keywordOptions} />

      {loading && <p>{t("customer.loadingCustomers")}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && customers.length === 0 && (
        <p>{t("customer.noCustomersFound")}</p>
      )}

      <CustomerTable
        items={customers}
        onEdit={(id) => navigate(`/customer/edit/${id}`)}
        onDelete={handleDeleteCustomer}
      />
    </div>
  );
};

export default CustomerList;
