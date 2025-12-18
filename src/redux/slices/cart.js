import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Flip, toast } from 'react-toastify';

const API_URL = "cart";

export const getCartData = createAsyncThunk(
    'cart/fetchCartData',
    async (couponcode, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                couponcode ? `${API_URL}/all?couponcode=${couponcode}` : `${API_URL}/all`
            );
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const createCartData = createAsyncThunk(
    'cart/createCartData',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/create`, { productId });
            toast.success(response?.data?.message || 'Product added to cart', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            console.log(response);
            if (response?.success) {
                dispatch(getCartData());
            }
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error adding product to cart', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return rejectWithValue(error.response?.data);
        }
    }
);

export const increaseCartQuantity = createAsyncThunk(
    'cart/increaseQuantity',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/increase`, { productId });
            if (response?.success) {
                dispatch(getCartData());
            }
            return response;
        } catch (error) {
            toast.error(error?.response?.message || 'Error increasing quantity', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return rejectWithValue(error.response);
        }
    }
);

export const decreaseCartQuantity = createAsyncThunk(
    'cart/decreaseQuantity',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/decrease`, { productId });

            if (response?.success) {
                dispatch(getCartData());
            }
            return response;
        } catch (error) {
            toast.error(error?.response?.message || 'Error decreasing quantity', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return rejectWithValue(error.response);
        }
    }
);

export const removeCartData = createAsyncThunk(
    'cart/removeCartData',
    async (productId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/remove`, {
                data: { productId },
            });

            toast.success(response?.data?.message || 'Product removed from cart', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });

            dispatch(getCartData());
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error removing product', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return rejectWithValue(error.response?.data);
        }
    }
);
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        status: 'idle',
        error: null,
        operationStatus: 'idle', 
    },
    reducers: {
        clearCart: (state) => {
            state.cart = [];
            state.error = null;
        },
        resetOperationStatus: (state) => {
            state.operationStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCartData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
                state.error = null;
            })
            .addCase(getCartData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(createCartData.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(createCartData.fulfilled, (state) => {
                state.operationStatus = 'succeeded';
            })
            .addCase(createCartData.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.error = action.payload;
            })

            .addCase(increaseCartQuantity.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(increaseCartQuantity.fulfilled, (state) => {
                state.operationStatus = 'succeeded';
            })
            .addCase(increaseCartQuantity.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.error = action.payload;
            })

            .addCase(decreaseCartQuantity.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(decreaseCartQuantity.fulfilled, (state) => {
                state.operationStatus = 'succeeded';
            })
            .addCase(decreaseCartQuantity.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.error = action.payload;
            })

            .addCase(removeCartData.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(removeCartData.fulfilled, (state) => {
                state.operationStatus = 'succeeded';
            })
            .addCase(removeCartData.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearCart, resetOperationStatus } = cartSlice.actions;
export default cartSlice.reducer;