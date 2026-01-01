// src/components/checkout/PaymentStep.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentStep = ({ cartData, products, handleOrder, prevStep, nextStep }) => {
  const navigate = useNavigate();
  const totalItems = products?.length || 0;

  // Charges
  const SHIPPING_FEE = 70;
  const COD_CHARGE = 55;


  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("online");

  // Final Total (THIS WAS MISSING)
  const baseTotal = cartData?.total_amount || 0;

  const finalTotal =
    paymentMethod === "cod"
      ? baseTotal + SHIPPING_FEE + COD_CHARGE
      : baseTotal + SHIPPING_FEE;

  const placeOrder = () => {
    const method = paymentMethod === "cod" ? "COD" : "PREPAID";
    handleOrder(method);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Shipping Method */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
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
              <div className="bg-white border border-gray-300 rounded-lg p-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="w-5 h-5 accent-[#b4853e] mr-4"
                  />
                  <div>
                    <p className="font-medium">Online Payment</p>
                    <p className="text-sm text-gray-600">
                      Pay using Credit card, Debit card, UPI
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-5 flex items-center justify-between">
                <label className="flex items-center cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
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

        {/* Right Column */}
        <div className="pt-4">
          <h3 className="mb-4 text-[16px]">
            Order Summary{" "}
            <span className="text-[#696661] text-[14px]">
              (items {totalItems})
            </span>
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{cartData.total_mrp_amount}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Sale Discount</span>
              <span>-₹{cartData.total_sale_discount}</span>
            </div>

            {cartData.total_offer_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Offer Discount</span>
                <span>-₹{cartData.total_offer_discount}</span>
              </div>
            )}

            {cartData.coupon_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{cartData.coupon_discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{SHIPPING_FEE}</span>
            </div>

            {paymentMethod === "cod" && (
              <div className="flex justify-between">
                <span>COD Charges</span>
                <span>₹{COD_CHARGE}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>


          <button
            onClick={placeOrder}
            className="w-full bg-[#b4853e] text-white py-3 mb-4"
          >
            Place Order
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-[#b4853e] py-2 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
