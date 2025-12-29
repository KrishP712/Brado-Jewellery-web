import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsById } from "../../redux/slices/product";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../redux/slices/wishlist";
import { createCartData } from "../../redux/slices/cart";

import FileIcon from "../../assets/icons/FileIcon";
import CubeIcon from "../../assets/icons/CubeIcon";
import ListIcon from "../../assets/icons/ListIcon";
import MinusIcon from "../../assets/icons/MinusIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import ShieldIcon from "../../assets/icons/ShieldIcon";
import Heart from "../../assets/icons/Heart";
import SettingsCogIcon from "../../assets/icons/SettingsCogIcon";
import StarIcon from "../../assets/icons/StarIcon";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import 'swiper/css/pagination';

// Arrow Component
const Arrow = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Share Network Icon
const ShareNetworkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

// Close Icon
const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Rating Component
const Rating = ({ rating = 0, totalReviews = 0 }) => {
  return (
    <div className="w-[26%] flex items-center gap-1 px-3 mb-5 border border-gray-200 bg-white">
      <span className="text-xs font-medium text-gray-800 py-2">{rating}</span>

      <svg className="w-4 h-4 text-[#b4853e] fill-current" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      <span
        style={{ wordSpacing: '3px' }}
        className="text-gray-600 border-l-[1.5px] py-0.5 border-gray-300 pl-2 text-xs"
      >
        {totalReviews} Reviews
      </span>
    </div>
  );
};

// Special Deal Banner
const SpecialDealBanner = () => {
  return (
    <div className="bg-[#0e854d1a] border border-[#0e854d4d] rounded-lg overflow-hidden max-w-[280px] relative">
      <div className="inline-flex items-center gap-1 text-white text-xs font-medium mb-2 px-3 py-1 pr-6 bg-[#0e854d] relative [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Special Deal
      </div>
      <button className="absolute right-2 top-2 w-6 h-6 bg-[#bbddcd] cursor-pointer rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-[#23905d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="p-2 text-xs">
        <div className="mb-2 flex gap-2 items-center">
          <span className="font-medium text-sm text-[#000]">Get this ₹1</span>
          <span className="text-teal-600 font-medium">(99% OFF)</span>
        </div>
        <p className="text-[#000] font-medium leading-relaxed" style={{ wordSpacing: '3px' }}>
          On orders of 1 items or more, valid only on selected collection.
        </p>
      </div>
    </div>
  );
};


// Social Icon Component
const SocialIcon = ({ type, className }) => {
  const icons = {
    whatsapp: (
      <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z" />
    ),
    facebook: (
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    ),
    pinterest: (
      <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z" />
    ),
    twitter: (
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    ),
    linkedin: (
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    ),
  };

  const views = {
    whatsapp: "0 0 24 24",
    facebook: "0 0 320 512",
    pinterest: "0 0 496 512",
    twitter: "0 0 512 512",
    linkedin: "0 0 448 512",
  };
  if (!type || !icons[type] || !views[type]) {
    return null;
  }

  return (
    <svg className={className} fill="currentColor" viewBox={views[type]} xmlns="http://www.w3.org/2000/svg">
      {icons[type]}
    </svg>
  );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, productUrl }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: "WhatsApp", color: "bg-green-500", icon: <SocialIcon type="whatsapp" className="w-6 h-6" /> },
    { name: "Facebook", color: "bg-blue-600", icon: <SocialIcon type="facebook" className="w-6 h-6" /> },
    { name: "LinkedIn", color: "bg-blue-700", icon: <SocialIcon type="linkedin" className="w-6 h-6" /> },
    { name: "Pinterest", color: "bg-red-600", icon: <SocialIcon type="pinterest" className="w-6 h-6" /> },
    { name: "Twitter", color: "bg-blue-400", icon: <SocialIcon type="twitter" className="w-6 h-6" /> },
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full md:w-[40%] mx-4 rounded-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[16px] text-gray-900">Share</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {shareOptions.map((option, index) => (
            <button key={index} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {option.icon}
              </div>
              <span className="text-xs text-gray-600 text-center">{option.name}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 border border-gray-200">
          <input type="text" value={productUrl} readOnly className="flex-1 px-4 py-3 text-sm" />
          <button
            onClick={copyToClipboard}
            className={`px-7 py-2 font-medium transition-colors text-[12px] rounded-lg ${copied ? 'bg-[#b4853e] text-white' : 'bg-[#b4853e] text-white'
              }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ShowProduct() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Decode slug from URL
  const slug = params.slug ? decodeURIComponent(params.slug).trim() : "";
  const { product, loading, error } = useSelector((state) => state.products);
  const { wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  const productId = product?.[0]?._id;
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    specifications: false,
    refundPolicy: false,
    careInstructions: true,
  });
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 100, y: 100 });

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const OfferBanner = () => {
    return (
      <>
        {product?.[0]?.offers?.length > 0 && (
          <div className="inline-flex my-2 items-center gap-2 bg-orange-50 border border-[#eaddc8] rounded-lg px-3 py-2 text-sm">
            <SettingsCogIcon size={20} />
            <span style={{ wordSpacing: '3px' }} className="font-medium text-gray-800">
              {product[0]?.offers[0]?.title}
            </span>
            <button className="cursor-pointer bg-[#eaddc8] rounded-full p-0.5">
              <svg className="w-4 h-4 text-[#b4853e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };
  useEffect(() => {
    if (slug) {
      dispatch(getProductsById(slug));
    }
    dispatch(getWishlist());
  }, [slug]);

  useEffect(() => {
    const swiper = thumbsSwiperRef.current;

    if (
      swiper &&
      navigationPrevRef.current &&
      navigationNextRef.current &&
      swiper.navigation
    ) {
      swiper.params.navigation = {
        prevEl: navigationPrevRef.current,
        nextEl: navigationNextRef.current,
      };

      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);
  const addToCart = (productId) => {
    dispatch(createCartData(productId));
  };
  const isInWishlist = Array.isArray(wishlist)
    ? wishlist.some((item) =>
      item.products?.some((p) => p._id === productId)
    )
    : false;

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      await dispatch(removeFromWishlist(productId));
      dispatch(getWishlist());
    } else {
      await dispatch(addToWishlist(productId));
      dispatch(getWishlist());
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 2));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    const newLevel = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newLevel);
    if (newLevel === 1) setIsZoomed(false);
  };

  const handleImageClick = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      setZoomLevel(2);
    } else {
      setIsZoomed(false);
      setZoomLevel(1);
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current?.contains(e.target)) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [zoomLevel]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#b4853e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-lg">Failed to load product</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#b4853e] text-white px-8 py-3 rounded-md hover:bg-[#c0924e] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // No product found
  if (!Array.isArray(product) || product.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-lg">Product not found</p>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#b4853e] text-white px-8 py-3 rounded-md hover:bg-[#c0924e] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate price and discount
  const salePrice = product?.[0]?.price || product?.price || 0;
  const originalPrice = product?.[0]?.originalPrice || salePrice;
  const discount = product?.[0]?.discount || (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);
  const total = salePrice * quantity;
  const productImages = product?.[0]?.imagesUrl || (product.image ? [product.image] : []);
  const productUrl = window.location.href;




  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 bg-[#f4f3ef] mb-6 w-full">
        <div className="w-[90%] mx-auto flex items-center py-2">
          <span className="text-gray-400 font-medium cursor-pointer hover:text-gray-600" onClick={() => navigate('/')}>
            Home
          </span>
          <span className="mx-2">
            /
          </span>
          <span className="text-gray-600 font-medium">{product?.[0]?.title || product?.[0]?.name || 'Product'}</span>
        </div>
      </nav>

      <div className="max-w-7xl w-[90%] mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              ref={containerRef}
              className="aspect-square bg-pink-50 rounded-lg overflow-hidden relative group cursor-zoom-in"
              onMouseMove={handleMouseMove}
            >
              <Swiper
                onSwiper={(swiper) => {
                  mainSwiperRef.current = swiper;
                }}
                thumbs={{ swiper: thumbsSwiperRef.current }}
                modules={[Thumbs]}
              >
                {(Array.isArray(productImages[0]) ? productImages[0] : productImages).map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full overflow-hidden flex items-center justify-center">
                      <img
                        ref={imageRef}
                        src={image}
                        alt={product?.name + " - Image " + (index + 1)}
                        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
                        style={{
                          transformOrigin: zoomPosition.x + "%" + zoomPosition.y + "%",
                          cursor: isZoomed ? "zoom-out" : "zoom-in",
                        }}
                        onClick={handleImageClick}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail Swiper */}
            <div className="h-20">
              <Swiper
                onSwiper={(swiper) => {
                  thumbsSwiperRef.current = swiper;
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                modules={[FreeMode, Navigation, Thumbs]}
                freeMode
                watchSlidesProgress
                breakpoints={{
                  320: { slidesPerView: 4 },
                  640: { slidesPerView: 5 },
                  768: { slidesPerView: 6 },
                  1024: { slidesPerView: 7 },
                }}
              >
                {(Array.isArray(productImages[0]) ? productImages[0] : productImages).map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <div className="w-full h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-amber-600 transition-colors">
                      <img src={image} alt={product?.name + " - Image " + (index + 1)} className="w-full h-full object-cover" />
                    </div>
                  </SwiperSlide>
                ))}

                <div
                  ref={navigationPrevRef}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>

                <div
                  ref={navigationNextRef}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Swiper>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">SKU: {product?.[0]?.sku}</p>
              <h1 className="text-2xl font-medium text-gray-900 mb-4">{product?.[0]?.title}</h1>

              <Rating rating={product?.[0]?.averageRating || 0} totalReviews={product?.[0]?.totalReviews || 0} />

              <SpecialDealBanner />

              <OfferBanner />

              {/* Price */}
              <div className="flex items-center gap-3 mb-6 mt-4">
                <span className="text-2xl font-medium text-gray-900">₹{salePrice}</span>
                {originalPrice > salePrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                    <span className="text-sm text-green-600 font-medium">({discount}% OFF)</span>
                  </>
                )}
              </div>

              {/* Quantity and Total */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button onClick={() => handleQuantityChange("increase")} className="p-2 hover:bg-gray-50 transition-colors">
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gray-600 text-sm">Total: </span>
                  <span className="text-xl font-semibold text-gray-900">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6 text-sm">
                <button onClick={() => {
                  addToCart(productId);
                  navigate("/shopping-cart");
                }} className="flex-1 bg-[#b4853e] text-white py-3 px-6 rounded-md font-medium hover:bg-[#c0924e] transition-colors">
                  Add to Cart
                </button>
                <button onClick={() => {
                  addToCart(productId);
                  navigate("/shopping-cart");
                }} className="flex-1 bg-[#504d48] text-white py-3 px-6 rounded-md font-medium hover:bg-[#5a5651] transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex justify-evenly items-center border-y border-gray-300 py-4 text-gray-700">
                <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                  <span className="font-medium text-sm">Enquiry</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`flex items-center gap-2 border-x border-gray-300 px-8 transition-colors ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'hover:text-gray-900'
                    } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} />
                  <span className="font-medium text-sm">
                    {wishlistLoading ? 'Loading...' : isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>
                <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                  <ShareNetworkIcon className="w-5 h-5" />
                  <span className="font-medium text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-[#696661]" /> Product Description
              </h3>
              <p style={{ wordSpacing: '3px' }} className="text-gray-600 leading-relaxed text-sm font-medium">
                {product[0]?.description}
              </p>
            </div>

            {/* Collapsible Sections */}
            {[
              {
                key: "specification",
                title: "Product Specifications",
                icon: ListIcon,
                content: (
                  <div className="space-y-2">
                    {product?.[0]?.specification?.map((spec, index) => (
                      <div key={index} className="flex">
                        <span className="w-1/3 text-sm text-gray-600 capitalize">
                          {spec.key} :
                        </span>
                        <span className="w-2/3 text-sm text-gray-900">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: "refundPolicy",
                title: "Refund and Return Policy",
                icon: CubeIcon,
                content:
                  product?.[0]?.refundPolicy ||
                  "Our return policy allows returns within 30 days of purchase. Items must be in original condition with tags attached. Return shipping costs may apply. Refunds will be processed within 5–7 business days after we receive the returned item.",
              },
              {
                key: "careInstructions",
                title: "Jewellery Care Instructions",
                icon: ShieldIcon,
                content:
                  product?.[0]?.careInstructions ||
                  "Avoid contact with water, perfumes, and cosmetics. Store in zip-lock plastic pouches or butter paper after use. Do not store in jewellery boxes or velvet boxes.",
              },
              {
                key: "reviews",
                title: "Review & Ratings",
                icon: StarIcon,
                content: (
                  <div className="space-y-6">
                    {/* Overall Rating Summary */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          {product?.[0]?.averageRating || 0}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= (product?.[0]?.averageRating || 0)
                                  ? "text-[#b4853e] fill-current"
                                  : "text-gray-300"
                                }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Based on {product?.[0]?.totalReviews || 0} reviews
                        </p>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    {product?.[0]?.reviews?.length > 0 ? (
                      <div className="space-y-6">
                        {product[0].reviews.map((review, index) => (
                          <div key={review._id || index} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                              {/* User Avatar or Initial */}
                              <div className="w-12 h-12 bg-[#b4853e] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                                {review.user?.name?.charAt(0).toUpperCase() || "U"}
                              </div>

                              <div className="flex-1">
                                {/* User Name & Date */}
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {review.user?.name || "Anonymous User"}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                      {review.reviewDate
                                        ? new Date(review.reviewDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })
                                        : "Recently"}
                                    </p>
                                  </div>

                                  {/* Star Rating */}
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating
                                            ? "text-[#b4853e] fill-current"
                                            : "text-gray-300"
                                          }`}
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>

                                {/* Review Title & Comment */}
                                {review.title && (
                                  <h5 className="font-medium text-gray-800 mt-2">{review.title}</h5>
                                )}
                                <p className="text-sm text-gray-600 leading-relaxed mt-1">
                                  {review.comment}
                                </p>

                                {/* Review Images (if any) */}
                                {review.image && review.image.length > 0 && (
                                  <div className="flex gap-2 mt-3">
                                    {review.image.map((img, i) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt={`Review image ${i + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <StarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </div>
                ),
              },
            ].map(({ key, title, icon: Icon, content }) => (
              <div key={key} className="border-t border-gray-200 my-4 pt-4">
                {/* Header Section */}
                <button
                  onClick={() => toggleSection(key)}
                  className="flex items-center justify-between w-full text-left hover:text-gray-700 transition-colors"
                >
                  <h3 className="text-md font-medium text-gray-900 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-[#696661]" /> {title}
                  </h3>
                  {expandedSections[key] ? (
                    <MinusIcon className="w-5 h-5 text-[#696661]" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-[#696661]" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedSections[key] && (
                  <div className="mt-4 animate-fadeIn">
                    {React.isValidElement(content) ? (
                      // ✅ Handles JSX content (like specification)
                      content
                    ) : typeof content === "object" ? (
                      // ✅ Handles key-value objects if any
                      <div className="space-y-3">
                        {Object.entries(content).map(([k, v]) => (
                          <div key={k} className="flex">
                            <span className="w-1/3 text-sm text-gray-600 capitalize">
                              {k
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </span>
                            <span className="w-2/3 text-sm text-gray-900">{v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // ✅ Handles plain text (refund & care)
                      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} productUrl={productUrl} />

      <style>{`
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-in-out; 
        }
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .cursor-zoom-in { 
          cursor: zoom-in; 
        }
        .thumb-swiper .swiper-slide-thumb-active div {
          border-color: #b45309 !important;
          box-shadow: 0 0 6px rgba(180, 83, 9, 0.6);
        }
      `}</style>
    </>
  );
}

