import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Cart from "../../assets/icons/Cart";

import LeftArrowIcon from "../../assets/icons/Leftarrow";
import Heart from "../../assets/icons/Heart";
import RightArrowIcon from "../../assets/icons/Rightarrow";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import { newarrival } from "../../constant/constant";

const NewArrival = () => {
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const updateArrows = (swiper) => {
        setCanSlidePrev(!swiper.isBeginning);
        setCanSlideNext(!swiper.isEnd);
    };
    return (
        <div className="sm:w-[87%] mx-auto py-8 w-[95%]">
            {/* Heading */}
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-15px md:text-[21px] font-medium section-title mb-8">
                        New Arrival
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
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={14}
                    breakpoints={{
                        320: { slidesPerView: 1.5 },
                        480: { slidesPerView: 2.5 },
                        640: { slidesPerView: 3.2 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 4.3 },
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        updateArrows(swiper);
                    }}
                    onSlideChange={() => updateArrows(swiperRef.current)}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                >
                    {newarrival.map((product, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white rounded-lg overflow-hidden relative group hover:transition duration-300">
                                {/* Product Image Wrapper */}
                                <div className="relative">
                                    <img
                                        src={product.img}
                                        alt={product.title}
                                        className="w-full h-64 md:h-80 object-cover transition-transform duration-300"
                                    />

                                    {/* Heart Icon */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white rounded-full p-2 shadow hover:scale-110 transition">
                                            <Heart className="w-5 h-5 text-gray-600" />
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

                                {/* Product Details */}
                                <div className="p-3">
                                    <h3 className="text-sm md:text-base font-medium line-clamp-2 truncate">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm md:text-base font-semibold">₹{product.price}</span>
                                        <span className="text-xs line-through text-gray-400">₹{product.original}</span>
                                        <span className="text-xs md:text-sm text-orange-600">
                                            ({product.discount}% OFF)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Buttons */}
                {!isMobile && (
                    <>
                        <div
                            ref={prevRef}
                            className={`absolute top-1/2 -translate-y-1/2 left-0 z-20 cursor-pointer transition-opacity ${canSlidePrev ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                        >
                            <LeftArrowIcon />
                        </div>
                        <div
                            ref={nextRef}
                            className={`absolute top-1/2 -translate-y-1/2 right-0 z-20 cursor-pointer transition-opacity ${canSlideNext ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                        >
                            <RightArrowIcon />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default NewArrival