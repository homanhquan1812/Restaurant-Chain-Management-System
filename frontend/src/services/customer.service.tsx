import axiosInstance from "../lib/axiosInstance";

export interface Customer {
  display_id: string;
  customer_id: string;
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
  status: string;
  avatar: string;
  member_id: string;
  dob: string;
  total_orders: number;
}

export interface CustomerInput {
  full_name: string;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  avatar: string;
  address: string;
  brand_id: string;
  member_information_id: string;
  brand_name: string;
  status: string;
}
export interface RegisterCustomerInput {
  full_name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  brand_id: string;
  dob: string;
}


export const getFilteredCustomers = async (params: {
  keyword?: string;
  status?: string;
  dateAdded?: string;
}): Promise<Customer[]> => {
  const query = new URLSearchParams();
  if (params.keyword && params.keyword !== "all") query.append("keyword", params.keyword);
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.dateAdded) query.append("date_added", params.dateAdded);

  const response = await axiosInstance.get<{ customer: Customer[] }>(
    `/customer?${query.toString()}`
  );
  return Array.isArray(response.data.customer)
    ? response.data.customer
    : [response.data.customer];
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get<{ customer: Customer[] }>("/customer");
  return Array.isArray(response.data.customer) ? response.data.customer : [response.data.customer];
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await axiosInstance.get<{ customer: Customer }>(`/customer/${id}`);
  return response.data.customer;
};

export const createCustomer = async (
  customer: RegisterCustomerInput
): Promise<void> => {
  await axiosInstance.post("/register/customer", customer);
};

export const updateCustomer = async (
  id: string,
  customer: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosInstance.put<{ customer: Customer }>(`/customer/${id}`, customer);
  return response.data.customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/customer/${id}`);
};
