// src/components/checkout/AddressStep.jsx
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import CheckBoxIcon from '../../assets/icons/CheckBox';
import add from "../../assets/images/wishlist/address.png";

const AddressStep = ({
  formData,
  handleInputChange,
  selectedAddress,
  setSelectedAddress,
  showAddressModal,
  setShowAddressModal,
  addressData,
  handleApplyAddress,
  handleNextStep,
  prevStep,
  cartData,
  products,
  totalItems,
  dispatch,
  getAddressData,
}) => {
  const [localErrors, setLocalErrors] = useState({});

  // Calculate totals safely inside component
  const calculateTotals = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return { totalMRP: "0.00", totalDiscount: "0.00", totalPrice: "0.00" };
    }

    let totalMRP = 0;
    let totalPrice = 0;

    products.forEach((item) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const originalPrice = item.originalPrice || price;

      totalMRP += originalPrice * qty;
      totalPrice += price * qty;
    });

    const totalDiscount = totalMRP - totalPrice;

    return {
      totalMRP: totalMRP.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.contactName.trim()) {
      errors.contactName = "Person name is required";
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNo.replace(/\D/g, ''))) {
      errors.contactNo = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = "Address line 1 is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Next with validation
  const handleValidatedNext = () => {
    if (validateForm()) {
      handleNextStep();
    }
  };

  // Clear error when user starts typing
  const handleChangeWithClearError = (e) => {
    const { name } = e.target;
    handleInputChange(e);
    if (localErrors[name]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2">
        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddressModal(false)}>
            <div className="bg-white rounded-lg shadow-lg w-[420px] max-h-[90vh] flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowAddressModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
              <div className="p-6 pb-3 border-b">
                <h2 className="text-lg font-semibold">Select Delivery Address</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {addressData?.length > 0 ? (
                  <div className="space-y-3">
                    {addressData.map((item, index) => (
                      <label
                        key={index}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${selectedAddress?._id === item._id ? "border-[#b4853e]" : "border-gray-200"
                          }`}
                      >
                        <input
                          type="radio"
                          checked={selectedAddress?._id === item._id}
                          onChange={() => setSelectedAddress(item)}
                          className="mt-1 mr-3 accent-[#b4853e]"
                        />
                        <div className="flex flex-col text-sm text-gray-700">
                          <span className="font-medium text-black">{item.name}</span>
                          <span className="text-gray-500">+91 {item.contactno}</span>
                          <span className="text-gray-600 mt-1 leading-snug">
                            {item.address1}, {item.address2 && `${item.address2}, `}{item.landmark && `${item.landmark}, `}
                            {item.city}, {item.state} - {item.pincode}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <img src={add} alt="No Address" className="w-24 h-24 mb-4" />
                    <p className="text-md font-medium">No Address yet!</p>
                    <p className="text-sm text-gray-600">You haven't added any address!</p>
                  </div>
                )}
              </div>
              {addressData?.length > 0 && (
                <div className="border-t p-4 flex justify-end">
                  <button
                    onClick={() => {
                      handleApplyAddress(selectedAddress);
                      setShowAddressModal(false);
                    }}
                    disabled={!selectedAddress}
                    className="bg-[#b4853e] text-white px-5 py-2 rounded font-semibold hover:bg-[#9a7437] disabled:opacity-60"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Delivery Address</h2>
          <button
            onClick={() => {
              dispatch(getAddressData());
              setShowAddressModal(true);
            }}
            className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] cursor-pointer hover:underline"
          >
            <CheckBoxIcon /> Select Address
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
          {/* Name & Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.contactName ? "border-red-500" : "border-gray-300 focus:border-[#b4853e] focus:ring-[#b4853e]"
                  }`}
              />
              {localErrors.contactName && <p className="text-red-500 text-xs mt-1">{localErrors.contactName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChangeWithClearError}
                maxLength="10"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.contactNo ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.contactNo && <p className="text-red-500 text-xs mt-1">{localErrors.contactNo}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
              placeholder=" "
            />
            <label className={`absolute left-3 transition-all bg-white px-1 pointer-events-none ${formData.email ? "-top-2 text-xs text-[#b4853e]" : "top-3 text-sm text-gray-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#b4853e]"
              }`}>
              Email Id (Optional)
            </label>
          </div>

          {/* Address Line 1 & 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.addressLine1 ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.addressLine1 && <p className="text-red-500 text-xs mt-1">{localErrors.addressLine1}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
              />
            </div>
          </div>

          {/* Landmark & City */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.city ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.city && <p className="text-red-500 text-xs mt-1">{localErrors.city}</p>}
            </div>
          </div>

          {/* Pin Code & State */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChangeWithClearError}
                maxLength="6"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.pinCode ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.pinCode && <p className="text-red-500 text-xs mt-1">{localErrors.pinCode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.state ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.state && <p className="text-red-500 text-xs mt-1">{localErrors.state}</p>}
            </div>
          </div>

          {/* Checkboxes and conditional sections remain unchanged */}
          {/* ... (same as your original code) */}
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
        <h3 className="mb-4 text-lg font-semibold">
          Order Summary <span className="text-[#696661] text-[14px]">(items {totalItems})</span>
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-[#696661] text-[14px]">Total MRP</span>
            <span className="text-[14px]">₹{totals.totalMRP}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="text-[#696661] text-[14px]">Discount</span>
            <span className="text-[14px]">-₹{totals.totalDiscount}</span>
          </div>
          {/* Coupon & Offer discounts */}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between text-xl font-bold">
            <span>{cartData?.coupon_discount > 0 ? "Grand Total" : "Total"}</span>
            <span>₹{cartData?.total_amount?.toFixed(2) || totals.totalPrice}</span>
          </div>
        </div>

        <button
          onClick={handleValidatedNext}
          disabled={Object.keys(localErrors).length > 0}
          className="w-full bg-[#b4853e] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7437] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          Continue to Payment
        </button>

        <p className="text-xs text-gray-500 my-4 text-center">
          Shipping & COD charges will be added in the next step
        </p>

        <button
          onClick={prevStep}
          className="w-full text-[#b4853e] flex items-center justify-center gap-2 py-3 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Cart
        </button>
      </div>
    </div>
  );
};

export default AddressStep;