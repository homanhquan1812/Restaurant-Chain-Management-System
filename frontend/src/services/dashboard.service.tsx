import axiosInstance from "../lib/axiosInstance";

// Mỗi dòng dữ liệu của một chi nhánh theo tháng
export interface BranchData {
  branch_id: string;
  branch_address: string;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  total_staffs: number;
  brand_id: string;
  month: number;
  year: number;
}

// Mỗi dòng dữ liệu tổng hợp theo brand và tháng
export interface BrandData {
  brand_id: string;
  brand_name: string;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  total_staffs: number;
  month: number;
  year: number;
}

export interface SaleReport {
  brand_id: string;
  brand_name: string;
  branch_data: BranchData[];
  brand_data: BrandData[];
}

export const getSaleReport = async (): Promise<SaleReport[]> => {
  const response = await axiosInstance.get<{ sale_report: SaleReport[] }>("/sale_report");
  return response.data.sale_report;
};

export const getDashboardStats = async (brandId?: string) => {
  const reports = await getSaleReport();
  const brand = brandId ? reports.find((r) => r.brand_id === brandId) : reports[0];
  if (!brand) throw new Error("Brand not found");

  const sorted = [...brand.brand_data].sort((a, b) => a.month - b.month);
  const current = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2] || current;

  const calculateGrowth = (cur: number, prev: number) => {
    if (prev === 0) return "0%";
    const growth = ((cur - prev) / prev) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  return {
    totalCustomers: current.total_customers,
    totalOrders: current.total_orders,
    totalSales: current.total_revenue,
    totalStaff: current.total_staffs,
    customerGrowth: calculateGrowth(current.total_customers, previous.total_customers),
    orderGrowth: calculateGrowth(current.total_orders, previous.total_orders),
    salesGrowth: calculateGrowth(current.total_revenue, previous.total_revenue),
    staffGrowth: calculateGrowth(current.total_staffs, previous.total_staffs),
  };
};
