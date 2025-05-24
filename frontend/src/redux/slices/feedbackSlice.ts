import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from "../../services/feedback.service.tsx";
import type { Feedback } from "../../services/feedback.service.tsx";

interface FeedbackState {
  items: Feedback[];
  selectedFeedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  items: [],
  selectedFeedback: null,
  loading: false,
  error: null,
};

export const fetchFeedbacks = createAsyncThunk(
  "feedbacks/fetchFeedbacks",
  async () => {
    const response = await getAllFeedbacks();
    return response;
  }
);

export const fetchFeedbackById = createAsyncThunk(
  "feedbacks/fetchFeedbackById",
  async (id: string) => {
    const response = await getFeedbackById(id);
    return response;
  }
);

export const addFeedback = createAsyncThunk(
  "feedbacks/addFeedback",
  async (feedback: {
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    branch_id: string;
    type: string;
    content: string;
    status: string;
    solved_by: string;
  }) => {
    const response = await createFeedback(feedback);
    return response;
  }
);

export const editFeedback = createAsyncThunk(
  "feedbacks/editFeedback",
  async ({ id, feedback }: {
    id: string;
    feedback: Partial<{
      customer_id: string;
      customer_name: string;
      customer_phone: string;
      branch_id: string;
      type: string;
      content: string;
      status: string;
      solved_by: string;
    }>
  }) => {
    const response = await updateFeedback(id, feedback);
    return response;
  }
);

export const removeFeedback = createAsyncThunk(
  "feedbacks/removeFeedback",
  async (id: string) => {
    await deleteFeedback(id);
    return id;
  }
);

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeedbacks.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch feedbacks";
      })

      // Fetch feedback by ID
      .addCase(fetchFeedbackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.selectedFeedback = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeedbackById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch feedback";
      })

      // Add feedback
      .addCase(addFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addFeedback.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add feedback";
      })

      // Edit feedback
      .addCase(editFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editFeedback.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedFeedback = action.payload;
        state.loading = false;
      })
      .addCase(editFeedback.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to update feedback";
      })

      // Remove feedback
      .addCase(removeFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeFeedback.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to delete feedback";
      });
  }
});

export default feedbackSlice.reducer;
