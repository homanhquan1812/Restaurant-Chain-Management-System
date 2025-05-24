import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";  

interface AuthState {
  email: string;
  token: string;
}

const initialState: AuthState = {
  email: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setResetToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearResetState(state) {
      state.email = "";
      state.token = "";
    },
  },
});

export const { setResetToken, clearResetState } = authSlice.actions;
export default authSlice.reducer;
