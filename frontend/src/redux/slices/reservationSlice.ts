import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
} from "../../services/reservation.service.tsx";
import type { Reservation } from "../../services/reservation.service.tsx";

interface ReservationState {
  items: Reservation[];
  selectedReservation: Reservation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  items: [],
  selectedReservation: null,
  loading: false,
  error: null,
};

export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async () => {
    const response = await getAllReservations();
    console.log("API response for reservations:", response);
    return response;
  }
);

export const fetchReservationById = createAsyncThunk(
  "reservations/fetchReservationById",
  async (id: string) => {
    const response = await getReservationById(id);
    return response;
  }
);

export const addReservation = createAsyncThunk(
  "reservations/addReservation",
  async (reservation: {
    full_name: string;
    phone: string;
    branch_id: string;
    reservation_date: string;
    reservation_time: string;
    number_of_customer: number;
    place: string;
    status: string;
  }) => {
    const response = await createReservation(reservation);
    return response;
  }
);

export const editReservation = createAsyncThunk(
  "reservations/editReservation",
  async ({ id, reservation }: {
    id: string;
    reservation: Partial<{
      full_name: string;
      phone: string;
      branch_id: string;
      reservation_date: string;
      reservation_time: string;
      number_of_customer: number;
      place: string;
      status: string;
    }>
  }) => {
    const response = await updateReservation(id, reservation);
    return response;
  }
);

export const removeReservation = createAsyncThunk(
  "reservations/removeReservation",
  async (id: string) => {
    await deleteReservation(id);
    return id;
  }
);

const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all reservations
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchReservations.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch reservations";
      })

      // Fetch reservation by ID
      .addCase(fetchReservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationById.fulfilled, (state, action) => {
        state.selectedReservation = action.payload;
        state.loading = false;
      })
      .addCase(fetchReservationById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch reservation";
      })

      // Add reservation
      .addCase(addReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addReservation.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add reservation";
      })

      // Edit reservation
      .addCase(editReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReservation.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedReservation = action.payload;
        state.loading = false;
      })
      .addCase(editReservation.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to update reservation";
      })

      // Remove reservation
      .addCase(removeReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReservation.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeReservation.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to delete reservation";
      });
  },
});

export default reservationSlice.reducer;
