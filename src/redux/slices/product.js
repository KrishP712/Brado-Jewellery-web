import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/AxiosInterceptor";
import { Bounce, toast } from "react-toastify";

const initialState = {
  loading: false,
  products: [],
  product: null,
  error: null,
  selectedCategory: null,
  searchResults: [],
};

export const getProductsById = createAsyncThunk(
  "products/getProductsById",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/products/allbyid/${slug}`);
      return response?.product;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/products/all", {
        params: query,
      });
      return response?.data || {};
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/products/search", {
        params: { query }
      });
      return response.products;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.searchResults = [];
      });
  },
});

export const { setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
