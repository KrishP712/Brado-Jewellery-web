import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("wishlist");

  useEffect(() => {
    // Map routes to labels for breadcrumb
    const routeLabels = {
      "/profile": "Profile",
      "/orders": "Orders",
      "/wishlist": "Wishlist",
      "/address-book": "Address Book",
      "/shipment": "Shipment",
      "/wallet": "Wallet",
    };

    // Check if the path matches /orders/:id
    const isOrderDetails = location.pathname.match(/^\/orders\/[^/]+$/);
    if (isOrderDetails) {
      setActiveRoute("Order Details");
    } else {
      // Find matching base route
      const matchedRoute = Object.keys(routeLabels).find((route) =>
        location.pathname.startsWith(route)
      );
      setActiveRoute(routeLabels[matchedRoute] || "Profile");
    }
  }, [location.pathname]);

  const menuItems = [
    { id: "/profile", label: "Profile", icon: User },
    { id: "/orders", label: "Orders", icon: Package },
    { id: "/wishlist", label: "Wishlist", icon: Heart },
    { id: "/address-book", label: "Address Book", icon: MapPin },
    { id: "/wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full bg-[#f4f3ef]">
        <div className="w-[90%] mx-auto">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-gray-900"
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium capitalize">{activeRoute}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 md:flex-shrink-0 hidden md:block">
            <div className="bg-[#f8f8f6] p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex border-b border-gray-300 items-center space-x-3 px-2 py-2 text-left transition-all duration-200 text-[14px] ${
                        location.pathname === item.id ||
                        (item.id === "/orders" && location.pathname.match(/^\/orders\/[^/]+$/))
                          ? "text-[#b4853e]"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;