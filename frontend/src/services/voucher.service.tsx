import axiosInstance from "../lib/axiosInstance";

export interface Voucher {
  id: string;
  display_id: string;
  title: string;
  discount_percent: number;
  code: string;
  status: string;
  start_date: string;
  end_date: string;
  type: string;
  discount_type: string;
  description: string;
  brand_id: string;
  date_added: string;
  name: string;
}

export const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const response = await axiosInstance.get("/voucher");
    console.log("Raw API response for vouchers:", response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && Array.isArray(response.data.voucher)) {
      return response.data.voucher;
    } else if (
      response.data &&
      response.data.voucher &&
      !Array.isArray(response.data.voucher)
    ) {
      return [response.data.voucher];
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected API response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export const getVoucherById = async (id: string): Promise<Voucher> => {
  try {
    const response = await axiosInstance.get(`/voucher/${id}`);
    console.log(`API response for voucher ${id}:`, response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && response.data.voucher) {
      return response.data.voucher;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching voucher with id ${id}:`, error);
    throw error;
  }
};

export interface VoucherCreateRequest {
  title: string;
  discount_percent: number;
  code: string;
  status: string;
  start_date: string;
  end_date: string;
  type: string;
  discount_type: string;
  description: string;
  brand_id: string;
}

export const createVoucher = async (
  voucher: VoucherCreateRequest
): Promise<Voucher> => {
  try {
    const response = await axiosInstance.post("/voucher", voucher);
    console.log("Create voucher response:", response);

    if (response.data && response.data.voucher) {
      return response.data.voucher;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

export interface VoucherUpdateRequest {
  title?: string;
  discount_percent?: number;
  code?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  discount_type?: string;
  description?: string;
  brand_id?: string;
}

export const updateVoucher = async (
  id: string,
  voucher: VoucherUpdateRequest
): Promise<Voucher> => {
  try {
    const response = await axiosInstance.put(`/voucher/${id}`, voucher);
    console.log(`Update voucher response for id ${id}:`, response);

    if (response.data && response.data.voucher) {
      return response.data.voucher;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating voucher with id ${id}:`, error);
    throw error;
  }
};

export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/voucher/${id}`);
    console.log(`Delete voucher response for id ${id}:`, response);
  } catch (error) {
    console.error(`Error deleting voucher with id ${id}:`, error);
    throw error;
  }
};
