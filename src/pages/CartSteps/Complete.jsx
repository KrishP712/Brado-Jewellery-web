import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompleteStep = ({ order, cartData, formData }) => {
  const navigate = useNavigate();
  const shippingCharge = cartData?.shippingFee || 50;
  const codCharge = 25;
  const finalAmount = (parseFloat(cartData?.total_amount || 0) + shippingCharge + codCharge).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto text-center w-[80%]">
      <div className="bg-[#f8f8f8] rounded-lg p-[35px] mb-8">
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-[16px] font-medium mb-6">Order Placed Successfully</h2>
            <p className="text-[14px] mb-2 text-[#696661]">
              Order No.: <span className="text-black">{order?.orderId || "N/A"}</span>
            </p>
            <p className="text-[14px] text-[#696661]">
              Order Amount: <span className="text-black">₹{finalAmount}</span>
            </p>
          </div>

          <div className="border-l pl-6 border-gray-300">
            <h3 className="mb-2">Shipping Details</h3>
            <p className="text-[#696661] text-[14px]">{formData.contactName}</p>
            <p className="text-[#696661] text-[14px]">
              {formData.addressLine1}{formData.addressLine2 && `, ${formData.addressLine2}`}, {formData.city} - {formData.pinCode}
            </p>
            <p className="text-[#696661] text-[14px]">Mobile: {formData.contactNo}</p>

            <h3 className="text-[16px] mb-2 mt-5">Payment Details</h3>
            <p className="text-[#696661] text-[14px]">Mode: <span className="text-black">COD</span></p>
            <p className="text-[#696661] text-[14px]">Shipping: ₹{shippingCharge} | COD: ₹{codCharge}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-white border border-gray-300">
          Continue Shopping
        </button>
        <button onClick={() => navigate('/orders')} className="px-6 py-2 bg-[#b4853e] text-white">
          View Order
        </button>
      </div>
    </div>
  );
};

export default CompleteStep;