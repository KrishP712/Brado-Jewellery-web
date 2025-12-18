import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const API_URL = "coupon";
export const getCouponData = createAsyncThunk(
  '/fetchCouponData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      console.log(response , "response");
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupon: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCouponData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCouponData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupon = action.payload;
      })
      .addCase(getCouponData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;