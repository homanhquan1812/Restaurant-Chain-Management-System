import axiosInstance from "../lib/axiosInstance";

// Data structure returned by backend
export interface Branch {
  id: string;
  display_id: string;
  brand_id: string;
  brand_name: string;
  address: string;
  phone: string;
  status: string;
  date_added: string;
  total_staffs: string;
  total_employees: string;
  total_managers: string;
}

// Payload for creating/updating
export interface BranchInput {
  brand_id?: string; // Required for POST
  address: string;
  phone: string;
  status: string;
  id?: string; // Required for PUT
}

// GET all branches
export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await axiosInstance.get<{ branch: Branch[] }>("/branch");
  return response.data.branch;
};

// GET a branch by ID
export const getBranchById = async (id: string): Promise<Branch> => {
  const response = await axiosInstance.get<{ branch: Branch }>(`/branch/${id}`);
  return response.data.branch;
};

// POST create a new branch
export const createBranch = async (branch: Required<Pick<BranchInput, 'brand_id' | 'address' | 'phone' | 'status'>>) => {
  const response = await axiosInstance.post("/branch", branch);
  return response.data;
};

// PUT update a branch
export const updateBranch = async (id: string, branch: Required<Pick<BranchInput, 'address' | 'phone' | 'status'>>) => {
  const payload = { ...branch, id };
  const response = await axiosInstance.put(`/branch/${id}`, payload);
  return response.data;
};

// DELETE a branch
export const deleteBranch = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/branch/${id}`);
};

// (Optional) get brand info from local branches
export interface BrandInfo {
  brand_id: string;
  brand_name: string;
  total_branches: number;
}

export const getBrandById = async (brandId: string): Promise<BrandInfo | null> => {
  const branches = await getAllBranches();
  const brandBranches = branches.filter(b => b.brand_id === brandId);

  if (brandBranches.length === 0) return null;

  const { brand_name } = brandBranches[0];

  return {
    brand_id: brandId,
    brand_name,
    total_branches: brandBranches.length,
  };
};
