import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllRcmsStaffs,
  deleteRcmsStaff,
  createRcmsStaff,
  getRcmsStaffById,
  updateRcmsStaff,
} from "../../services/rcms.service";
import type { RcmsStaff } from "../../services/rcms.service";

interface RcmsState {
  items: RcmsStaff[];
  loading: boolean;
  error: string | null;
}

const initialState: RcmsState = {
  items: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchStaffs = createAsyncThunk("rcms/fetchStaffs", async () => {
  return await getAllRcmsStaffs();
});

export const deleteStaffThunk = createAsyncThunk("rcms/deleteStaff", async (id: string) => {
  await deleteRcmsStaff(id);
  return id;
});

// export const addStaffThunk = createAsyncThunk("rcms/addStaff", async (staff: Partial<RcmsStaff>) => {
//   return await createRcmsStaff(staff);
// });

export const updateStaffThunk = createAsyncThunk(
  "rcms/update",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      await updateRcmsStaff(id, formData);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);


// Slice
const rcmsSlice = createSlice({
  name: "rcms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch staff list.";
      })
      .addCase(deleteStaffThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      })
      // .addCase(addStaffThunk.fulfilled, (state, action) => {
      //   state.items.unshift(action.payload); // hoặc push nếu bạn muốn thêm cuối
      // })
      builder.addCase(updateStaffThunk.fulfilled, (state, action) => {
        // optional: có thể fetch lại danh sách nếu cần
      });
  },
});

export default rcmsSlice.reducer;
