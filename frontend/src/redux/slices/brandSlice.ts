import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllBrands } from "../../services/brand.service";
import type { Brand } from "../../services/brand.service";

interface BrandState {
  items: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async () => {
    const response = await getAllBrands();
    return response;
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch brands";
      });
  },
});

export default brandSlice.reducer;
