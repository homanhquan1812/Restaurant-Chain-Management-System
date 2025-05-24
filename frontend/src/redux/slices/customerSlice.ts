import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Customer, CustomerInput, RegisterCustomerInput } from "../../services/customer.service";
import {
  getAllCustomers,
  getCustomerById,
  getFilteredCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../../services/customer.service";

interface CustomerState {
  items: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}


const initialState: CustomerState = {
  items: [],
  loading: false,
  error: null,
  selectedCustomer: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (
    filters: { keyword?: string; status?: string; dateAdded?: string } | undefined,
    thunkAPI
  ) => {
    try {
      if (filters) return await getFilteredCustomers(filters);
      return await getAllCustomers();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCustomerById(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

 export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customer: RegisterCustomerInput, { rejectWithValue }) => {
    try {
      await createCustomer(customer); // API không trả về dữ liệu
      return customer; // Tạm return lại payload để thêm vào list nếu cần
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const editCustomer = createAsyncThunk(
  "customers/editCustomer",
  async (
    { id, customer }: { id: string; customer: Partial<Customer> },
    { rejectWithValue }
  ) => {
    try {
      const updated = await updateCustomer(id, customer); // <== PHẢI return
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeCustomer = createAsyncThunk(
  "customers/removeCustomer",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCustomer(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCustomer.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((c) => c.customer_id !== action.payload);
      })
      builder.addCase(addCustomer.fulfilled, (state) => {
        // Không cần làm gì ở đây
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.selectedCustomer = action.payload;
      })
      .addCase(editCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        const index = state.items.findIndex((c) => c.customer_id === action.payload.customer_id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default customerSlice.reducer;
export const selectCustomers = (state: RootState) => state.customers.items;
