import React, { useState } from 'react';


import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Plus,
  X,
  ShoppingBag,
  Home
} from 'lucide-react';
import AddressManager from './Addressbook';
import Profile from './Profile';
import Order from './Order';
import Wish from './Wish';
import Wallate from './Wallate';


const ProfileDashboard = () => {
  const [activeRoute, setActiveRoute] = useState('wishlist');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'address', label: 'Address Book', icon: MapPin },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];


  const renderContent = () => {
    switch (activeRoute) {
      case 'profile': return <Profile />;
      case 'orders': return <Order />;
      case 'wishlist': return <Wish />;
      case 'address': return <AddressManager />;
      case 'wallet': return <Wallate />;
      default: return <Wish />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full bg-[#f4f3ef] ">

        <div className="w-[90%] mx-auto">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-2 text-sm text-gray-500">
              <span>Home</span>
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
            <div className="bg-[#f8f8f6] borde p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveRoute(item.id)}
                      className={`w-full flex border-b border-gray-300 items-center space-x-3 px-2 py-2 text-left transition-all duration-200 text-[14px]${activeRoute === item.id
                        ? ' text-[#b4853e]'
                        : 'text-gray-600 hover:text-gray-900 text-[14px]'
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;