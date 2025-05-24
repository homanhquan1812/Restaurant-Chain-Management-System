import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllBranches } from "../../services/branch.service";
import type { Branch } from "../../services/branch.service";

interface BranchState {
  items: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async () => {
    const response = await getAllBranches();
    return response;
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch branches";
      });
  },
});

export default branchSlice.reducer;
