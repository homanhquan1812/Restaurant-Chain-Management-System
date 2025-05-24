import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from "../../services/voucher.service.tsx";
import type { Voucher } from "../../services/voucher.service.tsx";

interface VoucherState {
  items: Voucher[];
  selectedVoucher: Voucher | null;
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  items: [],
  selectedVoucher: null,
  loading: false,
  error: null,
};

export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async () => {
    const response = await getAllVouchers();
    return response;
  }
);

export const fetchVoucherById = createAsyncThunk(
  "vouchers/fetchVoucherById",
  async (id: string) => {
    const response = await getVoucherById(id);
    return response;
  }
);

export const addVoucher = createAsyncThunk(
  "vouchers/addVoucher",
  async (voucher: {
    title: string;
    discount_percent: number;
    code: string;
    status: string;
    start_date: string;
    end_date: string;
    type: string;
    discount_type: string;
    description: string;
    brand_id: string;
  }) => {
    const response = await createVoucher(voucher);
    return response;
  }
);

export const editVoucher = createAsyncThunk(
  "vouchers/editVoucher",
  async ({ id, voucher }: {
    id: string;
    voucher: Partial<{
      title: string;
      discount_percent: number;
      code: string;
      status: string;
      start_date: string;
      end_date: string;
      type: string;
      discount_type: string;
      description: string;
      brand_id: string;
    }>
  }) => {
    const response = await updateVoucher(id, voucher);
    return response;
  }
);

export const removeVoucher = createAsyncThunk(
  "vouchers/removeVoucher",
  async (id: string) => {
    await deleteVoucher(id);
    return id;
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all vouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVouchers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch vouchers";
      })

      // Fetch voucher by ID
      .addCase(fetchVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.selectedVoucher = action.payload;
        state.loading = false;
      })
      .addCase(fetchVoucherById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch voucher";
      })

      // Add voucher
      .addCase(addVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVoucher.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addVoucher.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add voucher";
      })

      // Edit voucher
      .addCase(editVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editVoucher.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedVoucher = action.payload;
        state.loading = false;
      })
      .addCase(editVoucher.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to update voucher";
      })

      // Remove voucher
      .addCase(removeVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVoucher.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeVoucher.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to delete voucher";
      });
  },
});

export default voucherSlice.reducer;
