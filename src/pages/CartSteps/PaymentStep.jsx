// src/components/checkout/PaymentStep.jsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PaymentStep = ({ cartData, products, handleOrder, prevStep }) => {
  const totalItems = products?.length || 0;

  // Fixed charges as per your design
  const SHIPPING_FEE = 70;   // General Shipping
  const COD_CHARGE = 55;    // Extra charge for COD

  // Safely calculate MRP and discount from products
  const calculateTotals = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return { totalMRP: 0, totalDiscount: 0, subtotal: 0 };
    }

    let totalMRP = 0;
    let totalPrice = 0;

    products.forEach((item) => {
      const qty = item.quantity || 1;
      const originalPrice = item.originalPrice || item.price || 0; // MRP
      const discountedPrice = item.price || 0;                     // After product discount

      totalMRP += originalPrice * qty;
      totalPrice += discountedPrice * qty;
    });

    const totalDiscount = totalMRP - totalPrice;

    return {
      totalMRP: totalMRP.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      subtotal: totalPrice.toFixed(2),
    };
  };

  const { totalMRP, totalDiscount, subtotal } = calculateTotals();

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('PREPAID'); // Default: Online Payment

  // Final total based on selected payment method
  const finalTotal =
    paymentMethod === 'COD'
      ? parseFloat(subtotal) + SHIPPING_FEE + COD_CHARGE
      : parseFloat(subtotal) + SHIPPING_FEE;

  // Trigger order placement with selected payment method
  const placeOrder = () => {
    handleOrder(paymentMethod);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto max-w-7xl">
      {/* Left Section: Shipping & Payment Methods */}
      <div className="lg:col-span-2 space-y-12">

        {/* Shipping Method */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Method</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
            <label className="flex items-center cursor-pointer flex-1">
              <input
                type="radio"
                name="shipping"
                checked
                readOnly
                className="w-5 h-5 text-[#b4853e] accent-[#b4853e] mr-5"
              />
              <div>
                <p className="font-semibold text-gray-900">General Shipping</p>
                <p className="text-sm text-gray-600 mt-1">3-5 Days Delivery</p>
              </div>
            </label>
            <span className="text-xl font-bold text-gray-900">₹{SHIPPING_FEE}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>
          <div className="space-y-5">

            {/* Online Payment */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
              <label className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="PREPAID"
                  checked={paymentMethod === 'PREPAID'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-[#b4853e] accent-[#b4853e] mt-1 mr-5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Online Payment</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay using Credit card, Debit card, UPI
                  </p>
                </div>
              </label>
            </div>

            {/* Cash on Delivery */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
              <label className="flex items-start justify-between cursor-pointer w-full">
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-[#b4853e] accent-[#b4853e] mt-1 mr-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600 mt-1">Pay at door steps</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">₹{COD_CHARGE}</span>
              </label>
            </div>

          </div>
        </div>
      </div>

      {/* Right Section: Order Summary */}
      <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-fit">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Order Summary{' '}
          <span className="text-sm font-normal text-gray-500">(items {totalItems})</span>
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Total MRP</span>
            <span className="font-medium">₹{totalMRP}</span>
          </div>

          <div className="flex justify-between text-base text-green-600">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium">-₹{totalDiscount}</span>
          </div>

          <div className="flex justify-between text-base">
            <span className="text-gray-600">Shipping Charge</span>
            <span className="font-medium">₹{SHIPPING_FEE}</span>
          </div>

          {paymentMethod === 'COD' && (
            <div className="flex justify-between text-base">
              <span className="text-gray-600">COD Charge</span>
              <span className="font-medium">₹{COD_CHARGE}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div className="flex justify-between text-2xl font-bold text-gray-900 mb-2">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-[#b4853e] text-white py-4 rounded-lg mt-8 font-bold text-lg hover:bg-[#9a7437] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Place Order
        </button>

        <button
          onClick={prevStep}
          className="w-full text-[#b4853e] flex items-center justify-center gap-3 py-4 mt-4 font-medium hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;