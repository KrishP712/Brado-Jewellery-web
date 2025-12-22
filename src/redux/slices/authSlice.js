import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/AxiosInterceptor';
import { Flip, toast, Bounce } from 'react-toastify';

const initialState = {
    loading: false,
    isAuthenticated: !!localStorage.getItem("usertoken"),
    error: null,    
    id: null
};
export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/login', payload);
            toast.success(response?.message, {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            if (response.success) {
                payload.setModel("otp");
            }
            return response;

        } catch (error) {
            toast.error(error?.response?.data?.message, {
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
export const otpVerify = createAsyncThunk(
    'auth/otpVerify',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/verifyotp', { _id: payload.id, otp: payload.otp }, { withCredentials: true })
            if (response.success && response.token) {
                localStorage.setItem('usertoken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            toast.success(response?.message || 'Verified', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });

            return response;

        } catch (error) {
            toast.error(error?.response?.message || 'Error signing in', {
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

export const resendOTP = createAsyncThunk(
    'auth/resendOTP',
    async (payload, { rejectWithValue }) => {
        try {

            const response = await axiosInstance.post('/user/resend-otp', { id: payload.id, otp: payload.otp });
            toast.success(response?.message || 'Resend OTP', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return response;

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error Resend OTP', {
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

export const logout = createAsyncThunk(
    'auth/logout',
    async (dispatch, { rejectWithValue }) => {
        try {
            dispatch(clearAuth())
            toast.success(response?.message || 'Logged out', {
                position: 'bottom-right',
                autoClose: 3000,
                pauseOnHover: true,
                transition: Bounce,
            });
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error logging out', {
                position: 'bottom-right',
                autoClose: 3000,
                pauseOnHover: true,
                transition: Bounce,
            });
            return rejectWithValue(error.response?.data);
        }
    }
);
export const updateuserprofile = createAsyncThunk(
    'auth/updateuserprofile',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/update', payload, { withCredentials: true });
            toast.success(response?.message || 'Profile updated successfully', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return response;
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error updating profile', {
                position: 'bottom-right',
                autoClose: 3000,
                style: { fontSize: '12px' },
                pauseOnHover: true,
                transition: Flip,
            });
            return rejectWithValue(error.response?.data);
        }
    }
)
export const getUser = createAsyncThunk(
    'auth/user',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/all', { withCredentials: true });
            return response;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data);
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    users: [],
    reducers: {
        clearAuth: (state) => {
            localStorage.removeItem("usertoken");
            localStorage.removeItem("user");
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload._id) {
                    state.id = action.payload._id;
                    state.user = action.payload;
                } else {
                    console.warn('No _id found in payload:', action.payload);
                }
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.id = action.payload.id;
                state.user = state.users.find(u => u._id === state.id) || null;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(otpVerify.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(otpVerify.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { clearAuth } = authSlice.actions
export default authSlice.reducer;