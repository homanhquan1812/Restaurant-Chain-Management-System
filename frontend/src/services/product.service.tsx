import axiosInstance from '../lib/axiosInstance';

// Định nghĩa interface cho Product
export interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  photo: string;
  price: number;
  brand_id?: string;
  date_added?: string;
}

/**
 * [GET] /product
 * Lấy danh sách tất cả sản phẩm
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<{ product: Product[] }>('/product');
  return response.data.product;  // chỉ lấy mảng product ra thôi
};


/**
 * [GET] /product/:id
 * Lấy chi tiết 1 sản phẩm theo ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/product/${id}`);
  return response.data;
};

/**
 * [POST] /product
 * Tạo sản phẩm mới
 * @param product - Dữ liệu sản phẩm cần tạo (Không bao gồm id và date_added)
 */
export const createProduct = async (
  product: Omit<Product, 'id' | 'date_added'>
): Promise<Product> => {
  const response = await axiosInstance.post<Product>('/product', product);
  return response.data;
};

/**
 * [DELETE] /product
 * Xóa tất cả sản phẩm
 */
export const deleteAllProducts = async (): Promise<void> => {
  await axiosInstance.delete('/product');
};

/**
 * [DELETE] /product/:id
 * Xóa sản phẩm theo ID
 */
export const deleteProductById = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/product/${id}`);
};
