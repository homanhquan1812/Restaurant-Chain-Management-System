import axiosInstance from "../lib/axiosInstance";

export interface Blog {
  id: string;
  staff_id: string;
  title: string;
  content: string;
  photo: string;
  date_added: string;
  status: string;
}

export const getAllBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get<{ blog: Blog[] }>("/blog");
  return response.data.blog;
};

export const getBlogById = async (id: string): Promise<Blog> => {
  const response = await axiosInstance.get<{ blog: Blog }>(`/blog/${id}`);
  return response.data.blog;
};

export const createBlog = async (blog: Blog): Promise<Blog> => {
  const response = await axiosInstance.post<{ blog: Blog }>("/blog", blog);
  return response.data.blog;
};

export const updateBlog = async (id: string, blog: Blog): Promise<Blog> => {
  const response = await axiosInstance.put<{ blog: Blog }>(`/blog/${id}`, blog);
  return response.data.blog;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/blog/${id}`);
};

export const getBlogsByStaffId = async (staffId: string): Promise<Blog[]> => {
  const response = await axiosInstance.get<{ blog: Blog[] }>(`/blog/staff/${staffId}`);
  return response.data.blog;
};