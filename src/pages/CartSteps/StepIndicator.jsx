import React from 'react';
import { ShoppingCart, MapPin, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Shopping Cart', icon: ShoppingCart },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Shipping & Payment', icon: CreditCard },
  { id: 4, title: 'Complete', icon: CheckCircle }
];

const StepIndicator = ({ currentStep }) => (
  <div className="my-4 bg-white">
    <div className="relative flex justify-between items-start max-w-3xl mx-auto">
      <div
        className="absolute top-[26%] h-0.5 bg-[#f4f3ef]"
        style={{ left: "24px", right: "24px" }}
      />
      <div
        className="absolute top-6 h-0.5 bg-[#b4853e] transition-all duration-300"
        style={{
          left: "33px",
          top: "26%",
          width: currentStep > 1
            ? `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 44px)`
            : "0%",
        }}
      />
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center relative z-10 text-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 text-sm font-medium ${
              currentStep >= step.id
                ? "bg-[#b4853e] text-white"
                : "bg-[#f4f3ef] text-gray-600"
            }`}
          >
            {step.id}
          </div>
          <span
            className={`text-xs font-medium whitespace-nowrap ${
              currentStep >= step.id ? "text-black" : "text-gray-500"
            }`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default StepIndicator;