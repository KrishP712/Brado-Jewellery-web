// src/pages/Category.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import main from "../../assets/images/earring/earringMain.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts } from "../../redux/slices/product";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import OfferBadge from "../../layout/CommonLayout/OfferBadge";
import { Heart } from "lucide-react";
import { createCartData } from "../../redux/slices/cart";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlist";
import Cart from "../../assets/icons/Cart";
import { useDispatch, useSelector } from "react-redux";
import noProduct from "../../assets/images/no-product.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (showEllipsisStart) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (showEllipsisEnd) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-12 h-12 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400"
        style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }}
      >
        <ChevronLeft className="w-5 h-5" style={{ color: '#6B7280' }} />
      </button>
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <div className="flex items-center justify-center w-12 h-12 text-gray-500">...</div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all font-medium ${currentPage === page ? 'text-white shadow-md' : 'hover:border-gray-400'
                }`}
              style={{
                borderColor: currentPage === page ? '#b4853e' : '#D1D5DB',
                backgroundColor: currentPage === page ? '#b4853e' : '#FFFFFF',
                color: currentPage === page ? '#FFFFFF' : '#374151',
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400"
        style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }}
      >
        <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} />
      </button>
    </div>
  );
};

const Category = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("Latest");
  const [isDragging, setIsDragging] = useState(null);

  const productState = useSelector((state) => state?.products?.products);
  const products = productState?.products || [];
  const availableFilters = productState?.availableFilters || [];
  const priceRangeData = productState?.priceRange || { min: 0, max: 10000 };
  const totalPages = productState?.totalPages || 1;

  const [priceRange, setPriceRange] = useState([0, 10000]);

  const sliderRef = useRef(null);

  const wishlistItems = useSelector((state) => state.wishlist.wishlist || []);

  // Initialize price range when category data loads
  useEffect(() => {
    if (priceRangeData?.min !== undefined && priceRangeData?.max !== undefined) {
      setPriceRange([priceRangeData.min, priceRangeData.max]);
    }
  }, [priceRangeData.min, priceRangeData.max]);

  // Fetch products whenever filters/page change
  useEffect(() => {
    const query = {
      page,
      limit: 12,
      category: categoryName,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      ...Object.keys(selectedFilters).reduce((acc, key) => {
        if (selectedFilters[key]?.length > 0) {
          acc[key.toLowerCase().replace(/\s+/g, "")] = selectedFilters[key].join(",");
        }
        return acc;
      }, {})
    };
    dispatch(getAllProducts(query));
  }, [page, categoryName, priceRange, sortBy, selectedFilters, dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (id) => {
    dispatch(createCartData(id));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => String(item._id) === String(productId));
  };

  const handleWishlistToggle = (e, productId) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };

  const handleFilterToggle = (filterName, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterName] || [];
      if (current.includes(value)) {
        return { ...prev, [filterName]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [filterName]: [...current, value] };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setPriceRange([priceRangeData.min || 0, priceRangeData.max || 10000]);
  };

  // Price slider logic
  const getPercentage = (value) => {
    const total = priceRangeData.max - priceRangeData.min;
    if (total === 0) return 0;
    return ((value - priceRangeData.min) / total) * 100;
  };

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging === null || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const totalRange = priceRangeData.max - priceRangeData.min;
    const newValue = Math.round(priceRangeData.min + percentage * totalRange);

    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[isDragging] = newValue;

      // Ensure min <= max
      if (isDragging === 0 && newValue > prev[1]) newRange[1] = newValue;
      if (isDragging === 1 && newValue < prev[0]) newRange[0] = newValue;

      return newRange.sort((a, b) => a - b);
    });
  }, [isDragging, priceRangeData]);

  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      setIsDragging(null);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Hero Banner */}
      <div className="flex justify-center mb-6">
        <img src={main} alt="Category Banner" className="rounded-lg shadow-md max-h-96 object-contain w-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-10 px-4">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-white border border-gray-200 rounded-lg p-6 sticky top-20 h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>

          {/* Price Filter */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-900 mb-4">Price</h3>
            <div className="relative px-2">
              <div ref={sliderRef} className="relative h-1 bg-gray-300 rounded-full cursor-pointer">
                {/* Filled track */}
                <div
                  className="absolute h-1 bg-[#b4853e] rounded-full"
                  style={{
                    left: `${getPercentage(priceRange[0])}%`,
                    width: `${getPercentage(priceRange[1]) - getPercentage(priceRange[0])}%`,
                  }}
                />

                {/* Left Thumb */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-[#b4853e] rounded-full shadow-md -top-2 cursor-grab active:cursor-grabbing"
                  style={{ left: `${getPercentage(priceRange[0])}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleMouseDown(0)}
                />

                {/* Right Thumb */}
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-[#b4853e] rounded-full shadow-md -top-2 cursor-grab active:cursor-grabbing"
                  style={{ left: `${getPercentage(priceRange[1])}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleMouseDown(1)}
                />
              </div>

              <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Other Filters */}
          {availableFilters?.length > 0 ? (
            availableFilters.map((filter) => (
              <div key={filter.filterId} className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">{filter.filterName}</h3>
                <div className="space-y-3">
                  {filter.options.map((opt) => (
                    <label key={opt.optionId} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#b4853e] accent-[#b4853e] rounded focus:ring-[#b4853e]"
                        checked={selectedFilters[filter.filterName]?.includes(opt.optionName) || false}
                        onChange={() => handleFilterToggle(filter.filterName, opt.optionName)}
                      />
                      <span className="ml-3 text-sm text-gray-700">{opt.optionName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No filters available.</p>
          )}

          {/* Clear Button */}
          <button
            onClick={clearAllFilters}
            className="w-full mt-6 py-2.5 px-4 bg-orange-50 text-orange-600 font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
          >
            Clear All Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-medium text-gray-900">
              {categoryName} ({products.length} products)
            </h1>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              Filters
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <img src={noProduct} alt="No products" className="w-48 h-48 mx-auto mb-6 opacity-70" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search for something else.</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-[#b4853e] text-white rounded-md hover:bg-[#9a7437]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const isWishlisted = isInWishlist(product._id);

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.imagesUrl?.[0] || noProduct}
                        alt={product.title}
                        className="w-full h-64 object-cover"
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product._id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={isWishlisted ? "#ef4444" : "none"}
                          stroke={isWishlisted ? "#ef4444" : "#666"}
                        />
                      </button>

                      {/* Add to Cart on Hover */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                          }}
                          className="w-full py-3 text-sm font-medium border-t border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                          <Cart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                            <span className="text-sm text-green-600">({product.discount}% OFF)</span>
                          </>
                        )}
                      </div>
                      {product.offers?.length > 0 && <OfferBadge text={product.offers[0].title} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowMobileFilter(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={() => setShowMobileFilter(false)} className="text-2xl">×</button>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Price</h3>
              <div className="px-2">
                <div ref={sliderRef} className="relative h-1 bg-gray-300 rounded-full">
                  <div
                    className="absolute h-1 bg-[#b4853e] rounded-full"
                    style={{
                      left: `${getPercentage(priceRange[0])}%`,
                      width: `${getPercentage(priceRange[1]) - getPercentage(priceRange[0])}%`,
                    }}
                  />
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-[#b4853e] rounded-full -top-2"
                    style={{ left: `${getPercentage(priceRange[0])}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown(0)}
                  />
                  <div
                    className="absolute w-5 h-5 bg-white border-2 border-[#b4853e] rounded-full -top-2"
                    style={{ left: `${getPercentage(priceRange[1])}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown(1)}
                  />
                </div>
                <div className="flex justify-between mt-4 text-sm font-medium">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Other Filters */}
            {availableFilters.map((filter) => (
              <div key={filter.filterId} className="mb-6">
                <h3 className="font-medium mb-3">{filter.filterName}</h3>
                <div className="space-y-2">
                  {filter.options.map((opt) => (
                    <label key={opt.optionId} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#b4853e] accent-[#b4853e] rounded"
                        checked={selectedFilters[filter.filterName]?.includes(opt.optionName) || false}
                        onChange={() => handleFilterToggle(filter.filterName, opt.optionName)}
                      />
                      <span className="ml-3 text-sm">{opt.optionName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-8">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="flex-1 py-3 bg-[#b4853e] text-white rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;