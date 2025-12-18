import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import wish from '../../assets/images/wishlist/wish.png'
import Bright from '../../assets/icons/Bright'
import SettingsCogIcon from '../../assets/icons/SettingsCogIcon'
import { getWishlist, removeFromWishlist } from '../../redux/slices/wishlist'
import { useNavigate } from 'react-router-dom'
import { createCartData } from '../../redux/slices/cart'

const OfferMarquee = ({ offers }) => {

  if (!offers || offers.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-md py-1 mt-2">
      <div className="marquee flex animate-marquee">
        {[...Array(2)].map((_, i) => (
          <div className="marquee-content flex" key={i}>
            {offers.map((offer, j) => (
              <span key={j} className="flex items-center mr-3 gap-3 whitespace-nowrap bg-[#f6f0e8] px-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-white flex-shrink-0">
                  <SettingsCogIcon size={12} strokeWidth={2} />
                </span>
                <span className="text-sm font-medium">{offer}</span>
              </span>
            ))}
            <span className="flex-shrink-0 w-16"></span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .marquee-content { display: flex; align-items: center; white-space: nowrap; flex-shrink: 0; }
        .animate-marquee { display: flex; width: max-content; animation: marquee 20s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

function Wish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistData = useSelector((state) => state?.wishlist?.wishlist || []);

  useEffect(() => {
    dispatch(getWishlist());
  }, []);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      dispatch(createCartData( productId));
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };


  return (
    <div className="space-y-6">
      {wishlistData.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[400px]">
          <img src={wish} alt="Empty Wishlist" className="w-[200px] h-auto" />
          <p className="text-gray-600 mt-4 text-sm">Your wishlist is empty</p>
          <p className='mt-3'>Explore more and shortlist some items.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#b4853e] text-white px-8 py-3 rounded-md cursor-pointer mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center border-b border-gray-200 pb-[10px]">
            <h2 className="text-[22px] text-gray-900">My Wishlist</h2>
            <span className="text-sm ml-[10px] text-[#b4853e]">
              {wishlistData.length} items
            </span>
          </div>

          {wishlistData.map((item) => (
            console.log(item),
            <div
              key={item._id}
              className="border-b border-gray-300 pb-[15px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-25 h-30 object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-[#696661] text-[12px]">SKU: {item.sku}</p>
                    </div>

                    <h4 className="text-[14px] mt-1">{item.name}</h4>

                    <div className="flex items-center space-x-2 mt-1 flex-wrap">
                      <span className="text-[14px]">₹{item.price}</span>
                      <span className="text-gray-600 line-through text-[14px]">₹{item.originalPrice}</span>
                      <span className="text-[#b4853e] text-[12px]">({item.discount}% OFF)</span>
                    </div>

                    {item.offer && item.offer.length > 0 && (
                      <div className="mt-2 w-[200px] overflow-hidden">
                        <OfferMarquee offers={item.offer} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="items-center space-x-5 md:flex hidden">
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="bg-[#b4853e] text-white px-2 py-2 text-[12px]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className='md:hidden w-full border-y py-1 justify-around border-gray-300 text-[#696661] text-[14px] flex'>
                <button onClick={() => handleRemove(item.productId)}>Remove</button>
                <span className='text-[#696661]'>|</span>
                <button onClick={() => handleAddToCart(item)}>Add To Cart</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Wish;