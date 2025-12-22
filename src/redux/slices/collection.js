// src/features/carousel/carouselSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';

const API_URL = "category";
// Async thunk to fetch carousel data
export const getCollection = createAsyncThunk(
    'collection/getCollection',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/all`);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch carousel data');
        }
    }
);

const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        collections: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCollection.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.collections = action.payload;
            })
            .addCase(getCollection.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default collectionSlice.reducer;