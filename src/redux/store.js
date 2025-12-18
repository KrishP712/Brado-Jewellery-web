import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import productSlice from "./slices/product";
import wishlistSlice from "./slices/wishlist";
import cartSlice from "./slices/cart";
import couponSlice from "./slices/coupon";
import addressSlice from "./slices/address";
import orderSlice from "./slices/order";
import categorySlice from "./slices/category";
import carouselSlice from "./slices/carousel";
import collectionSlice from "./slices/collection";
import reviewSlice from "./slices/review";
import testimonialSlice from "./slices/testimonial";
export const store = configureStore({
    reducer: {
        auth: authSlice,
        products: productSlice,
        wishlist: wishlistSlice,
        cart: cartSlice,
        coupon: couponSlice,
        address: addressSlice,
        order: orderSlice,
        category: categorySlice,
        carousel: carouselSlice,
        collection: collectionSlice,
        review: reviewSlice,
        testimonial: testimonialSlice
    },
});
