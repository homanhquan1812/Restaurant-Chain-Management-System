import React, { useState, useEffect, useMemo } from "react";
import BrandManagerCard from "./BrandManagerCard";
import CustomPagination from "../../components/CustomPagination/CustomPagination";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchStaffs } from "../../redux/slices/rcmsSlice";
import { getAllBrands } from "../../services/brand.service";
import type { Brand } from "../../services/brand.service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../contexts/LoadingContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const BrandManagerList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { items: rawStaffs = [], loading, error } = useAppSelector((state) => state.rcms);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    dispatch(fetchStaffs())
      .unwrap()
      .finally(() => setLoading(false));
    getAllBrands().then(setBrands);
  }, [dispatch]);


  const filteredStaffs = useMemo(() => {
    return rawStaffs
      .filter(
        (e) =>
          e.role === "Brand Manager" &&
          (selectedBrand === "all" || e.brand_name === selectedBrand)
      )
      .map((e) => ({
        id: e.id,
        name: e.full_name,
        role: e.role,
        phone: e.phone,
        branch: e.branch_address || "", // 👈 đảm bảo luôn là string
        email: e.email,
        avatarUrl: e.avatar,
        brandLogo: e.logo_url,
      }))
  }, [rawStaffs, selectedBrand]);

  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const paginatedItems = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">{t('brandManager.list')}</h1>
            <button
              onClick={() => navigate("/brand-manager/add")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('brandManager.add')}
            </button>
          </div>

          {/* Filter by Brand */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder={t('brand.all_brands') || 'All Brands'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('brand.all_brands') || 'All Brands'}</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* States */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && filteredStaffs.length === 0 && <p>{t('common.noData')}</p>}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedItems.map((emp) => (
              <BrandManagerCard key={emp.id} employee={emp} />
            ))}
          </div>

          {/* Pagination */}
          {filteredStaffs.length > itemsPerPage && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredStaffs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandManagerList;
