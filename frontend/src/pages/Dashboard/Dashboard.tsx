import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SalesDetails from "./SalesDetails";
import BranchRevenue from "./BranchRevenue";
import StatCard from "./StatCard";
import { Users, PackageCheck, TrendingUp, UserCog } from "lucide-react";
import type { StatCardProps } from "../../types/StatCardProps";
import { useLoading } from "../../contexts/LoadingContext";
import { getDashboardStats } from "../../services/dashboard.service";
import { getAllBrands } from "../../services/brand.service";
import type { Brand } from "../../services/brand.service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { normalizeRole } from "../../utils/normalizeRole";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const normalizedRole = user?.role ? normalizeRole(user.role) : "";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>();
  const [statCards, setStatCards] = useState<StatCardProps[]>([]);

  const updateStatCards = (stats: Awaited<ReturnType<typeof getDashboardStats>>) => {
    const formattedStats: StatCardProps[] = [
      {
        title: t("dashboard.totalCustomers"),
        value: stats.totalCustomers.toLocaleString(),
        change: stats.customerGrowth,
        changeText: t("dashboard.up_from_last_month"),
        iconElement: <Users className="w-6 h-6 text-white" />,
        bgColor: "bg-indigo-500",
        icon: "",
      },
      {
        title: t("dashboard.totalOrders"),
        value: stats.totalOrders.toLocaleString(),
        change: stats.orderGrowth,
        changeText: t("dashboard.up_from_last_month"),
        iconElement: <PackageCheck className="w-6 h-6 text-white" />,
        bgColor: "bg-yellow-400",
        icon: "",
      },
      {
        title: t("dashboard.totalSales"),
        value: stats.totalSales.toLocaleString() + " VND",
        change: stats.salesGrowth,
        changeText:
          Number(stats.salesGrowth.replace("%", "")) >= 0
            ? t("dashboard.up_from_last_month")
            : t("dashboard.down_from_last_month"),
        iconElement: <TrendingUp className="w-6 h-6 text-white" />,
        bgColor: "bg-green-500",
        icon: "",
      },
      {
        title: t("dashboard.totalStaff"),
        value: stats.totalStaff.toLocaleString(),
        change: stats.staffGrowth,
        changeText: t("dashboard.up_from_last_month"),
        iconElement: <UserCog className="w-6 h-6 text-white" />,
        bgColor: "bg-red-500",
        icon: "",
      },
    ];
    setStatCards(formattedStats);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const allBrands = await getAllBrands();
        setBrands(allBrands);

        if (normalizedRole === "UTOPIA_MANAGER") {
          const defaultBrand = allBrands[0];
          if (defaultBrand) {
            setSelectedBrandId(defaultBrand.id);
            const stats = await getDashboardStats(defaultBrand.id);
            updateStatCards(stats);
          }
        } else if (normalizedRole === "BRAND_MANAGER" || normalizedRole === "BRANCH_MANAGER") {
          setSelectedBrandId(user.brand_id);
          const stats = await getDashboardStats(user.brand_id);
          updateStatCards(stats);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleBrandChange = async (value: string) => {
    setSelectedBrandId(value);
    setLoading(true);
    try {
      const stats = await getDashboardStats(value);
      updateStatCards(stats);
    } finally {
      setLoading(false);
    }
  };

  const selectedBrandName = brands.find((b) => b.id === selectedBrandId)?.name || user.brand_name;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
              {t("dashboard.title")}
            </h1>

            {/* Role-based Select */}
            {normalizedRole === "UTOPIA_MANAGER" && (
              <Select value={selectedBrandId} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={t("brand.select")} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {normalizedRole === "BRAND_MANAGER" && (
              <Select value={user.brand_id} disabled>
                <SelectTrigger className="w-fit">
                  <SelectValue>{user.brand_name}</SelectValue>
                </SelectTrigger>
              </Select>
            )}
            {normalizedRole === "BRANCH_MANAGER" && (
              <Select value={user.brand_id} disabled>
                <SelectTrigger className="w-fit">
                  <SelectValue>{user.brand_name}</SelectValue>
                </SelectTrigger>
              </Select>
            )}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <SalesDetails
              brandId={selectedBrandId || ""}
              brandName={selectedBrandName}
              branchId={user.branch_id}
              role={normalizedRole}
            />

            <BranchRevenue
              brandId={selectedBrandId || ""}
              branchId={user.branch_id}
              role={normalizedRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
