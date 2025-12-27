import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
// Convert string → slug (helper function)

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

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
  const toSlug = (text) => text?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const slug = toSlug(categoryName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const productState = useSelector((state) => state?.products?.products);
  const products = productState?.products || [];
  const availableFilters = productState?.availableFilters || [];
  const priceRangeData = productState?.priceRange;
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 0]);
  const debouncedPriceRange = useDebounce(selectedPriceRange, 500);
  const totalPages = productState?.totalPages || 1;
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("Latest");
  const [isDragging, setIsDragging] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const sliderRef = useRef(null);
  const debounceTimer = useRef(null);
  const initialPriceRef = useRef(null);
  const categoryMaxRef = useRef(null);
  const wishlistItems = useSelector((state) => state.wishlist.wishlist);

  const addToCart = (id) => {
    dispatch(createCartData(id));
  }

  const offerColors = {
    "New Launch": "bg-[#533d99]",
    "Special Deal": "bg-[#198754]",
    "Extra 10% Off": "bg-[#d3ac0a]",
    "Extra 15% Off": "bg-[#8db600]",
  };

  const handlePageChange = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // set price ONLY ONCE per category
    if (priceRangeData?.max && !initialPriceRef.current) {
      initialPriceRef.current = priceRangeData.max;
      setPriceRange([0, priceRangeData.max]);
    }
  }, [priceRangeData]);

  useEffect(() => {
    if (
      priceRangeData?.max &&
      !categoryMaxRef.current
    ) {
      categoryMaxRef.current = priceRangeData.max;
      setPriceRange([0, priceRangeData.max]);
    }
  }, [priceRangeData]);

  useEffect(() => {
    initialPriceRef.current = null;
  }, [categoryName]);

  useEffect(() => {
    categoryMaxRef.current = null;
  }, [categoryName]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const query = {
        page,
        limit: 12,
        category: categoryName,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        ...Object.keys(selectedFilters).reduce((acc, f) => {
          if (selectedFilters[f]?.length > 0) {
            acc[f.toLowerCase().replace(/ /g, "")] = selectedFilters[f].join(",");
          }
          return acc;
        }, {})
      };
      dispatch(getAllProducts(query));
    }, 300);
  }, [page, categoryName, sortBy, priceRange, selectedFilters]);


  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const getPercentage = (value) =>
    categoryMaxRef.current
      ? (value / categoryMaxRef.current) * 100
      : 0;

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging === null || !sliderRef.current || !initialPriceRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.min(
        Math.max(0, (e.clientX - rect.left) / rect.width),
        1
      );
      const newValue = Math.round(
        percentage * categoryMaxRef.current
      );

      setPriceRange((prev) => {
        const next = [...prev];
        next[isDragging] = newValue;

        if (isDragging === 0 && newValue > prev[1]) next[1] = newValue;
        if (isDragging === 1 && newValue < prev[0]) next[0] = newValue;

        return next;
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);

    // Fetch products AFTER finishing dragging
    dispatch(getAllProducts({
      page,
      limit: 12,
      category: categoryName,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      ...Object.keys(selectedFilters).reduce((acc, f) => {
        acc[f.toLowerCase().replace(/ /g, "")] = selectedFilters[f]?.join(",") || "";
        return acc;
      }, {})
    }));
  }, [page, categoryName, priceRange, sortBy, selectedFilters]);

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

  const handleFilterToggle = (filterName, optionName) => {
    setSelectedFilters((prev) => {
      const current = prev[filterName] || [];
      return {
        ...prev,
        [filterName]: current.includes(optionName)
          ? current.filter((opt) => opt !== optionName)
          : [...current, optionName],
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setPriceRange([priceRangeData.min, priceRangeData.max]);
  };

  const filteredProducts = products;

  return (
    <>
      {/* Hero Banner */}
      <div className="flex justify-center mb-6">
        <img src={main} alt="Category main" className="rounded-lg shadow-md max-h-96 object-contain" />
      </div>

      {/* Swiper */}
      <div className="w-[91%] relative mx-auto mt-8">
        <Swiper
          className="earrings-swiper"
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 1.3 },
            640: { slidesPerView: 2.35 },
          }}
        >
          {[main, main, main, main].map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows */}
        {!isBeginning && (
          <div
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        )}

        {!isEnd && (
          <div
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/70 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="w-full max-w-6xl mx-auto flex justify-center gap-4 py-10">

        <div className="hidden md:block w-52 bg-white border-r border-gray-200 p-6 pt-0 pl-0 sticky top-10 h-screen overflow-y-auto">

          <div className="mb-4 sticky top-0 bg-white z-10 pt-4">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>


          <h3 className="text-base font-medium text-gray-900 mb-4">Price</h3>
          <div className="py-2">
            <div className="relative px-2">
              <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-lg cursor-pointer">
                <div
                  className="absolute h-2 bg-amber-600 rounded-lg"
                  style={{
                    left: `${getPercentage(priceRange[0])}%`,
                    right: `${100 - getPercentage(priceRange[1])}%`,
                  }}
                />

                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2.5 h-5 bg-white border border-amber-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      left: `${getPercentage(priceRange[i])}%`,
                      top: "50%",
                    }}
                    onMouseDown={handleMouseDown(i)}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-700">
                  ₹{priceRange[0].toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  ₹{priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>


          {availableFilters?.length > 0 ? (
            availableFilters.map((filter) => (
              <div key={filter.filterId} className="mb-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  {filter.filterName}
                </h3>

                <div className="space-y-3">
                  {filter.options.map((opt) => (
                    <label key={opt.optionId} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2 accent-amber-600"
                        checked={
                          selectedFilters[filter.filterName]?.includes(opt.optionName) ||
                          false
                        }
                        onChange={() =>
                          handleFilterToggle(filter.filterName, opt.optionName)
                        }
                      />
                      <span className="text-sm text-gray-700">{opt.optionName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No filters available.</p>
          )}


          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>



        <div className="w-[90%]">
          <div className="flex justify-between w-full items-center mb-6 px-6 py-4 bg-white">
            <h1 className="text-3xl font-medium text-gray-900">
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} ({filteredProducts.length} products)
            </h1>
          </div>

          {filteredProducts.length == 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img
                src={noProduct}
                alt="No Product"
                className="w-48 h-48 mb-6 opacity-80"
              />

              <h2 className="text-xl font-semibold text-gray-800">No Product Found!</h2>
              <p className="text-gray-500 mt-2">
                No products found for your search. Please try another search!
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-2 bg-[#b88a52] text-white rounded-md hover:bg-[#a17845] transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {filteredProducts.map((product, index) => {
                const wishlistArray = Array.isArray(wishlistItems)
                  ? wishlistItems
                  : wishlistItems?.product || [];

                const isInWishlist = wishlistArray.some(
                  (item) => String(item._id) === String(product._id)
                );

                // WISHLIST TOGGLE
                const handleWishlistToggle = (e) => {
                  e.stopPropagation();
                  if (isInWishlist) {
                    dispatch(removeFromWishlist(product._id));
                  } else {
                    dispatch(addToWishlist(product._id));
                  }
                };
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="cursor-pointer"
                  >
                    <div className="bg-white overflow-hidden relative group hover:transition duration-300">
                      <div className="relative">
                        <img
                          src={product.imagesUrl?.[0]}
                          alt={product.title}
                          className="w-full h-64 md:h-76 object-cover rounded-lg transition-transform duration-300"
                        />
                        <div className={`absolute top-3 right-3 transition-opacity duration-300 ${isInWishlist ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                          <button
                            onClick={handleWishlistToggle}
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
                        {product.special && (
                          <div className="absolute top-3 left-3">
                            <span
                              className={`text-white px-2 py-1 flex items-center gap-1 rounded-md text-xs font-medium ${offerColors["Special Deal"]
                                }`}
                            >
                              <Heart size={12} /> Special Deal
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="text-sm md:text-base font-medium line-clamp-2 truncate">
                          {product.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm md:text-base font-semibold">₹{product.price}</span>
                          <span className="text-xs line-through text-gray-400">
                            ₹{product.originalPrice}
                          </span>
                          <span className="text-xs md:text-sm text-orange-600">
                            ({product.discount}% OFF)
                          </span>
                        </div>

                        {product.offers?.length > 0 && (
                          <OfferBadge text={product.offers[0]?.title} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          )}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 bg-black/40">
              <div className="absolute bottom-0 w-full bg-white rounded-t-xl p-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowMobileFilter(false)}>✕</button>
                </div>

                {availableFilters.map((filter) => (
                  <div key={filter.filterId} className="mb-6">
                    <h3 className="font-medium mb-2">{filter.filterName}</h3>
                    {filter.options.map((opt) => (
                      <label key={opt.optionId} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={
                            selectedFilters[filter.filterName]?.includes(opt.optionName) || false
                          }
                          onChange={() =>
                            handleFilterToggle(filter.filterName, opt.optionName)
                          }
                        />
                        {opt.optionName}
                      </label>
                    ))}
                  </div>
                ))}

                <div className="flex gap-3 border-t pt-4">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 border py-2 rounded-md"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="flex-1 bg-[#b4853e] text-white py-2 rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>


      </div>
    </>
  );
};

export default Category;
