import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/AxiosInterceptor";
import { Flip, toast, Bounce } from "react-toastify";

/* ---------------- SAFE HELPERS ---------------- */
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("usertoken");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
  loading: false,
  user: getStoredUser(),
  isAuthenticated: !!localStorage.getItem("usertoken"),
  error: null,
  id: null,
};

/* ---------------- THUNKS ---------------- */

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", payload);

      toast.success(response?.message, {
        position: "bottom-right",
        autoClose: 3000,
        transition: Flip,
      });

      if (response.success) payload.setModel("otp");

      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const otpVerify = createAsyncThunk(
  "auth/otpVerify",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/verifyotp", {
        _id: payload.id,
        otp: payload.otp,
      });
      if (response.success && response.token) {
        localStorage.setItem("usertoken", response.token);
      }

      toast.success(response?.message || "Verified", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Flip,
      });

      return response;
    } catch (error) {
      toast.error(error?.response?.message || "OTP verification failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      dispatch(clearAuth());
      toast.success("Logged out", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Logout failed");
    }
  }
);

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload?._id || null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(otpVerify.pending, (state) => {
        state.loading = true;
      })
      .addCase(otpVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(otpVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
