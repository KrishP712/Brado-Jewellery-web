// src/components/checkout/ShippingPaymentStep.jsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const PaymentStep = ({
  cartData,
  products,
  totalItems,
  handleNextStep,
  prevStep,
}) => {
  const [selectedShipping, setSelectedShipping] = useState('general');
  const [selectedPayment, setSelectedPayment] = useState('online');

  // Calculate totals
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

  // Shipping charges
  const shippingCharges = {
    general: 70,
  };

  // COD charges
  const codCharges = selectedPayment === 'cod' ? 55 : 0;

  // Calculate final total
  const shippingCharge = shippingCharges[selectedShipping];
  const baseTotal = parseFloat(cartData?.total_amount || totals.totalPrice);
  const finalTotal = baseTotal + shippingCharge + codCharges;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Shipping Method */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <label className={`flex items-center justify-between p-6 cursor-pointer border-2 rounded-lg transition-all ${
              selectedShipping === 'general' ? 'border-[#b4853e]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="shipping"
                  value="general"
                  checked={selectedShipping === 'general'}
                  onChange={(e) => setSelectedShipping(e.target.value)}
                  className="w-5 h-5 accent-[#b4853e]"
                />
                <div>
                  <div className="font-semibold text-[15px]">General Shipping</div>
                  <div className="text-sm text-gray-600">3-5 Days Delivery</div>
                </div>
              </div>
              <div className="text-lg font-semibold">₹{shippingCharges.general}</div>
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
          <div className="space-y-4">
            {/* Online Payment */}
            <label className={`flex items-center justify-between p-6 cursor-pointer border-2 rounded-lg transition-all bg-white ${
              selectedPayment === 'online' ? 'border-[#b4853e]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={selectedPayment === 'online'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 accent-[#b4853e]"
                />
                <div>
                  <div className="font-semibold text-[15px]">Online Payment</div>
                  <div className="text-sm text-gray-600">Pay using Credit card, Debit card, UPI</div>
                </div>
              </div>
            </label>

            {/* Cash on Delivery */}
            <label className={`flex items-center justify-between p-6 cursor-pointer border-2 rounded-lg transition-all bg-white ${
              selectedPayment === 'cod' ? 'border-[#b4853e]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === 'cod'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 accent-[#b4853e]"
                />
                <div>
                  <div className="font-semibold text-[15px]">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay at door steps</div>
                </div>
              </div>
              <div className="text-lg font-semibold">₹{codCharges}</div>
            </label>
          </div>
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
          <div className="flex justify-between">
            <span className="text-[#696661] text-[14px]">Shipping Charge</span>
            <span className="text-[14px]">₹{shippingCharge}</span>
          </div>
          {codCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">COD Charge</span>
              <span className="text-[14px]">₹{codCharges}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => handleNextStep({ 
            shippingMethod: selectedShipping, 
            paymentMethod: selectedPayment,
            shippingCharge,
            codCharges,
            finalTotal: finalTotal.toFixed(2)
          })}
          className="w-full bg-[#b4853e] text-white py-4 rounded-lg font-semibold hover:bg-[#9a7437] transition-all"
        >
          Next to Pay
        </button>

        <button
          onClick={prevStep}
          className="w-full text-[#b4853e] flex items-center justify-center gap-2 py-3 mt-4 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;