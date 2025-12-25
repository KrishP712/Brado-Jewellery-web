
import React from 'react';

const PaymentStep = ({ cartData, products, handleOrder, prevStep }) => {
  const totalItems = products.length;
  const shippingFee = 50;
  const codCharge = 25;
  const finalTotal = (cartData?.total_amount || 0) + shippingFee + codCharge;

  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
        {/* Standard Shipping */}
        <h2 className="text-2xl font-semibold mb-6 mt-10">Payment Method</h2>
        {/* COD & Online */}
      </div>

      <div className="p-6 bg-white rounded-lg">
        <h3>Order Summary ({totalItems} items)</h3>
        {/* Breakdown */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={handleOrder} className="w-full bg-[#b4853e] text-white py-3 mt-6">Place Order</button>
        <button onClick={prevStep} className="w-full text-[#b4853e] mt-3 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;