import React, { useState, useRef, useEffect } from "react";
import { otpVerify, resendOTP, signInUser } from "../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SignIn = ({ open, onClose, data }) => {
  const [model, setModel] = useState("email");
  const [email, setEmail] = useState("");
  const [keepUpdates, setKeepUpdates] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  // OTP related states
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.auth);
  const isModal = open !== undefined;

  if (isModal && !open) return null;
  useEffect(() => {
    if (resendTimer > 0 && model === "otp") {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, model]);

  useEffect(() => {
    if (model === "otp" && otp.every(digit => digit !== "")) {
      handleOTPComplete(otp.join(""));
      if (onClose) {
        onClose();
      }
    }
  }, [otp, model]);



  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email.trim())) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    setIsSendingOTP(true);

    try {
      await dispatch(signInUser({ email: email, setModel }));
      setResendTimer(120);
    } catch (error) {
      setErrors({ email: "Failed to send OTP. Please try again." });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handleOTPComplete = async (otpValue) => {
    setIsVerifying(true);
    setErrors({});
    dispatch(otpVerify({ id: state?.id, otp: + otpValue, setIsVerifying, data }));
  };

  const otpVerifyNext = () => {
    handleOTPComplete(otp.join(""));
  }


  const handleResendOTP = () => {
    setResendTimer(60);
    setErrors({});

    dispatch(resendOTP({ id: state?.id }));
  };

  const handleBackToEmail = () => {
    setModel("email");
    setOtp(new Array(6).fill(""));
    setIsVerifying(false);
    setIsSendingOTP(false);
  };

  // Render Email Input View
  const renderEmailView = () => (
    <div className="bg-white w-full sm:w-[450px] max-w-lg rounded-sm shadow-lg relative p-6 animate-fadeIn">

      {isModal && (
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <CloseIcon className="w-5 h-5" />
        </button>
      )}

      <h2 className="text-[22.4px] text-[#333] font-medium text-center mb-3" style={{ wordSpacing: "4px" }}>
        Login or Signup
      </h2>
      <p style={{ wordSpacing: "4px" }} className="text-center text-[#000000] text-[14px] mb-4 font-medium">
        Please submit your email address to continue
      </p>

      <button
        className="w-[50%] mx-auto flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2 mb-3 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 transition cursor-pointer"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>

      <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="px-2 text-gray-400 text-sm">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleEmailSubmit}>
        <div className="relative mb-3">
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            className={`peer w-full border rounded-md py-3 px-3 text-sm focus:outline-none transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#b4853e]"
              }`}
            placeholder=" "
          />
          <label
            htmlFor="email"
            className={`absolute outline-none transition-all duration-200 bg-white px-1 pointer-events-none ${email || errors.email ? "-top-2 left-2 text-xs" : "top-3 left-3 text-sm peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs"
              } ${errors.email ? "text-red-500" : email ? "text-[#b4853e]" : "text-gray-500 peer-focus:text-[#b4853e]"
              }`}
          >
            Email
          </label>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            className="accent-[#b4853e]"
            checked={keepUpdates}
            onChange={(e) => setKeepUpdates(e.target.checked)}
          />
          Keep up with our latest news and events.
        </label>

        <button
          type="submit"
          disabled={isSendingOTP}
          className="w-full bg-[#b4853e] text-white py-2 rounded-md hover:bg-[#996f2d] transition disabled:opacity-50"
        >
          {isSendingOTP ? "Sending OTP..." : "Next"}
        </button>
      </form>
    </div>
  );

  // Render OTP View
  const renderOTPView = () => (
    <div className="bg-white w-full sm:w-[450px] max-w-lg rounded-sm shadow-lg relative p-6 animate-fadeIn">

      {isModal && (
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}

      <h2
        className="text-[22px] text-gray-600 font-medium text-center mb-3"
        style={{ wordSpacing: "4px" }}
      >
        Verify OTP
      </h2>

      <p className="text-center text-gray-600 text-[13px] mb-6 font-medium">
        Enter the 6-digit code sent to <span className="font-bold">{email}</span>
      </p>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleOTPChange(e.target, index)}
            onKeyDown={(e) => handleOTPKeyDown(e, index)}
            className="w-12 h-15 border-1 border-gray-300 focus:border-[#b4853e] rounded-md text-center text-lg font-semibold outline-none"
          />
        ))}
      </div>

      {/* Resend Timer */}
      <div className="text-center mb-4">
        {resendTimer > 0 ? (
          <p className="text-gray-500 text-sm">
            Resend OTP in {resendTimer}s
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            className="text-[#b4853e] text-sm hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* Error Message */}
      {errors.otp && (
        <p className="text-red-500 text-sm text-center mb-3">{errors.otp}</p>
      )}

      {/* Verify Button */}
      <button
        onClick={otpVerifyNext}
        disabled={isVerifying}
        className="w-full bg-[#b4853e] text-white py-2 rounded-md hover:bg-[#996f2d] transition disabled:opacity-50 mb-3"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>

      {/* Back Button */}
      <button
        onClick={handleBackToEmail}
        className="w-full py-2 text-[#b4853e] hover:underline"
      >
        Back to Sign In
      </button>
    </div>
  );

  return (
    <div
      className={
        isModal
          ? "w-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          : "relative"
      }
      onClick={onClose}
    >
      <div className="inline-block" onClick={(e) => e.stopPropagation()}>
        {model === "email" ? renderEmailView() : renderOTPView()}
      </div>
    </div>
  );
};

export default SignIn;