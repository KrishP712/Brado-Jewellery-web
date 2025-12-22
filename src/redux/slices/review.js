import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Flip, toast } from 'react-toastify';

const API_URL = "review";

export const getReviewData = createAsyncThunk(
    'review/get',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/get`);
            return response.data;   
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

export const createReviewData = createAsyncThunk(
    'review/create',
    async (reviewData, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/create`, reviewData);

            toast.success(response.data?.message || 'Review Created', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });

            if (response.data?.success) {
                dispatch(getReviewData());
            }

            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to create review', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });

            return rejectWithValue(error.response?.data || 'Failed to create review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        review: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReviewData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getReviewData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.review = action.payload; 
            })
            .addCase(getReviewData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createReviewData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createReviewData.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createReviewData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default reviewSlice.reducer;
