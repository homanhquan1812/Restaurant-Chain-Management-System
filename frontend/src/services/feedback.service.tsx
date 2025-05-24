import axiosInstance from "../lib/axiosInstance";
export interface Feedback {
  id: string;
  display_id: string;
  customer_id: string;
  branch_id: string;
  type: string;
  content: string;
  status: string;
  solved_by: string;
  updated_at: string;
  date_added: string;
  branch_address: string;
  brand_name: string;
  staff_name: string;
  customer_name: string;
  customer_phone: string;

  // Các trường cũ (có thể không còn sử dụng)
  order_id?: string;
  product_id?: string;
  rating?: number;
  comment?: string;
}

export interface FeedbackCreateRequest {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  branch_id: string;
  type: string;
  content: string;
  status?: string;
  solved_by?: string;
}

export interface FeedbackUpdateRequest {
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  branch_id?: string;
  type?: string;
  content?: string;
  status?: string;
  solved_by?: string;
}

export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const response = await axiosInstance.get("/feedback");
    console.log("Raw API response for feedbacks:", response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && Array.isArray(response.data.feedback)) {
      return response.data.feedback;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected API response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};

export const getFeedbackById = async (id: string): Promise<Feedback> => {
  try {
    const response = await axiosInstance.get(`/feedback/${id}`);
    console.log(`API response for feedback ${id}:`, response);

    // Kiểm tra cấu trúc dữ liệu
    if (response.data && response.data.feedback) {
      return response.data.feedback;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching feedback with id ${id}:`, error);
    throw error;
  }
};

export const createFeedback = async (
  feedback: FeedbackCreateRequest
): Promise<Feedback> => {
  try {
    const response = await axiosInstance.post("/feedback", feedback);
    console.log("Create feedback response:", response);

    if (response.data && response.data.feedback) {
      return response.data.feedback;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

export const updateFeedback = async (
  id: string,
  feedback: FeedbackUpdateRequest
): Promise<Feedback> => {
  try {
    const response = await axiosInstance.put(`/feedback/${id}`, feedback);
    console.log(`Update feedback response for id ${id}:`, response);

    if (response.data && response.data.feedback) {
      return response.data.feedback;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating feedback with id ${id}:`, error);
    throw error;
  }
};

export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/feedback/${id}`);
    console.log(`Delete feedback response for id ${id}:`, response);
    return true;
  } catch (error) {
    console.error(`Error deleting feedback with id ${id}:`, error);
    throw error;
  }
};
