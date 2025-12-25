
import React from 'react';
import CheckBoxIcon from '../../assets/icons/CheckBox'
import X from "../../assets/icons/CloseIcon"
import add from "../../assets/images/wishlist/address.png";
import {ArrowLeft} from 'lucide-react';
  
const AddressStep = ({
  formData,
  handleInputChange,
  errors,
  setErrors,
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
  coupon,
  loading: couponLoading
}) => {
  const totalItems = products?.length || 0;

  // Calculate totals (same as original)
  const calculateTotals = () => {
    let totalMRP = 0;
    let totalDiscount = 0;
    let totalPrice = 0;

    products.forEach((item) => {
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const originalPrice = item.originalPrice || price;

      totalMRP += originalPrice * quantity;
      totalPrice += price * quantity;
    });

    totalDiscount = totalMRP - totalPrice;

    return {
      totalMRP: totalMRP.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      <div className="lg:col-span-2">
        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddressModal(false)}>
            <div 
              className="bg-white rounded-lg shadow-lg w-[420px] max-h-[90vh] flex flex-col relative mx-4" 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 pb-3 border-b">
                <h2 className="text-lg font-semibold">Select Delivery Address</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[60vh]">
                {addressData?.length > 0 ? (
                  <div className="space-y-3">
                    {addressData.map((item, index) => (
                      <label
                        key={item._id || index}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${
                          selectedAddress?._id === item._id 
                            ? "border-[#b4853e] bg-amber-50 shadow-md" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={index}
                          checked={selectedAddress?._id === item._id}
                          className="mt-1 mr-3 w-4 h-4 accent-[#b4853e]"
                          onChange={() => setSelectedAddress(item)}
                        />
                        <div className="flex flex-col text-sm text-gray-700 flex-1">
                          <span className="font-medium text-black">{item.name}</span>
                          <span className="text-gray-500">+91 {item.contactno}</span>
                          <span className="text-gray-600 mt-1 leading-snug">
                            {item.address1}, {item.address2 && `${item.address2}, `}{item.landmark && `${item.landmark}, `}
                            {item.city}, {item.state} - {item.pincode}, India
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <img src={add} alt="No Address" className="w-24 h-24 mb-4 opacity-60" />
                    <p className="text-black text-md font-medium mb-1">No Address yet!</p>
                    <p className="text-gray-600 text-sm">You haven't added any address yet. Please fill the form below.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {addressData?.length > 0 && (
                <div className="border-t p-4 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleApplyAddress(selectedAddress);
                    }}
                    disabled={!selectedAddress}
                    className="px-6 py-2 bg-[#b4853e] text-white font-semibold rounded-lg hover:bg-[#9a7437] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Delivery Address</h2>
          <button
            onClick={() => {
              setShowAddressModal(true);
            }}
            className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] font-medium border border-[#b4853e] rounded-lg hover:bg-[#b4853e] hover:text-white transition-colors"
          >
            <CheckBoxIcon /> Select Address
          </button>
        </div>

        {/* Address Form */}
        <div className="p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact No. <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange(e);
                if (errors?.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`peer w-full p-4 border rounded-xl text-sm focus:outline-none transition-all duration-200 ${
                errors?.email 
                  ? "border-red-500 focus:ring-2 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-2 focus:ring-[#b4853e] focus:border-transparent"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`absolute outline-none transition-all duration-200 bg-white px-2 pointer-events-none ${
                formData.email || errors?.email 
                  ? "-top-3 left-3 text-xs font-semibold" 
                  : "top-4 left-4 text-sm peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs"
              } ${
                errors?.email 
                  ? "text-red-500" 
                  : formData.email 
                    ? "text-[#b4853e]" 
                    : "text-gray-500 peer-focus:text-[#b4853e]"
              }`}
            >
              Email Id (Optional)
            </label>
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Address Lines */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="House number, street, area"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Building, floor, etc."
              />
            </div>
          </div>

          {/* Landmark & City */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Near XYZ, opposite ABC"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          {/* Pincode & State */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                maxLength={6}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                placeholder="Enter pincode"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter State"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                name="sameAddress"
                checked={formData.sameAddress}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#b4853e] bg-gray-100 border-gray-300 rounded focus:ring-[#b4853e] focus:ring-2 mr-3"
              />
              <span className="text-sm font-medium text-gray-700">
                My delivery and billing addresses are the same.
              </span>
            </label>
          </div>

          {/* Billing Address (Conditional) */}
          {!formData.sameAddress && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Billing Address</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Billing / Legal Name</label>
                  <input
                    type="text"
                    name="billingName"
                    placeholder="Enter Billing / Legal name"
                    value={formData.billingName}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e] focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="billingAddress1"
                    placeholder="Address line 1"
                    value={formData.billingAddress1}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                  <input
                    type="text"
                    name="billingAddress2"
                    placeholder="Address line 2 (Optional)"
                    value={formData.billingAddress2}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="billingCity"
                    placeholder="City"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                  <input
                    type="text"
                    name="billingPin"
                    placeholder="Pin Code"
                    value={formData.billingPin}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="billingState"
                    placeholder="State"
                    value={formData.billingState}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Statutory Info */}
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                name="addStatutory"
                checked={formData.addStatutory}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#b4853e] bg-gray-100 border-gray-300 rounded focus:ring-[#b4853e] focus:ring-2 mr-3"
              />
              <span className="text-sm font-medium text-gray-700">Add statutory information</span>
            </label>
          </div>

          {formData.addStatutory && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Statutory Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GST No.</label>
                  <input
                    type="text"
                    name="gstNo"
                    placeholder="GST No."
                    value={formData.gstNo}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b4853e]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-fit sticky top-8">
        <h3 className="mb-6 text-xl font-semibold text-gray-900">
          Order Summary <span className="text-[#696661] text-[14px]">(items {totalItems})</span>
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-[#696661] text-[14px]">Total MRP</span>
            <span className="text-[16px] font-semibold">₹{cartData?.total_mrp_amount || totals.totalMRP}</span>
          </div>
          <div className="flex justify-between items-center py-2 text-green-600">
            <span className="text-[#696661] text-[14px]">Discount</span>
            <span className="text-[16px] font-semibold">-₹{cartData?.total_sale_discount || totals.totalDiscount}</span>
          </div>

          {products.map((item, index) => (
            item.itemOfferDiscount > 0 && (
              <div key={index} className="flex justify-between items-center py-2 text-green-600">
                <span className="text-[#696661] text-[14px]">
                  Offer Discount ({item.offers?.[0]?.value || 0}%)
                </span>
                <span className="text-[14px] font-medium">-₹{item.itemOfferDiscount?.toFixed(2)}</span>
              </div>
            )
          ))}

          {cartData?.coupon_discount > 0 && (
            <div className="flex justify-between items-center py-2 text-green-600 bg-green-50 px-3 rounded-lg">
              <span className="text-[#696661] text-[14px]">
                Coupon Discount
              </span>
              <span className="text-[16px] font-semibold">-₹{cartData.coupon_discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex justify-between text-2xl font-bold text-gray-900 mb-2">
            <span>
              {cartData?.coupon_discount > 0 ? 'Grand Total' : 'Total'}
            </span>
            <span>
              ₹{cartData?.total_amount?.toFixed(2) || totals.totalPrice}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Shipping & COD Charges will be calculated at next step
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleNextStep}
            disabled={!formData.contactName || !formData.contactNo || !formData.addressLine1 || !formData.city || !formData.pinCode || !formData.state}
            className="w-full bg-[#b4853e] text-white py-4 text-lg font-semibold rounded-xl hover:bg-[#9a7437] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue to Payment
          </button>

          <p className="text-xs text-gray-500 text-center mb-4">
            Note: Shipping & COD Charges will be calculated at the next step if applicable.
          </p>

          <button
            onClick={prevStep}
            className="w-full text-[#b4853e] py-3 flex items-center justify-center gap-2 text-lg font-medium border-2 border-[#b4853e] rounded-xl hover:bg-[#b4853e] hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressStep;

