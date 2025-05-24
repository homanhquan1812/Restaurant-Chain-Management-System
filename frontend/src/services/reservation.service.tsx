import axiosInstance from "../lib/axiosInstance";

export interface Reservation {
  id: string;
  display_id: string;
  full_name: string;
  phone: string;
  branch_id: string;
  reservation_time: string;
  reservation_date: string;
  number_of_customer: number;
  status: string;
  place: string;
  date_added: string;
  brand_name: string;
  branch_address: string;

  // Các trường cũ (có thể không còn sử dụng)
  customer_id?: string;
  party_size?: number;
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
  customer_name?: string;
  branch_name?: string;
}

export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await axiosInstance.get("/reservation");
    console.log("Raw API response:", response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.reservations)) {
      return response.data.reservations;
    } else if (
      response.data &&
      response.data.reservation &&
      Array.isArray(response.data.reservation)
    ) {
      return response.data.reservation;
    } else {
      console.error("Unexpected API response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};

export const getReservationById = async (id: string): Promise<Reservation> => {
  try {
    const response = await axiosInstance.get(`/reservation/${id}`);
    console.log(`API response for reservation ${id}:`, response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && response.data.reservation) {
      return response.data.reservation;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching reservation with id ${id}:`, error);
    throw error;
  }
};

export const createReservation = async (
  reservation: Omit<
    Reservation,
    "id" | "display_id" | "date_added" | "brand_name" | "branch_address"
  >
): Promise<Reservation> => {
  try {
    const response = await axiosInstance.post("/reservation", reservation);
    console.log("Create reservation response:", response);

    if (response.data && response.data.reservation) {
      return response.data.reservation;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const updateReservation = async (
  id: string,
  reservation: Partial<
    Omit<
      Reservation,
      "id" | "display_id" | "date_added" | "brand_name" | "branch_address"
    >
  >
): Promise<Reservation> => {
  try {
    const response = await axiosInstance.put(`/reservation/${id}`, reservation);
    console.log(`Update reservation response for id ${id}:`, response);

    if (response.data && response.data.reservation) {
      return response.data.reservation;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating reservation with id ${id}:`, error);
    throw error;
  }
};

export const deleteReservation = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/reservation/${id}`);
    console.log(`Delete reservation response for id ${id}:`, response);
  } catch (error) {
    console.error(`Error deleting reservation with id ${id}:`, error);
    throw error;
  }
};
