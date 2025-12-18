import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/AxiosInterceptor";
import { Flip, toast } from "react-toastify";

const API_URL = "wishlist";

const initialState = {
  loading: false,
  wishlist: [],
  error: null,
};

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/all`);
      console.log(response);
      return response?.data || [];
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/createWishlist",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/create`, { productId });
      toast.success(response?.message || "Product added to wishlist", {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      dispatch(getWishlist());
      return response?.data; // return product data directly
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to wishlist", {
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

// ✅ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/remove/${productId}`);
      toast.success(response?.message || "Product removed from wishlist", {
        position: 'bottom-right',
        autoClose: 3000,
        style: { fontSize: '12px' },
        pauseOnHover: true,
        transition: Flip,
      });
      dispatch(getWishlist());
      return { productId }; 
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove from wishlist", {
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

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (payload && Array.isArray(payload.product)) {
          // ✅ Flatten wishlist products directly into an array
          state.wishlist = payload.product;
        } else if (Array.isArray(payload)) {
          state.wishlist = payload;
        } else {
          state.wishlist = [];
        }
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add to wishlist instantly
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload;
        if (newItem && !state.wishlist.some(w => w.product?._id === newItem.product?._id)) {
          state.wishlist.push(newItem);
        }
      })

      // ✅ Remove from wishlist instantly
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload.productId;
        state.wishlist = state.wishlist.filter(
          (item) => item.product?._id !== productId
        );
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

