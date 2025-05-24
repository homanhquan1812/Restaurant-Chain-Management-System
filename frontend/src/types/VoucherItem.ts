export interface VoucherItem {
  id: string;
  displayId: string;
  type: string;
  title: string;
  code: string;
  brand: string;
  description: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  status: string;
  useLimit?: string;  
  dateAdded: string;
}
