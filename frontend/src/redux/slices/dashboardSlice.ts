import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSaleReport } from "../../services/dashboard.service";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SaleReport } from "../../services/dashboard.service";

interface DashboardState {
  reports: SaleReport[];
  loading: boolean;
  error: string | null;
  selectedBrandId: string | null;
}

const initialState: DashboardState = {
  reports: [],
  loading: false,
  error: null,
  selectedBrandId: null,
};

// Async thunk để gọi API lấy tất cả dữ liệu báo cáo
export const fetchSaleReport = createAsyncThunk(
  "dashboard/fetchSaleReport",
  async () => {
    const data = await getSaleReport();
    return data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedBrandId: (state, action: PayloadAction<string>) => {
      state.selectedBrandId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaleReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleReport.fulfilled, (state, action: PayloadAction<SaleReport[]>) => {
        state.reports = action.payload;
        state.loading = false;
      })
      .addCase(fetchSaleReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { setSelectedBrandId } = dashboardSlice.actions;
export default dashboardSlice.reducer;
