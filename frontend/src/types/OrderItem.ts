export interface OrderCartItem {
  id: string;
  name: string;
  photo?: string;
  price?: number;
  quantity: number;
  total_price?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  address: string;
  date: string;
  orderType: string;
  status: "Processing" | "Completed" | "Rejected" | "On Hold" | "In Transit";
  phone?: string;
  email?: string;
  notes?: string;
  cart: {
    items: OrderCartItem[];
  };

  // Các trường bổ sung từ API
  displayId?: string;
  branch_name?: string;
  brand_address?: string;
  customer_id?: string;
  branch_id?: string;
  type?: string | null;
  preorder_time?: string | null;
  late?: boolean;
  resolved?: boolean;
  payment_method?: string;
  date_added?: string;
  full_name?: string;
  branch_address?: string;
  brand_name?: string;
}
