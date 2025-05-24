import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilterBar from "./FilterBar";
import VoucherTable from "./VoucherTable";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchVouchers, removeVoucher } from "../../redux/slices/voucherSlice";
import type { RootState } from "../../redux/store";
import { useLoading } from "../../contexts/LoadingContext";
import type { VoucherItem } from "../../types/VoucherItem";

const VoucherList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const {
    items: rawVouchers,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.vouchers);

  const vouchers = useMemo<VoucherItem[]>(() => {
    // Kiểm tra xem rawVouchers có phải là một mảng không
    if (!Array.isArray(rawVouchers)) {
      console.error("rawVouchers is not an array:", rawVouchers);
      return [];
    }

    return rawVouchers.map((v) => ({
      id: v.id,
      displayId: v.display_id,
      type: v.type,
      title: v.title,
      code: v.code,
      brand: v.name || "",
      description: v.description,
      discountType: v.discount_type,
      discountValue: `${v.discount_percent}%`,
      startDate: new Date(v.start_date).toLocaleDateString(),
      endDate: new Date(v.end_date).toLocaleDateString(),
      status: v.status,
      dateAdded: v.date_added,
    }));
  }, [rawVouchers]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVouchers()).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleDeleteVoucher = async (id: string) => {
    if (window.confirm(t("vouchers.deleteConfirm"))) {
      try {
        setLoading(true);
        await dispatch(removeVoucher(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete voucher:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          {t("vouchers.voucherList")}
        </h1>
        <button
          onClick={() => navigate("/voucher/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors"
        >
          {t("vouchers.addNewVoucher")}
        </button>
      </div>

      <FilterBar />

      {loading && <p>{t("vouchers.loadingVouchers")}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && vouchers.length === 0 && (
        <p>{t("vouchers.noVouchersFound")}</p>
      )}

      <VoucherTable
        items={vouchers}
        onEdit={(id) => navigate(`/voucher/edit/${id}`)}
        onDelete={handleDeleteVoucher}
      />
    </div>
  );
};

export default VoucherList;
