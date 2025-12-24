// CartItem component with stock validation
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartData } from '../../../redux/slices/cartSlice'; 
import { Plus, Minus, ChevronRight } from 'lucide-react';
import { addToWishlist } from '../../../redux/slices/wishlistSlice';
import { removeCartData } from '../../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

// Settings/Cog Icon Component
const SettingsCogIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m8.66-15l-3 5.2M9.34 12.8l-3 5.2m12.66 0l-3-5.2M9.34 6.2l-3-5.2" />
  </svg>
);

const CartItem = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const navigate = useNavigate();
  
  const discountPercent = product.discountPrice
    ? ((product.discountPrice - product.price) / product.discountPrice * 100).toFixed(0)
    : 0;

  const itemTotal = product.discountPrice * quantity - product?.itemOfferDiscount;

  // Handle quantity update with stock validation
  const handleQuantityChange = (newQuantity) => {
    // Check if quantity is valid (at least 1)
    if (newQuantity < 1) {
      return;
    }

    // Check if new quantity exceeds available stock
    if (newQuantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setQuantity(newQuantity);
    const payload = {
      productId: product.productId,
      quantity: newQuantity.toString(),
    };
    dispatch(updateCartData(payload));
  };

  const moveWishlist = (productId) => {
    dispatch(addToWishlist(productId));
    dispatch(removeCartData(productId));
  };

  // Check if increment button should be disabled
  const isMaxQuantity = quantity >= product.stock;
  const isMinQuantity = quantity <= 1;

  return (
    <div className="border-b border-gray-200 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            onClick={() => navigate(`/showProduct/${product.slug}`)}
            src={product.image || '/api/placeholder/180/230'}
            alt={product.title}
            className="w-28 h-32 md:w-36 md:h-44 object-cover cursor-pointer"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs md:text-sm mb-1">SKU: {product.sku}</p>
          <h3 className="text-sm md:text-base font-normal mb-2 text-gray-900 leading-snug">{product.title}</h3>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base md:text-lg font-semibold text-gray-900">₹{product?.discountPrice}</span>
            {product?.discountPrice && (
              <>
                <span className="text-gray-500 line-through text-sm">₹{product?.price}</span>
                <span className="text-amber-600 text-xs md:text-sm">({product?.discount}% OFF)</span>
              </>
            )}
          </div>

          {/* Bulk Deal Discount */}
          {product?.itemOfferDiscount && (
            <p className="text-green-600 text-xs md:text-sm font-medium mb-2 md:mb-3">
              Bulk Deal Discount: ₹{product.itemOfferDiscount}
            </p>
          )}

          {product.offerDetails && product.offerDetails.length > 0 && !product.itemOfferDiscount && (
            <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
              {product.offerDetails.map((offer, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 md:gap-2  bg-amber-50 border border-amber-200 rounded-md px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm"
                >
                  <SettingsCogIcon size={12} />
                  <span className="font-medium text-gray-800">{offer.title}</span>
                  <button className="cursor-pointer">
                    <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-700" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Action Links - Show below content on mobile */}
          <div className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span onClick={() => moveWishlist(product.productId)} className="text-gray-700 cursor-pointer">Move to Wishlist</span>
              <span className="text-gray-400">|</span>
              <span onClick={() => dispatch(removeCartData(product.productId))} className="text-red-600 cursor-pointer">Remove</span>
            </div>
          </div>
        </div>

        {/* Right Section - Desktop Only */}
        <div className="hidden md:flex flex-col items-end gap-3 ml-auto flex-shrink-0">
          {/* Action Links */}
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <span onClick={() => moveWishlist(product.productId)} className="text-gray-700 cursor-pointer hover:text-gray-900">Move to Wishlist</span>
            <span className="text-gray-400">|</span>
            <span onClick={() => dispatch(removeCartData(product.productId))} className="text-red-600 cursor-pointer hover:text-red-700">Remove</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isMinQuantity}
              className={`w-9 h-9 flex items-center justify-center text-gray-600 ${
                isMinQuantity ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 h-9 flex items-center justify-center text-base font-medium border-x border-gray-300">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isMaxQuantity}
              className={`w-9 h-9 flex items-center justify-center text-gray-600 ${
                isMaxQuantity ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
              }`}
              title={isMaxQuantity ? 'Maximum stock reached' : 'Increase quantity'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          
          {/* Total Price */}
          <span className="text-lg font-semibold text-gray-900">₹{product?.itemTotal}</span>
        </div>

        {/* Mobile Quantity and Price */}
        <div className="flex md:hidden items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={isMinQuantity}
                className={`w-8 h-8 flex items-center justify-center text-gray-600 ${
                  isMinQuantity ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isMaxQuantity}
                className={`w-8 h-8 flex items-center justify-center text-gray-600 ${
                  isMaxQuantity ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                title={isMaxQuantity ? 'Maximum stock reached' : 'Increase quantity'}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            {isMaxQuantity && (
              <p className="text-xs text-amber-600">Max stock reached</p>
            )}
          </div>
          <span className="text-lg font-semibold text-gray-900">₹{product?.itemTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;