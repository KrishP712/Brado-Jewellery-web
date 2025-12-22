import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Flip, toast } from 'react-toastify';
const API_URL = "address";
export const getAddressData = createAsyncThunk(
  'address/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

export const createAddressData = createAsyncThunk(
  'address/create',
  async (addressData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/create`, addressData);
      toast.success(response?.message || 'Address Created', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      if (response?.success) {
        dispatch(getAddressData());
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create address', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      return rejectWithValue(error.response?.data || 'Failed to create address');
    }
  }
);

export const removeAddressData = createAsyncThunk(
  'address/remove',
  async (addressId, { rejectWithValue, dispatch }) => {

    try {
      const response = await axiosInstance.delete(`${API_URL}/delete/${addressId}`);
      toast.success(response?.message || 'Address Deleted', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      if (response?.success) {
        dispatch(getAddressData());
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete address', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      return rejectWithValue(error.response?.data || 'Failed to delete address');
    }
  }
);

export const updateAddressData = createAsyncThunk(
  'address/update',
  async ({ addressId, addressData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/update/${addressId}`, addressData);
      toast.success(response?.message || 'Address Updated', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      if (response?.success) {
        dispatch(getAddressData());
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update address', {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      return rejectWithValue(error.response?.data || 'Failed to update address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    address: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAddressData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.address = action.payload;
      })
      .addCase(getAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeAddressData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeAddressData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(removeAddressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;