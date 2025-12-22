// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const API_URL = "category";
// Async thunk to fetch carousel data
export const getCategory = createAsyncThunk(
    'category/getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/all`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch carousel data');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default categorySlice.reducer;