// import React from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { getCartData } from '../../redux/slices/cart';
// import { addToWishlist } from '../../redux/slices/wishlist';
// import { increaseCartQuantity, decreaseCartQuantity, removeCartData } from '../../redux/slices/cart';
// import { createOrder } from '../../redux/slices/order';
// import { getCouponData } from '../../redux/slices/coupon';
// import { getAddressData, createAddressData } from '../../redux/slices/address';
// import { getorderbyorderidData } from '../../redux/slices/order';

// const Cart = ({products}) => {

//             // if (status === "loading") {
//             //     return <div className="text-center py-10">Loading cart...</div>;
//             // }

//             // if (!products || products.length === 0 || !products[0]?.price) {
//             //     return (
//             //         <div className="text-center py-10">
//             //             <p className="text-gray-600 mb-4">Your cart is empty</p>
//             //             <button
//             //                 className="bg-[#b4853e] text-white px-6 py-3 rounded"
//             //                 onClick={() => navigate("/")}
//             //             >
//             //                 Continue Shopping
//             //             </button>
//             //         </div>
//             //     );
//             // }

//             return (
//                 <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
//                     <div className="lg:col-span-2">
//                         <h2 className="mb-6 text-[23px]">
//                             Shopping Cart{" "}
//                             <span className="text-[#b4853e] text-[14px] ml-[10px]">
//                                 {totalItems} Items
//                             </span>
//                         </h2>

//                         {products.map((item) => (
//                             <div
//                                 key={item.productId || item._id}
//                                 className="border-b border-gray-300 pb-[15px] mb-4 relative"
//                             >
//                                 <div className="absolute top-2 right-2 md:flex space-x-2 hidden">
//                                     <div
//                                         className="text-[13px] text-gray-900 cursor-pointer"
//                                         onClick={() => handleAddToWishlist(item.productId)}
//                                     >
//                                         Move to wishlist
//                                     </div>
//                                     <div className="w-px h-4 bg-gray-300" />
//                                     <div
//                                         className="text-[13px] text-red-800 cursor-pointer"
//                                         onClick={() => handleRemoveProduct(item.productId)}
//                                     >
//                                         Remove
//                                     </div>
//                                 </div>

//                                 {/* === Product Info === */}
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex space-x-4">
//                                         <img
//                                             src={item.image}
//                                             alt={item.title}
//                                             className="w-27 h-35 object-cover"
//                                         />  

//                                         <div className="flex-1">
//                                             <p className="text-[#696661] text-[12px]">SKU: {item.sku}</p>
//                                             <h4 className="text-[14px]">{item.title}</h4>
//                                             <div className="flex items-center space-x-2 mt-1">
//                                                 <span className="text-[14px]">₹{item.price}</span>
//                                                 {item.discount > 0 && (
//                                                     <>
//                                                         <span className="text-gray-600 line-through text-[14px]">
//                                                             ₹{item.originalPrice}
//                                                         </span>
//                                                         <span className="text-[#b4853e] text-[12px]">
//                                                             ({item.discount}% OFF)
//                                                         </span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <p className="text-[12px] text-gray-600 mt-1">Category: {item.category}</p>
//                                             {item.stock < 10 && (
//                                                 <p className="text-[12px] text-red-600 mt-1">
//                                                     Only {item.stock} left in stock!
//                                                 </p>
//                                             )}

//                                             {item.offer && !item.itemOfferDiscount > 0 && (
//                                                 <div className="bg-[#f9f6f1] rounded-md mt-2 py-2 px-2 flex items-center justify-between w-fit min-w-[200px]">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b4853e] text-white flex-shrink-0">
//                                                             <BadgePercent size={12} strokeWidth={2} />
//                                                         </span>
//                                                         <span className="text-xs text-[#3b2b1b] font-medium">{item.offer}</span>
//                                                     </div>
//                                                     <ChevronRight className="w-4 h-4 text-[#b4853e] ml-2" />
//                                                 </div>
//                                             )}

//                                             {item.offers?.[0] &&
//                                                 item.quantity >= item.offers[0].minQuantity &&
//                                                 item.offers[0].active && (
//                                                     <p className="text-green-600 text-sm mt-1 font-medium">
//                                                         Bulk Deal Discount: ₹{item.itemOfferDiscount?.toFixed(2) || 0}
//                                                     </p>
//                                                 )}
//                                         </div>

//                                         <div className="flex items-center gap-3">
//                                             <div className="flex border border-gray-200 p-[2px] rounded">
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => handleDecreaseQuantity(item.productId)}
//                                                     disabled={item.quantity <= 1
//                                                     }
//                                                     className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
//                                                 >
//                                                     <Minus className="w-4 h-4" />
//                                                 </button>
//                                                 <span className="mx-4 mt-1 font-[8px]">
//                                                     {item.quantity}
//                                                 </span>
//                                                 <button
//                                                     type='button'
//                                                     onClick={() => handleIncreaseQuantity(item.productId)}
//                                                     disabled={
//                                                         item.quantity >= item.stock
//                                                     }
//                                                     className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
//                                                 >
//                                                     <Plus className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <span className="ml-4 text-lg font-bold">
//                                         ₹{item.itemTotal?.toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="bg-white rounded-lg p-6 h-fit">
//                         <div className="flex items-center justify-between mb-4 bg-[#f3f9f6] p-4 rounded-md">
//                             <div>
//                                 <h3 className="text-[16px]">🎫 Apply Coupons</h3>
//                                 <p className="text-[12px] mt-[5px] text-gray-600">
//                                     To reveal exclusive discounts and start saving instantly.
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => setShowCouponModal(true)}
//                                 className="px-3 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-[14px]"
//                             >
//                                 Apply
//                             </button>
//                         </div>

//                         <div className="pt-4">
//                             <h3 className="mb-4 text-[16px]">
//                                 Order Summary{" "}
//                                 <span className="text-[#696661] text-[14px]">
//                                     (items {totalItems})
//                                 </span>
//                             </h3>

//                             <div className="space-y-2 mb-4">
//                                 <div className="flex justify-between">
//                                     <span className="text-[#696661] text-[14px]">Total MRP</span>
//                                     <span className="text-[14px]">
//                                         ₹{cartData?.total_mrp_amount || 0}
//                                     </span>
//                                 </div>

//                                 <div className="flex justify-between text-green-600">
//                                     <span className="text-[#696661] text-[14px]">Discount</span>
//                                     <span className="text-[14px]">
//                                         -₹{cartData?.total_sale_discount || 0}
//                                     </span>
//                                 </div>

//                                 {products.map((item, index) => (
//                                     item.itemOfferDiscount > 0 && (
//                                         <div className="flex justify-between text-green-600" key={index}>
//                                             <span className="text-[#696661] text-[14px]">
//                                                 Offer Discount ({item.offers?.[0].value}%)
//                                             </span>
//                                             <span className="text-[14px]">
//                                                 -₹{item.itemOfferDiscount?.toFixed(2)}
//                                             </span>
//                                         </div>
//                                     )
//                                 ))}
//                                 {cartData?.coupon_discount > 0 && (
//                                     <div className="flex justify-between text-green-600">
//                                         <span className="text-[#696661] text-[14px]">
//                                             Coupon Discount ({cart?.coupon?.discountValue})
//                                         </span>
//                                         <span className="text-[14px]">
//                                             -₹{cartData?.coupon_discount?.toFixed(2)}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="border-t pt-2 mb-6">
//                                 <div className="flex justify-between text-lg">
//                                     <span className="text-[16px]">
//                                         {cartData?.coupon_discount > 0 ? "Grand Total" : "Total"}
//                                     </span>
//                                     <span className="text-[16px] font-semibold">
//                                         ₹
//                                         {cartData?.coupon_discount > 0
//                                             ? cartData?.total_amount?.toFixed(2)
//                                             : cartData?.total_amount?.toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={nextStep}
//                                 disabled={totalItems === 0}
//                                 className="w-full bg-[#b4853e] text-white py-3 mb-4 disabled:opacity-50"
//                             >
//                                 Check Out
//                             </button>
//                             <button className="w-full text-[#b4853e] py-2 flex items-center gap-2 cursor-pointer">
//                                 <ArrowLeft className="w-4 h-4" />
//                                 Continue Shopping
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             );
      

// }

// export default Cart


import { Plus, Minus, ArrowLeft, BadgePercent, ChevronRight } from "lucide-react";

const CartStep = ({
  products,
  totalItems,
  cartData,
  onIncrease,
  onDecrease,
  onRemove,
  onWishlist,
  onCheckout,
  onShowCoupon,
}) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-[23px]">
          Shopping Cart
          <span className="text-[#b4853e] text-[14px] ml-2">
            {totalItems} Items
          </span>
        </h2>

        {products.map((item) => (
          <div key={item.productId} className="border-b pb-4 mb-4">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <img src={item.image} className="w-28 h-36 object-cover" />

                <div>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  <h4>{item.title}</h4>

                  <div className="flex gap-2">
                    <span>₹{item.price}</span>
                    {item.discount > 0 && (
                      <span className="line-through text-gray-400">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex border mt-2">
                    <button onClick={() => onDecrease(item.productId)}>
                      <Minus size={14} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button onClick={() => onIncrease(item.productId)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-xs mt-2 flex gap-3">
                    <button onClick={() => onWishlist(item.productId)}>
                      Move to wishlist
                    </button>
                    <button onClick={() => onRemove(item.productId)} className="text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <span className="font-semibold">
                ₹{item.itemTotal?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white p-6">
        <button onClick={onShowCoupon} className="w-full bg-green-600 text-white py-2">
          Apply Coupon
        </button>

        <div className="border-t mt-4 pt-4 flex justify-between">
          <span>Total</span>
          <span>₹{cartData?.total_amount?.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-[#b4853e] text-white py-3 mt-4"
        >
          Checkout
        </button>

        <button className="text-[#b4853e] mt-3 flex items-center gap-2">
          <ArrowLeft size={16} /> Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartStep;


