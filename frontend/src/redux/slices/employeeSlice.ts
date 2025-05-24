import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllEmployees } from "../../services/employee.service";
import type { Employee } from "../../services/employee.service";
import { deleteEmployee } from "../../services/employee.service";

interface EmployeeState {
  items: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await getAllEmployees();
    return response;
  }
);
export const deleteEmployeeThunk = createAsyncThunk(
  "employees/delete",
  async (id: string, { dispatch }) => {
    await deleteEmployee(id);
    dispatch(fetchEmployees()); // reload sau khi xóa
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch employees";
      });
  },
});

export default employeeSlice.reducer;
