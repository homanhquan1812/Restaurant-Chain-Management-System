import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllBlogs } from "../../services/blog.service";
import type { Blog } from "../../services/blog.service";

interface BlogState {
  items: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async () => {
    const response = await getAllBlogs();
    return response;
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch blogs";
      });
  },
});

export default blogSlice.reducer;
