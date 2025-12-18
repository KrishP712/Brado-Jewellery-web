import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import User from "../pages/user/User";
import NotFound from "../pages/notfound/NotFound";
import Wrapper from "../layout/CommonLayout/Wrapper";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import SignIn from "../pages/auth/signIn/SignIn";
import SignUp from "../pages/auth/signup/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import Category from "../pages/Category/Category";
import HomePages from '../pages/home/Index'
import ShowProduct from '../pages/buyProduct/BuyProduct'
import ShoppingFlow from '../pages/buyProduct/BuyNow'
import ProfileDashboard from '../pages/Wishlist/profileDashboard'
import Profile from '../pages/Wishlist/Profile'
import Order from '../pages/Wishlist/Order'
import Shipment from '../pages/Wishlist/Shipment'
import Wish from '../pages/Wishlist/Wish'
import Addressbook from '../pages/Wishlist/Addressbook'
import Wallate from '../pages/Wishlist/Wallate'
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Wrapper />,
        children: [
          {
            path: "/",
            element: <HomePages />,
          },
          {
            path: "/category/:categoryName",
            element: <Category />,
          },
          {
            path: "/product/:slug",
            element: <ShowProduct />,
          },
          {
            path: "/shopping-cart/",
            element: < ShoppingFlow />,
          },
          {
            element: <ProfileDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "orders",
                element: <Order />,
              },
              {
                path: "shipment/:orderId",
                element: <Shipment />, // Added OrderDetails route
              },
              {
                path: "wishlist",
                element: <Wish />,
              },
              {
                path: "address-book",
                element: <Addressbook />,
              },
              {
                path: "wallet",
                element: <Wallate />,
              },
            ],
          },
          {
            path: "/user",
            element: <User />,
          },
        ]
      },
    ]
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "signIn",
            element: <SignIn />,
          },
          {
            path: "signUp",
            element: <SignUp />,
          },
        ],
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);