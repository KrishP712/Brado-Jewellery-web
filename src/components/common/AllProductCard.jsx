import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cart from "../../assets/icons/Cart";
import StarRating from '../../assets/icons/StarRating';
import CheckBadgeIcon from "../../assets/icons/CheckBadgeIcon";
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlist';
import { BadgePercent, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createCartData } from '../../redux/slices/cart';

const AllProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const wishlistItems = useSelector((state) => state.wishlist.wishlist);
    const addToCart = (id) => {
        dispatch(createCartData(id));
    }

    useEffect(() => {
        const wishlistProducts = Array.isArray(wishlistItems)
            ? wishlistItems
            : Array.isArray(wishlistItems?.product)
                ? wishlistItems.product
                : [];

        const isProductInWishlist = wishlistProducts.some(
            (p) => String(p._id) === String(product._id)
        );

        setIsInWishlist(isProductInWishlist);
    }, [wishlistItems, product._id]);



    const offerColors = {
        "New Launch": "bg-[#533d99]",
        "Special Deal": "bg-[#198754]",
    };
    const offerText =
        Array.isArray(product.offers) && product.offers.length > 0
            ? product.offers[0].title
            : null;
    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product._id)).unwrap();
                setIsInWishlist(false);
            } else {
                await dispatch(addToWishlist(product._id)).unwrap();
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error("Wishlist error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleProductClick = (slug) => {
        navigate(`/product/${slug}`);
    };

    return (
        <div className="bg-white overflow-hidden relative group hover:transition duration-300">
            <div className="relative cursor-pointer" >
                <img
                    onClick={() => handleProductClick(product.slug)}
                    src={product.imagesUrl[0]}
                    alt={product.title}
                    className="w-full object-cover rounded-lg transition-transform duration-300 h-64 md:h-76"
                />


                {product.offer && (
                    <div className="absolute top-3 left-3">
                        <span className={`text-white px-2 py-1 flex items-center gap-1 rounded-md text-xs font-medium ${product.special == true ? "bg-[#198754]" : "bg-[#00000000]"} `}>
                            {product.special === "Special Deal" && <CheckBadgeIcon size={16} />}
                            {product.special ? "Special Deal" : <></>}
                        </span>
                    </div>
                )}


                <div className={`absolute top-3 right-3 transition-opacity duration-300 ${isInWishlist ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <button
                        onClick={handleWishlistToggle}
                        disabled={isLoading}
                        className={`rounded-full p-2 shadow cursor-pointer transition ${isInWishlist ? 'bg-white' : 'bg-black/40'
                            }`}
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${isInWishlist ? "text-red-500 fill-red-500" : "text-gray-200"
                                }`}
                        />

                    </button>
                </div>


                <div onClick={(e) => { e.stopPropagation(); addToCart(product._id) }} className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white text-gray-800 px-4 py-2 text-sm rounded-none">
                        <div className="p-2 border border-gray-300 rounded-[1px] flex items-center justify-center gap-2">
                            <Cart className="w-4 h-4 text-gray-600" />
                            <span>Add To Cart</span>
                        </div>
                    </button>
                </div>
            </div>


            <div className="p-3">
                <h3 className="text-sm md:text-base font-medium line-clamp-2 cursor-pointer truncate" onClick={() => handleProductClick(product._id)}>
                    {product.title}
                </h3>
                {product.averageRating > 0 && (
                    <StarRating rating={product.averageRating} size={16} />
                )}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm md:text-base font-semibold">
                        ₹{product.price}
                    </span>
                    <span className="text-xs line-through text-gray-400">
                        ₹{product.originalPrice}
                    </span>
                    <span className="text-xs md:text-sm text-orange-600">
                        ({product.discount}% OFF)
                    </span>
                </div>
                {offerText && (
                    <div className="w-full overflow-hidden bg-[#f7f2eb] rounded-md px-2 py-1 mt-2">
                        <div className="marquee flex animate-marquee hover:[animation-play-state:paused]">
                            {[...Array(2)].map((_, i) => (
                                <div className="marquee-content flex" key={i}>
                                    {[...Array(3)].map((_, j) => (
                                        <span
                                            key={j}
                                            className="flex items-center gap-2 mr-10 whitespace-nowrap"
                                        >
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b87a2c] text-white flex-shrink-0">
                                                <BadgePercent size={12} strokeWidth={2} />
                                            </span>
                                            <span className="text-xs font-medium">
                                                {offerText}
                                            </span>
                                        </span>
                                    ))}
                                    <span className="flex-shrink-0 w-16"></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProductCard;