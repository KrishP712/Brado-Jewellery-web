import React from 'react';
import { X, BadgePercent } from 'lucide-react';

const CouponModal = ({
  open,
  onClose,
  couponcode,
  setCouponcode,
  handleApplyCoupon,
  handleSelectCoupon,
  coupon,
  loading
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Save Big Today!</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Redeem your coupon and save big on your order today!
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponcode}
            onChange={(e) => setCouponcode(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => handleApplyCoupon(couponcode)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Apply
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading coupons...</p>
          ) : coupon?.filter((c) => c.isactive)?.length > 0 ? (
            <div className="space-y-3">
              {coupon
                .filter((c) => c.isactive)
                .map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleSelectCoupon(c._id)}
                    className="border border-amber-400 rounded-lg p-3 hover:bg-amber-50 transition-all cursor-pointer"
                  >
                    <p className="font-semibold text-amber-600">{c.code}</p>
                    <p className="text-sm text-gray-600">
                      {c.discountType === "percentage"
                        ? `${c.discountpercentageValue}% OFF`
                        : `${c.discountfixedValue} ₹ OFF`}
                    </p>
                    <p className="text-xs text-gray-400">
                      Min order ₹{c.minorderamount}
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
  );
};

export default CouponModal;
