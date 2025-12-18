// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const API_URL = "http://localhost:4000/admin/carousel";
// Async thunk to fetch carousel data
export const getCarousel = createAsyncThunk(
    'carousel/getCarousel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/all`);
            return response;

        } catch (error) {
            console.error("Failed to fetch carousel data:", error);
            return rejectWithValue(error.response?.data || 'Failed to fetch carousel data');
        }
    }
);

const carouselSlice = createSlice({
    name: 'carousel',
    initialState: {
        carousels: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCarousel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCarousel.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.carousels = action.payload;
            })
            .addCase(getCarousel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default carouselSlice.reducer;