
import React, { useState } from 'react';

const PaymentStep = ({ cartData, products, handleOrder, prevStep }) => {
  const totalItems = products?.length || 0;

  const SHIPPING_FEE = 70;
  const COD_CHARGE = 55;

  // Calculate MRP & Discount safely
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

  // Payment method state (default: Online)
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Final total
  const baseSubtotal = parseFloat(subtotal);
  const finalTotal = paymentMethod === 'cod'
    ? baseSubtotal + SHIPPING_FEE + COD_CHARGE
    : baseSubtotal + SHIPPING_FEE;

  const placeOrder = () => {
    const method = paymentMethod === 'cod' ? 'COD' : 'PREPAID';
    handleOrder(method);
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

        {/* Right Column: Order Summary - Aligned perfectly with left sections */}
        <div className="flex flex-col">
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="font-semibold mb-4">
              Order Summary (items {totalItems})
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span>₹{SHIPPING_FEE}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between">
                  <span>COD Charge</span>
                  <span>₹{COD_CHARGE}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-400 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-[#b4853e] text-white py-3 rounded-lg mt-6 font-medium hover:bg-[#a0753a] transition"
            >
              Next to Pay
            </button>

            <button
              onClick={prevStep}
              className="w-full text-[#b4853e] flex items-center justify-center gap-2 mt-4 hover:underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;