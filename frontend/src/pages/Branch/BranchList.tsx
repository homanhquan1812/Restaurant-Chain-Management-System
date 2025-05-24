import React, { useState, useEffect, useMemo } from 'react';
import AddBranch from './AddBranch'
import EditBranch from './EditBranch'
import FilterBar from './FilterBar';
import BranchTable from './BranchTable';
import '../Dashboard/Dashboard.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBranches } from '../../redux/slices/branchSlice';
import type { RootState } from '../../redux/store';
import type { BranchItem } from '../../types/BranchItem';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BranchList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: rawBranches, loading, error } = useAppSelector((state: RootState) => state.branches);
  const [searchParams] = useSearchParams();
  const selectedBrandId = searchParams.get("brandId");

  const branches = useMemo<BranchItem[]>(() => {
    const data = Array.isArray(rawBranches) ? rawBranches : [rawBranches];
    return data.map((b) => ({
      id: b.id,
      name: b.display_id,
      location: b.address,
      address: b.address,
      phone: b.phone,
      brandId: b.brand_id,
      brand: b.brand_name || "-",
      employees: parseInt(b.total_employees || "0"),
      manager: `${b.total_managers}`,
      status: b.status,
      date_added: b.date_added,
    }));
  }, [rawBranches]);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
              {t("branch.branchList")}
            </h1>
            <AddBranch brandId={selectedBrandId || ""} />
          </div>

          <FilterBar />

          {loading && <p className="text-sm">{t("branch.loadingBranches")}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && branches.length === 0 && (
            <p className="text-sm text-gray-500">{t("branch.noBranchesFound")}</p>
          )}

          <BranchTable items={branches} />
        </div>
      </div>
    </div>
  );
};

export default BranchList;
