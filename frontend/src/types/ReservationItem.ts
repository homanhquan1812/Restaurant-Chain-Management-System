export interface ReservationItem {
  id: string;
  displayId: string;
  fullName: string;
  phoneNumber: string;
  branchId: string;
  reservationDate: string;
  reservationTime: string;
  numberOfCustomers: number;
  status: string;
  place: string;
  dateAdded: string;
  brandName: string;
  branchAddress: string;

  // Các trường bổ sung cho UI
  customerName?: string;
  customerId?: string;
  branchName?: string;
  partySize?: number;
  specialRequests?: string;
  dateTime?: string;
}
