export interface FeedbackItem {
  id: string;
  displayId: string;
  type: string;
  fullName: string;
  phoneNumber: string;
  feedback: string;
  createAt: string;
  updateAt: string;
  status: string;
  responsible: {
    branchResponsible?: string;
    employeeResponsible?: string;
  };
  branchAddress: string;
  brandName: string;
  staffName: string;
  customerName: string;

  // Các trường bổ sung từ API
  customerId?: string;
  branchId?: string;
  solvedBy?: string;
}
