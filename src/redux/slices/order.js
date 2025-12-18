import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { toast } from 'react-toastify';
import { Flip } from 'react-toastify';
const API_URL = "order"
export const createOrder = createAsyncThunk(
  '/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/placeorder`, orderData);
      console.log(response, "response");
      console.log(response?.data, "response data");
      toast.success(response?.message || 'Order Placed', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      return response;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch  data", {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
    }
  }
);

export const getOrderData = createAsyncThunk(
  '/getOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/allorder`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);


export const updateOrderData = createAsyncThunk(
  '/editorder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/updateorder`, orderData);
      toast.success(response?.message || 'Order Updated', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      return response;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch  data", {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
    }
  }
);

export const getorderbyorderidData = createAsyncThunk(
  '/getorderbyorderid',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/orderbyuser/${orderId}`);
      return response;


    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch  data');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orderbyid: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(getOrderData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    builder
      .addCase(getorderbyorderidData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getorderbyorderidData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderbyid = action.payload;
      })
      .addCase(getorderbyorderidData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;