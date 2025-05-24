import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import { getSaleReport } from "../../services/dashboard.service";
import { normalizeRole } from "../../utils/normalizeRole";

interface Props {
  brandId: string;
  brandName: string;
  branchId?: string;
  role: string;
}

const SalesDetails: React.FC<Props> = ({ brandId, brandName, branchId, role }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<number[]>([]);
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getSaleReport();
        const brand = response.find((b) => b.brand_id === brandId);

        if (!brand) return;

        const roleNormalized = normalizeRole(role);

        if (roleNormalized === "BRANCH_MANAGER" && branchId) {
          // Lọc doanh thu theo branch_id qua từng tháng
          const branchEntries = brand.branch_data
            .filter((b) => b.branch_id === branchId)
            .sort((a, b) => a.month - b.month);

          const revenues = branchEntries.map((item) => item.total_revenue || 0);
          setChartData(revenues);

          const branchName = branchEntries[0]?.branch_address || "";
          setSubtitle(`${brand.brand_name} - ${branchName}`);
        } else {
          // Lấy theo brand
          const sorted = brand.brand_data.sort((a, b) => a.month - b.month);
          setChartData(sorted.map((d) => d.total_revenue || 0));
          setSubtitle(brand.brand_name);
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    if (brandId && role) {
      fetchChartData();
    }
  }, [brandId, branchId, role]);

  const chartOptions: Highcharts.Options = {
    title: { text: subtitle },
    xAxis: {
      categories: [
        t("common.month.january"),
        t("common.month.february"),
        t("common.month.march"),
        t("common.month.april"),
        t("common.month.may"),
        t("common.month.june"),
        t("common.month.july"),
        t("common.month.august"),
        t("common.month.september"),
        t("common.month.october"),
        t("common.month.november"),
        t("common.month.december"),
      ],
      title: { text: t("dashboard.month") },
    },
    yAxis: {
      title: { text: t("dashboard.sales_vnd") },
    },
    series: [
      {
        type: "line",
        name: t("dashboard.totalSales"),
        data: chartData,
      },
    ],
    credits: { enabled: false },
    tooltip: { valueSuffix: " VND" },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {t("dashboard.sales_details")}
        </h2>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SalesDetails;
