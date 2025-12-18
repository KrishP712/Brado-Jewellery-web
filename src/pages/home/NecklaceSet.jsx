import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import { BadgePercent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../redux/slices/product";
import AllProductCard from "../../components/common/AllProductCard";

function NecklaceSet() {
  const swiperRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(false);
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products); 
  const necklaceData = products?.products?.filter((product) => product.categoryName === "Necklace");
  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateArrows = (swiper) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const checkOverflow = (swiper) => {
    if (!swiper) return false;
    const slidesPerView = swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;
    return totalSlides > slidesPerView;
  };

  return (
    <>
      <div className="w-[87%] mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-[21px] font-medium section-title mb-8">
              Necklace set
            </h2>
          </div>
          <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
            <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
            <span className="relative">View All</span>
            <ArrowRightIcon />
          </button>
        </div>

        {/* Swiper */}
        <div className="relative">
          {necklaceData && necklaceData.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateArrows(swiper);
              }}
              onSlideChange={() => updateArrows(swiperRef.current)}
              navigation={
                isDesktop && checkOverflow(swiperRef.current)
                  ? {
                    prevEl: ".swiper-button-prev-custom",
                    nextEl: ".swiper-button-next-custom",
                  }
                  : false
              }
              spaceBetween={16}
              breakpoints={{
                320: { slidesPerView: 1.5 },
                480: { slidesPerView: 2.5 },
                640: { slidesPerView: 3.2 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
            >
              {necklaceData.map((product) => {
                // Safely normalize the offer field
                return (
                  <SwiperSlide key={product._id}>
                    <div className="space-y-2">
                      <AllProductCard product={product} />
                    </div>
                  </SwiperSlide>
                );
              })}

              {/* Arrows */}
              {isDesktop && canSlidePrev && (
                <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                  <Leftarrow />
                </div>
              )}
              {isDesktop && canSlideNext && (
                <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                  <Rightarrow />
                </div>
              )}
            </Swiper>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Loading products...
            </div>
          )}
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full h-[200px] sm:h-[300px] md:h-[600px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://pub-fcbdfa5d08884a7fb45a0457f296badb.r2.dev/video/b/1724486867518.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </>
  );
}

export default NecklaceSet;
