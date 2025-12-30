// src/components/checkout/AddressStep.jsx
import React, { useState } from 'react';
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
  nextStep,
}) => {
  const [localErrors, setLocalErrors] = useState({});

  // Safe calculation of totals
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

  // Safe trim helper
  const safeTrim = (value) => (value || "").toString().trim();

  // Form validation
  const validateForm = () => {
    const errors = {};

    const contactName = safeTrim(formData.contactName);
    const contactNo = safeTrim(formData.contactNo);
    const addressLine1 = safeTrim(formData.addressLine1);
    const city = safeTrim(formData.city);
    const pinCode = safeTrim(formData.pinCode);
    const state = safeTrim(formData.state);

    if (!contactName) {
      errors.contactName = "Person name is required";
    }

    if (!contactNo) {
      errors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(contactNo.replace(/\D/g, ''))) {
      errors.contactNo = "Please enter a valid 10-digit mobile number";
    }

    if (!addressLine1) {
      errors.addressLine1 = "Address line 1 is required";
    }

    if (!city) {
      errors.city = "City is required";
    }

    if (!pinCode) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(pinCode)) {
      errors.pinCode = "Pin code must be 6 digits";
    }

    if (!state) {
      errors.state = "State is required";
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step with validation
  const handleValidatedNext = () => {
    if (validateForm()) {
      handleNextStep();
    }
  };

  // Clear error when user types
  const handleChangeWithClearError = (e) => {
    const { name, value } = e.target;
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

        {/* Address Selection Modal */}
        {showAddressModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowAddressModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-[420px] max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
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
                        key={item._id || index}
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
                          <span className="font-medium text-black">{item.name || 'N/A'}</span>
                          <span className="text-gray-500">+91 {item.contactno || 'N/A'}</span>
                          <span className="text-gray-600 mt-1 leading-snug">
                            {item.address1}, {item.address2 && `${item.address2}, `}
                            {item.landmark && `${item.landmark}, `}
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
                    className="bg-[#b4853e] text-white px-5 py-2 rounded font-semibold hover:bg-[#9a7437] disabled:opacity-60 disabled:cursor-not-allowed"
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

        {/* Address Form */}
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
                value={formData.contactName || ''}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.contactName ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
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
                value={formData.contactNo || ''}
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
              value={formData.email || ''}
              onChange={handleInputChange}
              className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
              placeholder=" "
            />
            <label
              className={`absolute left-3 bg-white px-1 pointer-events-none transition-all ${formData.email ? "-top-2 text-xs text-[#b4853e]" : "top-3 text-sm text-gray-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#b4853e]"
                }`}
            >
              Email Id (Optional)
            </label>
          </div>

          {/* Address Lines */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1 || ''}
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
                value={formData.addressLine2 || ''}
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
                value={formData.landmark || ''}
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
                value={formData.city || ''}
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
                value={formData.pinCode || ''}
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
                value={formData.state || ''}
                onChange={handleChangeWithClearError}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${localErrors.state ? "border-red-500" : "border-gray-300 focus:border-[#b4853e]"
                  }`}
              />
              {localErrors.state && <p className="text-red-500 text-xs mt-1">{localErrors.state}</p>}
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="sameAddress"
              checked={formData.sameAddress || false}
              onChange={handleInputChange}
              className="w-4 h-4 accent-[#b4853e] mr-3"
            />
            <span className="text-sm">My delivery and billing addresses are the same.</span>
          </div>

          {/* Billing Address (Conditional) */}
          {!formData.sameAddress && (
            <div className="pt-6 mt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
              {/* Add your billing fields here if needed */}
            </div>
          )}

          {/* Statutory Information */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="addStatutory"
              checked={formData.addStatutory || false}
              onChange={handleInputChange}
              className="w-4 h-4 accent-[#b4853e] mr-3"
            />
            <span className="text-sm">Add statutory information</span>
          </div>

          {formData.addStatutory && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Statutory Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                />
                <input
                  type="text"
                  name="gstNo"
                  placeholder="GST No."
                  value={formData.gstNo || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="pt-4">
        <h3 className="mb-4 text-[16px]">Order Summary <span className="text-[#696661] text-[14px]">(items {totalItems})</span></h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between"><span className="text-[#696661] text-[14px]">Total MRP</span><span>₹{cartData?.total_mrp_amount || totals.totalMRP}</span></div>
          <div className="flex justify-between text-green-600"><span className="text-[#696661] text-[14px]">Discount</span><span>-₹{cartData?.total_sale_discount || totals.totalDiscount}</span></div>
          {cartData?.coupon_discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="text-[#696661] text-[14px]">Coupon Discount</span>
              <span>-₹{cartData.coupon_discount.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="border-t pt-2 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-[16px]">{cartData?.coupon_discount > 0 ? "Grand Total" : "Total"}</span>
            <span className="text-[16px] font-semibold">₹{cartData?.total_amount?.toFixed(2) || totals.totalPrice}</span>
          </div>
        </div>
        <button onClick={nextStep} className="w-full bg-[#b4853e] text-white py-3 mb-4">Check Out</button>
        <button onClick={() => navigate("/")} className="w-full text-[#b4853e] py-2 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default AddressStep;