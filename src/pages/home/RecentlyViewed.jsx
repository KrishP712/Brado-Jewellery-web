import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { BadgePercent, Heart } from "lucide-react";
import Cart from "../../assets/icons/Cart";
import LeftArrowIcon from "../../assets/icons/Leftarrow";
import RightArrowIcon from "../../assets/icons/Rightarrow";
import { recently } from "../../constant/constant";

const RecentlyViewed = () => {
    const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateArrows = (swiper) => {
    if (!swiper) return;
    const slidesPerView =
      typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 1;
    const totalSlides = swiper.slides.length;

    setShowArrows(totalSlides > slidesPerView);
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  useEffect(() => {
    if (!swiperRef.current || !prevRef.current || !nextRef.current) return;
    swiperRef.current.params.navigation.prevEl = prevRef.current;
    swiperRef.current.params.navigation.nextEl = nextRef.current;
    swiperRef.current.navigation.init();
    swiperRef.current.navigation.update();
  }, [isDesktop]);
  return (
    <div className="sm:w-[87%] mx-auto py-8 w-[95%]">
    {/* Heading */}
    <div className="text-center mb-8">
      <h2 className="text-18px md:text-[21px] font-medium section-title inline-block relative">
        Recently Viewed
      </h2>
    </div>

    {/* Swiper */}
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateArrows(swiper);
        }}
        onSlideChange={() => updateArrows(swiperRef.current)}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.3 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 2.5 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {recently.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg overflow-hidden relative group hover:transition duration-300">
              <div className="relative">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-300"
                />

                {/* Optional Label */}
                {product.label && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                    {product.label}
                  </span>
                )}

                {/* Heart Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-black/40 rounded-full p-2 shadow hover:scale-110 transition">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Add to Cart */}
                <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-white text-gray-800 px-4 py-2 text-sm rounded-none">
                    <div className="p-2 border border-gray-300 rounded-[1px] flex items-center justify-center gap-2">
                      <Cart className="w-4 h-4 text-gray-600" />
                      <span>Add To Cart</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-800">
                    ₹{product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm line-through text-gray-500">
                      ₹{product.oldPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-sm text-green-600 font-medium">
                      ({product.discount})
                    </span>
                  )}
                </div>

                {/* Optional Marquee */}
                {product.deal && (
                  <div className="w-full overflow-hidden bg-[#f7f2eb] rounded-md px-2 py-1 mt-2">
                    <div className="marquee flex animate-marquee">
                      {[...Array(2)].map((_, i) => (
                        <div className="marquee-content flex" key={i}>
                          {Array(6)
                            .fill(0)
                            .map((_, j) => (
                              <span
                                key={j}
                                className="flex items-center gap-2 mr-10 whitespace-nowrap"
                              >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b87a2c] text-white flex-shrink-0">
                                  <BadgePercent size={12} strokeWidth={2} />
                                </span>
                                <span className="text-xs">{product.deal}</span>
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
          </SwiperSlide>
        ))}

        {/* Conditional Arrows */}
        {isDesktop && showArrows && (
          <>
            <div
              ref={prevRef}
              className={`recent-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer transition-opacity ${
                canSlidePrev ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <LeftArrowIcon />
            </div>
            <div
              ref={nextRef}
              className={`recent-next absolute right-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer transition-opacity ${
                canSlideNext ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <RightArrowIcon />
            </div>
          </>
        )}
      </Swiper>
    </div>

    {/* Marquee Styles */}
    <style>
      {`
        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}
    </style>
  </div>
  )
}

export default RecentlyViewed