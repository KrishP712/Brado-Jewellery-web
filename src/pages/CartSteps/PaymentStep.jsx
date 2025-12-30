// src/components/checkout/PaymentStep.jsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PaymentStep = ({ cartData, products, handleOrder, prevStep, nextStep, navigate }) => {
  const totalItems = products?.length || 0;

  // Fixed Charges
  const SHIPPING_FEE = 70;
  const COD_CHARGE = 55;

  // Calculate MRP, Discount, and Subtotal from products
  const calculateTotals = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return { totalMRP: 0, totalDiscount: 0, subtotal: 0 };
    }

    let totalMRP = 0;
    let totalPrice = 0;

    products.forEach((item) => {
      const qty = item.quantity || 1;
      const originalPrice = item.originalPrice || item.price || 0;
      const price = item.price || 0;

      totalMRP += originalPrice * qty;
      totalPrice += price * qty;
    });

    const totalDiscount = totalMRP - totalPrice;

    return {
      totalMRP: totalMRP.toFixed(0),
      totalDiscount: totalDiscount.toFixed(0),
      subtotal: totalPrice.toFixed(0),
    };
  };

  const { totalMRP, totalDiscount, subtotal } = calculateTotals();

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Base subtotal from products
  const baseSubtotal = parseFloat(subtotal) || 0;

  // Final total calculation including shipping and COD
  const finalTotal = paymentMethod === 'cod'
    ? baseSubtotal + SHIPPING_FEE + COD_CHARGE
    : baseSubtotal + SHIPPING_FEE;

  // Trigger order placement
  const placeOrder = () => {
    const method = paymentMethod === 'cod' ? 'COD' : 'PREPAID';
    handleOrder({
      paymentMethod: method,
      shippingFee: SHIPPING_FEE,
      codCharge: paymentMethod === 'cod' ? COD_CHARGE : 0,
      grandTotal: finalTotal,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Shipping Method */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="shipping"
                  checked
                  readOnly
                  className="w-5 h-5 accent-[#b4853e] mr-4"
                />
                <div>
                  <p className="font-medium">General Shipping</p>
                  <p className="text-sm text-gray-600">3-5 Days Delivery</p>
                </div>
              </label>
              <span className="font-semibold">₹{SHIPPING_FEE}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
            <div className="space-y-4">
              {/* Online Payment */}
              <div className="bg-white border border-gray-300 rounded-lg p-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-5 h-5 accent-[#b4853e] mr-4"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">Pay using Credit card, Debit card, UPI</p>
                  </div>
                </label>
              </div>

              {/* Cash on Delivery */}
              <div className="bg-white border border-gray-300 rounded-lg p-5 flex items-center justify-between">
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 accent-[#b4853e] mr-4"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay at door steps</p>
                  </div>
                </label>
                <span className="font-semibold">₹{COD_CHARGE}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="pt-4">
          <h3 className="mb-4 text-[16px]">
            Order Summary <span className="text-[#696661] text-[14px]">(items {totalItems})</span>
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">Total MRP</span>
              <span>₹{cartData?.total_mrp_amount || totalMRP}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className="text-[#696661] text-[14px]">Discount</span>
              <span>-₹{cartData?.total_sale_discount || totalDiscount}</span>
            </div>
            {cartData?.coupon_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-[#696661] text-[14px]">Coupon Discount</span>
                <span>-₹{cartData.coupon_discount.toFixed(2)}</span>
              </div>
            )}

            {/* Subtotal (after product discounts) */}
            <div className="flex justify-between border-t pt-2">
              <span className="text-[#696661] text-[14px]">Subtotal</span>
              <span>₹{baseSubtotal.toFixed(2)}</span>
            </div>

            {/* Shipping Fee */}
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">Shipping</span>
              <span>₹{SHIPPING_FEE}</span>
            </div>

            {/* COD Charge - Only show if COD selected */}
            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-[#b4853e]">
                <span className="text-[#696661] text-[14px]">COD Charges</span>
                <span>+₹{COD_CHARGE}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="border-t pt-2 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-[16px]">Grand Total</span>
              <span className="text-[16px] font-semibold">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            className="w-full bg-[#b4853e] text-white py-3 mb-4 font-medium hover:bg-[#c0924e] transition-colors"
          >
            Place Order (₹{finalTotal.toFixed(2)})
          </button>

          {/* Continue Shopping */}
          <button
            onClick={() => navigate("/")}
            className="w-full text-[#b4853e] py-2 flex items-center justify-center gap-2 hover:text-[#c0924e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;