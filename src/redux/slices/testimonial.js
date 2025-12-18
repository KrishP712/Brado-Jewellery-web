// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const API_URL = "testimonial";
// Async thunk to fetch carousel data
export const getTestimonial = createAsyncThunk(
    'testimonial/getTestimonial',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/all`);
            return response;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch testimonial data');
        }
    }
);

const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState: {
        testimonials: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTestimonial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTestimonial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.testimonials = action.payload;
            })
            .addCase(getTestimonial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default testimonialSlice.reducer;