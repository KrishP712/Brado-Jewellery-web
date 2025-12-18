import React, { useState, useEffect } from 'react';
import add from "../../assets/images/wishlist/address.png";
import { useDispatch, useSelector } from 'react-redux';

import {
  getCartData,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartData
} from '../../redux/slices/cart';
import { createOrder, getorderbyorderidData } from '../../redux/slices/order';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
  ArrowLeft,
  X,
  Home,
  ChevronRight,
  BadgePercent,
  Check
} from 'lucide-react';
import CheckBoxIcon from '../../assets/icons/CheckBox';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../../redux/slices/wishlist';
import { getCouponData } from '../../redux/slices/coupon';
import { getAddressData, createAddressData } from '../../redux/slices/address';

const BuyNow = () => {
  const dispatch = useDispatch();
  const { cart, status, operationStatus } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.address.address);
  const addressData = address?.address
  const { coupon, loading } = useSelector((state) => state.coupon.coupon);
  const order = useSelector((state) => state.order.order);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponcode, setcouponcode] = useState('');
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    contactNo: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    billingName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPin: '',
    sameAddress: true,
    addStatutory: false,
    companyName: '',
    gstNo: ''
  });
  const handleNextStep = async () => {
    if (selectedAddress?._id) {
      nextStep();
      return;
    }
    const addressPayload = {
      name: formData.contactName,
      contactno: formData.contactNo,
      email: formData.email,
      address1: formData.addressLine1,
      address2: formData.addressLine2,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pinCode,
      country: "India",
    };

    dispatch(createAddressData(addressPayload))
      .unwrap()
      .then(() => {
        nextStep();
      })
      .catch(() => {
        console.log("Address creation failed");
      });
  };

  useEffect(() => {
    if (couponcode) {
      dispatch(getCartData(couponcode));
    } else {
      dispatch(getCartData());
    }
  }, [dispatch, couponcode]);

  useEffect(() => {
    if (showCouponModal) {
      dispatch(getCouponData());
    }
  }, [showCouponModal, dispatch]);

  useEffect(() => {
    if (showAddressModal) {
      dispatch(getAddressData());
    }
  }, [showAddressModal, dispatch]);

  // Extract cart data safely
  const cartData = cart[0] || {};
  const products = cartData?.products || [];
  const totalItems = products.length;
  // Calculate totals
  const calculateTotals = () => {
    let totalMRP = 0;
    let totalDiscount = 0;
    let totalPrice = 0;

    products.forEach((item) => {
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const originalPrice = item.originalPrice || price; // fallback if missing

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
  const steps = [
    { id: 1, title: 'Shopping Cart', icon: ShoppingCart },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Shipping & Payment', icon: CreditCard },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseCartQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseCartQuantity(productId));
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeCartData(productId));
  };

  const handleAddToWishlist = (productId) => {
    dispatch(addToWishlist(productId));
  };
  const handleApplyCoupon = (code) => {
    if (code.trim()) {
      dispatch(getCartData(code)); // apply using code
    }
  };

  const handleOrder = async () => {
    if (!cartData || !cartData.products || cartData.products.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderPayload = {
      // ✅ Items
      items: cartData.products.map((p) => ({
        productId: p.productId,
        title: p.title,
        sku: p.sku,
        slug: p.slug,
        quantity: p.quantity,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount || 0,
        totalPrice: p.itemPrice
      })),

      // ✅ Totals
      subtotal: cartData.total_product_price ||
        cartData.products.reduce((acc, p) => acc + (p.itemPrice || p.price * p.quantity), 0),

      shippingFee: 50,
      couponcode: selectedCouponId,
      couponDiscount: cartData.coupon_discount || 0,

      // ✅ Final total
      totalAmount:
        (cartData.total_amount ||
          cartData.products.reduce((acc, p) => acc + (p.itemPrice || p.price * p.quantity), 0)) +
        50 -
        (cartData.coupon_discount || 0),

      // ✅ Payment & Addresses
      paymentMethod: "COD",
      shippingAddress: {
        contactPersonName: formData.contactName,
        contactNo: formData.contactNo,
        address: formData.addressLine1,
        address2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pinCode,
      },
      billingAddress: {
        contactPersonName: formData.contactName,
        contactNo: formData.contactNo,
        address: formData.addressLine1,
        address2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pinCode,
      },
      isBillingAddressSame: formData.sameAddress,
    };
    useEffect(() => {
      console.log("AddressStep mounted");
      return () => console.log("AddressStep unmounted");
    }, []);
    const result = await dispatch(createOrder(orderPayload));

    const orderId = result?.payload?.order?.orderId;
    if (orderId) {
      dispatch(getorderbyorderidData(orderId));
      nextStep();
    }
  };


  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleApplyAddress = (address) => {
    if (!address) return;

    // Update the formData with selected address details
    setFormData((prev) => ({
      ...prev,
      contactName: address.name || '',
      contactNo: address.contactno || '',
      addressLine1: address.address1 || '',
      addressLine2: address.address2 || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      pinCode: address.pincode || '',
    }));

    // Close modal after applying address
    setShowAddressModal(false);
  };

  const StepIndicator = () => (
    <div className="my-4 bg-white">
      <div className="relative flex justify-between items-start max-w-3xl mx-auto">
        <div
          className="absolute top-[26%] h-[2px] bg-[#f4f3ef]"
          style={{
            left: "24px",
            right: "24px",
          }}
        />
        <div
          className="absolute top-6 h-[2px] bg-[#b4853e] transition-all duration-300"
          style={{
            left: "33px",
            top: "26%",
            width:
              currentStep > 1
                ? `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 44px)`
                : "0%",
          }}
        />
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-10 text-center"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 text-sm font-medium ${currentStep >= step.id
                ? "bg-[#b4853e] text-white"
                : "bg-[#f4f3ef] text-gray-600"
                }`}
            >
              {step.id}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${currentStep >= step.id ? "text-black" : "text-gray-500"
                }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const CouponModal = () => {
    const handleSelectCoupon = (couponId) => {
      const selectedCoupon = coupon.find((c) => c._id === couponId);
      if (selectedCoupon) {
        setcouponcode(selectedCoupon.code);

        setSelectedCouponId(selectedCoupon._id);

        handleApplyCoupon(selectedCoupon.code);
      }
    };

    return (
      showCouponModal && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCouponModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Save Big Today!</h3>
              <button onClick={() => setShowCouponModal(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Redeem your coupon and save big on your order today!
            </p>

            {/* Coupon Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponcode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleApplyCoupon(couponcode)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Apply
              </button>
            </div>

            {/* Coupons List */}
            <div className="mt-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading coupons...</p>
              ) : coupon?.filter((c) => c.isactive)?.length > 0 ? (
                <div className="space-y-3">
                  {coupon
                    .filter((c) => c.isactive)
                    .map((coupon) => (
                      <div
                        key={coupon._id}
                        onClick={() => handleSelectCoupon(coupon._id)}
                        className="border border-amber-400 rounded-lg p-3 hover:bg-amber-50 transition-all cursor-pointer"
                      >
                        <p className="font-semibold text-amber-600">{coupon.code}</p>
                        <p className="text-sm text-gray-600">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountpercentageValue}% OFF`
                            : `${coupon.discountfixedValue} % OFF`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Min order {coupon.minorderamount}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-16 mx-auto mb-4 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-600">0%</span>
                  </div>
                  <p className="text-gray-600 font-medium">We couldn't find any coupons!</p>
                  <p className="text-sm text-gray-500 mt-2">
                    No coupons are eligible for your cart. Please add something else and try again!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  const ShoppingCartStep = () => {
    if (status === "loading") {
      return <div className="text-center py-10">Loading cart...</div>;
    }

    if (!products || products.length === 0 || !products[0]?.price) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            className="bg-[#b4853e] text-white px-6 py-3 rounded"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-[23px]">
            Shopping Cart{" "}
            <span className="text-[#b4853e] text-[14px] ml-[10px]">
              {totalItems} Items
            </span>
          </h2>

          {products.map((item) => (
            console.log(item),
            <div
              key={item.productId || item._id}
              className="border-b border-gray-300 pb-[15px] mb-4 relative"
            >
              <div className="absolute top-2 right-2 md:flex space-x-2 hidden">
                <div
                  className="text-[13px] text-gray-900 cursor-pointer"
                  onClick={() => handleAddToWishlist(item.productId)}
                >
                  Move to wishlist
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div
                  className="text-[13px] text-red-800 cursor-pointer"
                  onClick={() => handleRemoveProduct(item.productId)}
                >
                  Remove
                </div>
              </div>

              {/* === Product Info === */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-27 h-35 object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-[#696661] text-[12px]">SKU: {item.sku}</p>
                    <h4 className="text-[14px]">{item.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[14px]">₹{item.price}</span>
                      {item.discount > 0 && (
                        <>
                          <span className="text-gray-600 line-through text-[14px]">
                            ₹{item.originalPrice}
                          </span>
                          <span className="text-[#b4853e] text-[12px]">
                            ({item.discount}% OFF)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-600 mt-1">Category: {item.category}</p>
                    {item.stock < 10 && (
                      <p className="text-[12px] text-red-600 mt-1">
                        Only {item.stock} left in stock!
                      </p>
                    )}

                    {item.offer && !item.itemOfferDiscount > 0 && (
                      <div className="bg-[#f9f6f1] rounded-md mt-2 py-2 px-2 flex items-center justify-between w-fit min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b4853e] text-white flex-shrink-0">
                            <BadgePercent size={12} strokeWidth={2} />
                          </span>
                          <span className="text-xs text-[#3b2b1b] font-medium">{item.offer}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#b4853e] ml-2" />
                      </div>
                    )}

                    {item.offers?.[0] &&
                      item.quantity >= item.offers[0].minQuantity &&
                      item.offers[0].active && (
                        <p className="text-green-600 text-sm mt-1 font-medium">
                          Bulk Deal Discount: ₹{item.itemOfferDiscount?.toFixed(2) || 0}
                        </p>
                      )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex border border-gray-200 p-[2px] rounded">
                      <button
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        disabled={
                          operationStatus === "loading" || item.quantity <= 1
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-4 mt-1 font-[8px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        disabled={
                          operationStatus === "loading" ||
                          item.quantity >= item.stock
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <span className="ml-4 text-lg font-bold">
                  ₹{item.itemTotal?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-6 h-fit">
          <div className="flex items-center justify-between mb-4 bg-[#f3f9f6] p-4 rounded-md">
            <div>
              <h3 className="text-[16px]">🎫 Apply Coupons</h3>
              <p className="text-[12px] mt-[5px] text-gray-600">
                To reveal exclusive discounts and start saving instantly.
              </p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-[14px]"
            >
              Apply
            </button>
          </div>

          <div className="pt-4">
            <h3 className="mb-4 text-[16px]">
              Order Summary{" "}
              <span className="text-[#696661] text-[14px]">
                (items {totalItems})
              </span>
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-[#696661] text-[14px]">Total MRP</span>
                <span className="text-[14px]">
                  ₹{cartData?.total_mrp_amount || 0}
                </span>
              </div>

              <div className="flex justify-between text-green-600">
                <span className="text-[#696661] text-[14px]">Discount</span>
                <span className="text-[14px]">
                  -₹{cartData?.total_sale_discount || 0}
                </span>
              </div>

              {products.map((item, index) => (
                item.itemOfferDiscount > 0 && (
                  <div className="flex justify-between text-green-600" key={index}>
                    <span className="text-[#696661] text-[14px]">
                      Offer Discount ({item.offers?.[0].value}%)
                    </span>
                    <span className="text-[14px]">
                      -₹{item.itemOfferDiscount?.toFixed(2)}
                    </span>
                  </div>
                )
              ))}
              {cartData?.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-[#696661] text-[14px]">
                    Coupon Discount ({cart?.coupon?.discountValue})
                  </span>
                  <span className="text-[14px]">
                    -₹{cartData?.coupon_discount?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-2 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-[16px]">
                  {cartData?.coupon_discount > 0 ? "Grand Total" : "Total"}
                </span>
                <span className="text-[16px] font-semibold">
                  ₹
                  {cartData?.coupon_discount > 0
                    ? cartData?.total_amount?.toFixed(2)
                    : cartData?.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={totalItems === 0}
              className="w-full bg-[#b4853e] text-white py-3 mb-4 disabled:opacity-50"
            >
              Check Out
            </button>
            <button className="w-full text-[#b4853e] py-2 flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  };


  const AddressStep = ({ formData, handleInputChange, errors, setErrors }) => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Delivery Address</h2>
          {showAddressModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-[420px] max-h-[90vh] flex flex-col relative">

                <button
                  onClick={() => setShowAddressModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 pb-3 border-b">
                  <h2 className="text-lg font-semibold">Select Delivery Address</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {addressData?.length > 0 ? (
                    <div className="space-y-3">
                      {addressData.map((item, index) => (
                        <label
                          key={index}
                          className={`flex items-start p-4 border rounded-lg cursor-pointer hover:shadow-sm ${selectedAddress?._id === item._id ? "border-[#b4853e]" : "border-gray-200"
                            }`}
                        >
                          <input
                            type="radio"
                            name="selectedAddress"
                            value={index}
                            checked={selectedAddress?._id === item._id}
                            className="mt-1 mr-3 accent-[#b4853e]"
                            onChange={() => setSelectedAddress(item)}
                          />
                          <div className="flex flex-col text-sm text-gray-700">
                            <span className="font-medium text-black">{item.name}</span>
                            <span className="text-gray-500">+91 {item.contactno}</span>
                            <span className="text-gray-600 mt-1 leading-snug">
                              {item.address1}, {item.address2}, {item.landmark}, {item.city}, {item.state} - {item.pincode}, {item.country}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <img src={add} alt="No Address" className="w-24 h-24 mb-4" />
                      <p className="text-black-600 text-md text-wider">No Address yet!</p>
                      <p className="text-gray-600 text-sm">You haven't added any address!</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {addressData?.length > 0 && (
                  <div className="border-t p-4 flex justify-end">
                    <button
                      onClick={() => {
                        setShowAddressModal(false);
                        handleApplyAddress(selectedAddress);
                      }}
                      className="bg-[#b4853e] text-white text-sm font-semibold px-5 py-2 rounded hover:bg-[#9a7437]"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              dispatch(getAddressData());
              setShowAddressModal(true);
            }}
            className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] cursor-pointer"
          >
            <CheckBoxIcon /> Select Address
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="relative mb-3">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange(e);
                if (errors?.email) setErrors({});
              }}
              className={`peer w-full border rounded-md py-3 px-3 text-sm focus:outline-none transition-all duration-200 ${errors?.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#b4853e]"
                }`}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`absolute outline-none transition-all duration-200 bg-white px-1 pointer-events-none ${formData.email || errors?.email ? "-top-2 left-2 text-xs" : "top-3 left-3 text-sm peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs"
                } ${errors?.email ? "text-red-500" : formData.email ? "text-[#b4853e]" : "text-gray-500 peer-focus:text-[#b4853e]"
                }`}
            >
              Email Id (Optional)
            </label>
            {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter State"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="sameAddress"
              checked={formData.sameAddress}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">My delivery and billing addresses are the same.</span>
          </div>

          {!formData.sameAddress && (
            <div className="pt-6 mt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="billingName"
                  placeholder="Enter Billing / Legal name"
                  value={formData.billingName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingAddress1"
                    placeholder="Address line 1"
                    value={formData.billingAddress1}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    name="billingAddress2"
                    placeholder="Address line 2 (Optional)"
                    value={formData.billingAddress2}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingCity"
                    placeholder="City"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    name="billingPin"
                    placeholder="Pin Code"
                    value={formData.billingPin}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">State</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="addStatutory"
              checked={formData.addStatutory}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm">Add statutory information</span>
          </div>

          {formData.addStatutory && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Statutory Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="gstNo"
                  placeholder="GST No."
                  value={formData.gstNo}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg h-fit">
        <h3 className="mb-4">Order Summary <span className='text-[#696661] text-[14px]'>(items {totalItems})</span></h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className='text-[#696661] text-[14px]'>Total MRP</span>
            <span className='text-[14px]'>₹{totals.totalMRP}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className='text-[#696661] text-[14px]'>Discount</span>
            <span className='text-[14px]'>-₹{totals.totalDiscount}</span>
          </div>

          {cartData?.coupon_discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className='text-[#696661] text-[14px]'>Coupon Discount ({cart?.coupon?.discountValue})</span>
              <span className='text-[14px]'>-₹{cartData?.coupon_discount?.toFixed(2)}</span>
            </div>
          )}
          {products.map((item) =>
            item.itemOfferDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className='text-[#696661] text-[14px]'>Offer Discount({item.offers.value}%)</span>
                <span className='text-[14px]'>-₹{item.itemOfferDiscount?.toFixed(2)}</span>
              </div>
            ))}
        </div>
        <div className="border-t pt-2 mb-6">
          <div className="flex justify-between text-lg">
            <span className='text-[16px]'>
              {cartData?.coupon_discount > 0 ? 'Grand Total' : 'Total'}
            </span>
            <span className='text-[16px] font-semibold'>
              ₹{cartData?.coupon_discount > 0
                ? cartData?.total_amount?.toFixed(2)
                : cartData?.total_amount?.toFixed(2)
              }
            </span>
          </div>
        </div>

        <button
          onClick={handleNextStep}
          className="w-full bg-[#b4853e] text-white py-3 mb-4 rounded-lg hover:bg-[#a0753a] transition-colors"
        >
          Next
        </button>

        <p className="text-xs text-gray-500 mb-4">
          Note: Shipping & COD Charges will be calculated at the next step if applicable.
        </p>

        <button
          onClick={prevStep}
          className="flex items-center text-[#b4853e] cursor-pointer hover:text-[#a0753a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
    </div>
  );

  const PaymentStep = () => {
    const DEFAULT_SHIPPING_FEE = 50;
    const COD_CHARGE = 25;

    // === Safely extract values ===
    const shippingFee = cartData?.shippingFee ?? DEFAULT_SHIPPING_FEE;
    const couponDiscount = cartData?.coupon_discount || 0;
    const totalAmount = cartData?.total_amount || 0;

    // === Calculate final total ===
    const finalTotal = parseFloat(totalAmount) + COD_CHARGE;

    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* === Shipping Method === */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
          <div className="bg-white border rounded-lg p-4 border-gray-300 w-[60%] flex justify-between">
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer hover:bg-gray-50">
                <input type="radio" name="shipping" className="mr-3" defaultChecked />
                <span>Standard Shipping</span>
              </label>
              <p className="mt-[10px] ml-[25px] text-[#696661]">3-5 Days Delivery</p>
            </div>
            <div>₹{shippingFee}</div>
          </div>
        </div>

        {/* === Payment Method === */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
          <div className="bg-white">
            <div className="space-y-3">
              <div className="border border-gray-200 p-4 w-[60%]">
                <label className="flex items-center rounded-lg cursor-pointer">
                  <input type="radio" name="payment" className="mr-3" defaultChecked />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <p className="mt-[10px] ml-[25px] text-[#696661]">Pay at doorstep</p>
              </div>
              <div className="border border-gray-200 p-4 w-[60%]">
                <label className="flex items-center rounded-lg cursor-pointer w-[60%]">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>Online Payment</span>
                </label>
                <p className="mt-[10px] ml-[25px] text-[#696661]">
                  Pay using Credit card, Debit card, or UPI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === Order Summary === */}
        <div className="p-6 h-fit">
          <h3 className="mb-4">
            Order Summary <span className="text-[#696661]">(items {totalItems})</span>
          </h3>

          {/* Product Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">Total MRP</span>
              <span className="text-[14px]">₹{totals?.totalMRP || "0.00"}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span className="text-[#696661] text-[14px]">Discount</span>
              <span className="text-[14px]">-₹{totals?.totalDiscount || "0.00"}</span>
            </div>


            {/* Coupon Discount */}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600 mb-2">
                <span className="text-[#696661] text-[14px]">
                  Coupon Discount ({cart?.coupon?.discountValue || cartData?.coupon_code || ""})
                </span>
                <span className="text-[14px]">-₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            {products.map((item) =>
              item.itemOfferDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className='text-[#696661] text-[14px]'>Offer Discount({item.offers.value}%)</span>
                  <span className='text-[14px]'>-₹{item.itemOfferDiscount?.toFixed(2)}</span>
                </div>
              ))}
          </div>
          {/* Grand Total */}
          <div className="border-t pt-2 mb-4">
            <div className="flex justify-between text-lg">
              <span className="text-[16px]">
                {couponDiscount > 0 ? "Grand Total" : "Total"}
              </span>
              <span className="text-[16px] font-semibold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Extra Charges */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">COD Charges</span>
              <span className="text-[14px]">₹{COD_CHARGE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#696661] text-[14px]">Shipping Charges</span>
              <span className="text-[14px]">₹{shippingFee}</span>
            </div>
          </div>

          {/* ✅ Final Total */}
          <div className="border-t pt-2 mb-6 border-gray-400">
            <div className="flex justify-between text-lg">
              <span className="text-[#1b1917] text-[16px]">Total</span>
              <span className="text-[16px] font-semibold">
                ₹{(totalAmount + (COD_CHARGE + shippingFee)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleOrder}
            className="w-full bg-[#b4853e] text-white py-3 mb-4"
          >
            Place Order
          </button>

          <button
            onClick={prevStep}
            className="w-full text-[#b4853e] py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  };


  const CompleteStep = () => {
    // optional: if COD always 25
    const codCharge = 25;
    const shippingCharge = cartData?.shippingFee || 50;

    // ✅ Calculate correct final total
    const finalAmount = (parseFloat(cartData?.total_amount || 0) + codCharge + shippingCharge).toFixed(2);

    return (
      <div className="max-w-3xl mx-auto text-center w-[80%]">
        <div className="bg-[#f8f8f8] rounded-lg p-[35px] mb-8">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* === Left Section === */}
            <div className="text-center">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-[16px] font-medium mb-6">
                Order Placed Successfully
              </h2>

              {/* Order Info */}
              <p className="text-[14px] mb-2 text-[#696661]">
                Order No.:{" "}
                <span className="text-[14px] text-[#000000]">
                  {order?.orderId || "250900053"}
                </span>
              </p>

              <p className="text-[14px] text-[#696661]">
                Order Amount:{" "}
                <span className="text-[14px] text-[#000000]">₹{finalAmount}</span>
              </p>

              {/* ✅ Optional Coupon Info */}
              {cartData?.coupon_discount > 0 && (
                <p className="text-[13px] text-green-600 mt-1">
                  Coupon Applied:{" "}
                  <span className="font-semibold">
                    {cartData?.coupon_code || couponcode}
                  </span>{" "}
                  (Saved ₹{cartData?.coupon_discount?.toFixed(2)})
                </p>
              )}
            </div>

            {/* === Right Section === */}
            <div className="border-l pl-6 border-gray-300">
              <h3 className="mb-2">Shipping Details</h3>
              <p className="text-[#696661] text-[14px] mb-[5px]">
                {formData.contactName}
              </p>
              <p className="text-[#696661] text-[14px] mb-[5px]">
                {formData.addressLine1}
                {formData.addressLine2 && `, ${formData.addressLine2}`}
                {formData.landmark && `, ${formData.landmark}`}
                , {formData.city}-{formData.pinCode}, {formData.state}, India
              </p>
              <p className="text-[#696661] text-[14px] mb-[5px]">
                Mobile No. : {formData.contactNo}
              </p>
              {formData.email && (
                <p className="text-[#696661] text-[14px] mb-[5px]">
                  Email Id : {formData.email}
                </p>
              )}

              <h3 className="text-[16px] mb-2 mt-5">Payment Details</h3>
              <p className="text-[#696661] text-[14px]">
                Mode: <span className="text-[#000000]">COD</span>
              </p>
              <p className="text-[#696661] text-[14px] mt-1">
                Shipping: ₹{shippingCharge} | COD: ₹{codCharge}
              </p>
            </div>
          </div>
        </div>

        {/* === Footer Buttons === */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 bg-white border border-gray-300"
            onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="px-6 py-2 bg-[#b4853e] text-white"
            onClick={() => navigate('/orders')}>
            View Order
          </button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ShoppingCartStep />;
      case 2:
        return (
          <AddressStep
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return <PaymentStep />;
      case 4:
        return <CompleteStep />;
      default:
        return <ShoppingCartStep />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>›</span>
            <span>Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <StepIndicator />
        {renderStep()}
      </div>

      <CouponModal />
    </div>
  );
};

export default BuyNow;