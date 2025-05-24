import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './FilterBar';
import BrandTable from './BrandTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBrands } from '../../redux/slices/brandSlice';
import type { RootState } from '../../redux/store';
import type { BrandItem } from '../../types/BrandItem';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { getFilteredBrands } from "../../services/brand.service";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../contexts/LoadingContext";

const BrandList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: rawBrands, loading, error } = useAppSelector((state: RootState) => state.brands);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const brands = useMemo<BrandItem[]>(
    () =>
      rawBrands.map((b) => ({
        id: b.id,
        displayId: b.display_id,
        logo: b.logo_url,
        name: b.name,
        link: b.website_url,
        description: b.description,
        status: b.status,
        opening_hours: b.opening_hours?.slice(0, 5),
        closed_hours: b.closed_hours?.slice(0, 5),
        date_added: new Date(b.date_added).toLocaleDateString()
      })),
    [rawBrands]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchBrands());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const [filteredBrands, setFilteredBrands] = useState<BrandItem[]>([]);
  const [filters, setFilters] = useState<{
    name: string;
    status: string;
    dateAdded?: string;
  }>({
    name: "",
    status: "all",
  });


  const fetchFiltered = async () => {
    try {
          setLoading(true); // thêm
      const data = await getFilteredBrands(filters);
      const mapped = data.map((b) => ({
        id: b.id,
        displayId: b.display_id,
        logo: b.logo_url,
        name: b.name,
        link: b.website_url,
        description: b.description,
        status: b.status,
        opening_hours: b.opening_hours?.slice(0, 5),
        closed_hours: b.closed_hours?.slice(0, 5),
        date_added: new Date(b.date_added).toLocaleDateString(),
      }));
      setFilteredBrands(mapped);
    } catch (error) {
      console.error("Failed to filter brands", error);
    } finally {
      setLoading(false); // thêm
    }
  };

  useEffect(() => {
    fetchFiltered();
  }, [filters]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
              {t("brand.brandList")}
            </h1>
            <Button
              onClick={() => navigate("/brand/add")}
              className="bg-blue-500 text-white text-sm sm:text-base px-4 py-2 rounded-md"
            >
              {t("brand.addNewBrand")}
            </Button>
          </div>

          {/* Filter */}
          <FilterBar onFilterChange={setFilters} />

          {/* States */}
          {loading && <p className="text-sm">{t("brand.loadingBrands")}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && brands.length === 0 && (
            <p className="text-sm text-gray-500">{t("brand.noBrandsFound")}</p>
          )}

          {/* Table */}
            <BrandTable
              items={
                filteredBrands.length > 0 ||
                filters.name ||
                filters.status !== "all" ||
                filters.dateAdded
                  ? filteredBrands
                  : brands
              }
              onDeleted={fetchFiltered}
            />

        </div>
      </div>
    </div>
  );
};

export default BrandList;
