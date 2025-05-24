import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GenericTable from "../../components/Table/GenericTable";
import { getSaleReport } from "../../services/dashboard.service"; // nhớ đúng path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useLoading } from "../../contexts/LoadingContext";

type BranchStat = {
  id: string;
  name: string;
  totalRevenue: number;
  totalStaff: number;
  totalOrders: number;
};


const BranchRevenue: React.FC<{ brandId: string; branchId?: string; role: string }> = ({ brandId, branchId, role }) => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<BranchStat[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("5");
  const { setLoading } = useLoading();

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSaleReport();
      const brand = data.find((b) => b.brand_id === brandId);
      if (!brand) return;

      // Lọc theo tháng (và có thể thêm lọc theo year nếu cần)
      let filtered = brand.branch_data.filter(
        (b) => b.month.toString() === selectedMonth
      );

      // Nếu là BRANCH_MANAGER → lọc đúng branch_id
      if (role === "BRANCH_MANAGER" && branchId) {
        filtered = filtered.filter((b) => b.branch_id === branchId);
      }

      const transformed: BranchStat[] = filtered.map((item) => ({
        id: item.branch_id,
        name: item.branch_address,
        totalRevenue: item.total_revenue,
        totalStaff: item.total_staffs,
        totalOrders: item.total_orders,
      }));

      setBranches(transformed);
    } catch (err) {
      console.error("Error loading branch revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  if (brandId && role) fetchData();
}, [brandId, branchId, role, selectedMonth]);


  const columns: {
    key: keyof BranchStat | "action" | "_index";
    label: string;
    align?: "left" | "center" | "right";
    render?: (item: BranchStat) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: t("dashboard.branch_address"),
    },
    {
      key: "totalRevenue",
      label: t("dashboard.revenue"),
      align: "right",
      render: (item) =>
        item.totalRevenue.toLocaleString("vi-VN") + " VND",
    },
    {
      key: "totalOrders",
      label: t("dashboard.orders"),
      align: "center",
    },
    {
      key: "totalStaff",
      label: t("dashboard.staffs"),
      align: "center",
    },
  ];


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {t("dashboard.deals_details")}
        </h2>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="flex items-center gap-2">
            <SelectValue placeholder={t("common.month.may")} />
          </SelectTrigger>
          <SelectContent className="h-60">
            {Array.from({ length: 12 }, (_, i) => {
              const monthKey = new Date(0, i).toLocaleString("en", { month: "long" }).toLowerCase();
              return (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {t(`common.month.${monthKey}`)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <GenericTable items={branches} columns={columns} itemsPerPage={5} />
    </div>
  );
};

export default BranchRevenue;
