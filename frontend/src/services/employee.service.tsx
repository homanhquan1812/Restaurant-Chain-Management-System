import axiosInstance from "../lib/axiosInstance";

export interface Employee {
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
  branch_id: string;
  position: string | null;
  salary: number;
  brand_id: string;
  brand_name: string;
  status: string;
  avatar: string;
  branch_address: string;
  logo_url: string;
}
// API: Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get<{ staff: Employee[] }>("/staff");
  return response.data.staff;
};

// API: Get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await axiosInstance.get<{ staff: Employee }>(`/staff/${id}`);
  return response.data.staff;
};

// API: Create a new employee
export const createEmployee = async (employee: Employee): Promise<Employee> => {
  const response = await axiosInstance.post<{ staff: Employee }>(
    "/staff",
    employee
  );
  return response.data.staff;
};

// API: Update an employee by ID
export const updateEmployee = async (
  id: string,
  employee: Employee
): Promise<Employee> => {
  const response = await axiosInstance.put<{ staff: Employee }>(
    `/staff/${id}`,
    employee
  );
  return response.data.staff;
};

// API: Delete an employee by ID
export const deleteEmployee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/staff/${id}`);
};
