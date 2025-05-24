// services/rcms.service.tsx
import axiosInstance from "../lib/axiosInstance";

// Interface mô tả dữ liệu UTOPIA Staff
export interface RcmsStaff {
  id: string;
  display_id: string;
  full_name: string;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  date_added: string;
  member_information_id: string;
  brand_id: string;
  brand_name: string;
  status?: string;
  avatar: string;
  dob: string;
  salary: number;
  branch_address?: string;
  logo_url: string;
}

// [GET] Lấy tất cả UTOPIA Staff
export const getAllRcmsStaffs = async (): Promise<RcmsStaff[]> => {
  const response = await axiosInstance.get<{ staff: RcmsStaff[] }>("/rcms/rcms_staff");
  return response.data?.staff ?? [];
};

// [GET] Lấy 1 Staff theo ID
export const getRcmsStaffById = async (id: string): Promise<RcmsStaff> => {
  const response = await axiosInstance.get<{ staff: RcmsStaff }>(`/rcms/rcms_staff/${id}`);
  return response.data.staff;
};

// [POST] Tạo Staff mới
export const createRcmsStaff = async (formData: FormData): Promise<RcmsStaff> => {
  const response = await axiosInstance.post<{ staff: RcmsStaff }>(
    "/register/rcms_staff",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.staff;
};


// [PUT] Cập nhật Staff theo ID
export const updateRcmsStaff = async (id: string, data: FormData): Promise<void> => {
  await axiosInstance.put(`/rcms/rcms_staff/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// [DELETE] Xoá Staff theo ID
export const deleteRcmsStaff = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/rcms/rcms_staff/${id}`);
};

