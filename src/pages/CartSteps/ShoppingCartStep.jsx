
import React from 'react';
import {
  Plus, Minus, ArrowLeft, ChevronRight, BadgePercent
} from 'lucide-react';

const ShoppingCartStep = ({
  cartData,
  products,
  status,
  dispatch,
  navigate,
  nextStep,
  setShowCouponModal,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleRemoveProduct,
  handleAddToWishlist = () => { }
}) => {
  const totalItems = products.length;

  const calculateTotals = () => {
    let totalMRP = 0, totalDiscount = 0, totalPrice = 0;
    products.forEach((item) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const original = item.originalPrice || price;
      totalMRP += original * qty;
      totalPrice += price * qty;
    });
    totalDiscount = totalMRP - totalPrice;
    return { totalMRP: totalMRP.toFixed(2), totalDiscount: totalDiscount.toFixed(2), totalPrice: totalPrice.toFixed(2) };
  };

  const totals = calculateTotals();

  if (status === "loading") return <div className="text-center py-10">Loading cart...</div>;

  if (!products.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button className="bg-[#b4853e] text-white px-6 py-3 rounded" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 w-[90%] mx-auto">
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-[23px]">
          Shopping Cart <span className="text-[#b4853e] text-[14px] ml-[10px]">{totalItems} Items</span>
        </h2>

        {products.map((item) => (
          console.log(item),
          <div key={item.productId || item._id} className="border-b border-gray-300 pb-[15px] mb-4 relative">
            <div className="absolute top-2 right-2 md:flex space-x-2 hidden">
              <div className="text-[13px] text-gray-900 cursor-pointer" onClick={() => handleAddToWishlist(item.productId)}>
                Move to wishlist
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="text-[13px] text-red-800 cursor-pointer" onClick={() => handleRemoveProduct(item.productId)}>
                Remove
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <img src={item.image} alt={item.title} className="w-27 h-35 object-cover" />
                <div className="flex-1">
                  <p className="text-[#696661] text-[12px]">SKU: {item.sku}</p>
                  <h4 className="text-[14px]">{item.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[14px]">₹{item.price}</span>
                    {item.discount > 0 && (
                      <>
                        <span className="text-gray-600 line-through text-[14px]">₹{item.originalPrice}</span>
                        <span className="text-[#b4853e] text-[12px]">({item.discount}% OFF)</span>
                      </>
                    )}
                  </div>
                  {item.stock < 10 && <p className="text-[12px] text-red-600 mt-1">Only {item.stock} left!</p>}

                  {item.itemOfferDiscount > 0 && (
                    <p className="text-green-600 text-xs md:text-sm font-medium mb-2 md:mb-3">
                      Bulk Deal Discount: ₹{item.itemOfferDiscount}
                    </p>
                  )}

                  {item.offers?.length > 0 && !item.itemOfferDiscount && (
                    <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
                      {item.offers.map((offer, index) => {
                        // Hide inactive offers
                        if (!offer.active) return null;

                        return (
                          <div
                            key={index}
                            className="inline-flex items-center gap-1.5 md:gap-2 bg-amber-50 border border-amber-200 rounded-md px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm"
                          >
                            <BadgePercent className="w-3 h-3 md:w-4 md:h-4 text-amber-700" />
                            <span className="font-medium text-gray-800">
                              {offer.title}
                            </span>
                            <ChevronRight
                              className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-700"
                              strokeWidth={2.5}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex border border-gray-200 p-[2px] rounded">
                    <button onClick={() => handleDecreaseQuantity(item.productId)} disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-4 mt-1">{item.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item.productId)} disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <span className="ml-4 text-lg font-bold">₹{item.itemTotal?.toFixed(2)}</span>
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
          <button onClick={() => setShowCouponModal(true)}
            className="px-3 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 text-[14px]">
            Apply
          </button>
        </div>

        <div className="pt-4">
          <h3 className="mb-4 text-[16px]">Order Summary <span className="text-[#696661] text-[14px]">(items {totalItems})</span></h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span className="text-[#696661] text-[14px]">Total MRP</span><span>₹{cartData?.total_mrp_amount || totals.totalMRP}</span></div>
            <div className="flex justify-between text-green-600"><span className="text-[#696661] text-[14px]">Discount</span><span>-₹{cartData?.total_sale_discount || totals.totalDiscount}</span></div>
            {cartData?.coupon_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-[#696661] text-[14px]">Coupon Discount</span>
                <span>-₹{cartData.coupon_discount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="border-t pt-2 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-[16px]">{cartData?.coupon_discount > 0 ? "Grand Total" : "Total"}</span>
              <span className="text-[16px] font-semibold">₹{cartData?.total_amount?.toFixed(2) || totals.totalPrice}</span>
            </div>
          </div>
          <button onClick={nextStep} className="w-full bg-[#b4853e] text-white py-3 mb-4">Check Out</button>
          <button onClick={() => navigate("/")} className="w-full text-[#b4853e] py-2 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartStep;