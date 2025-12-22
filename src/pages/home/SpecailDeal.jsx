import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Discount from "../../assets/icons/Discount";
import CheckBadgeIcon from "../../assets/icons/CheckBadgeIcon";
import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import StarRating from "../../assets/icons/StarRatingcompo";
import ArrowDownIcon from "../../assets/icons/ArrowDownIcon";
import RightArrowIcon from "../../assets/icons/Rightarrow";
import LeftArrowIcon from "../../assets/icons/Leftarrow";
import { specialDeal, returnPolicy } from "../../constant/constant";

const SpecailDeal = () => {
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
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
        <>

            <div className="bg-gradient-to-b from-[#faf5ee] to-[hsla(37,30%,92%,0.21)] ">
                <div className="sm:w-[87%] mx-auto py-8 w-[95%]">
                    {/* Header */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl md:text-[21px] font-medium section-title mb-8">
                                Special Deal
                            </h2>
                            <Discount className="-mt-8" />
                        </div>

                        <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
                            <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
                            <span className="relative">View All</span>
                            <ArrowRightIcon />
                        </button>
                    </div>

                    {/* Subheading */}
                    <p className="text-[13.5px] tracking-wider flex items-center gap-2">
                        On orders of 1 items or more, valid only on selected collection.{" "}
                        <span className="text-[#b87a2c] font-medium cursor-pointer flex items-center gap-1">
                            View collection <ArrowDownIcon className="rotate-180" />
                        </span>
                    </p>

                    {/* Swiper Carousel */}
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
                            className="px-6"
                        >
                            {specialDeal.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <div className="w-full bg-white rounded-2xl mt-6 border border-gray-100 overflow-hidden p-4">
                                        {/* Image */}
                                        <div className="relative w-full aspect-[3/3] mb-4">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                            />
                                        </div>

                                        <div>
                                            {/* Special Deal Badge */}
                                            <div className="inline-flex items-center gap-1 text-white text-xs font-medium mb-2 px-3 py-1 pr-6 bg-green-700 relative [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] rounded-l-md">
                                                <CheckBadgeIcon className="mr-1" />
                                                Special Deal
                                                <span className="absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-transparent border-l-[14px] border-l-green-700 border-b-[14px] border-b-transparent"></span>
                                            </div>

                                            <h3 className="text-gray-800 font-medium text-[14px] truncate">
                                                {item.title}
                                            </h3>
                                            <StarRating rating={item.rating} size={20} />

                                            <div className="mt-2">
                                                <p className="text-black font-semibold">{item.price}</p>
                                                <p className="text-gray-500 text-[13.5px]">
                                                    Current Price:{" "}
                                                    <span className="font-semibold text-black">
                                                        {item.currentPrice}
                                                    </span>
                                                </p>
                                            </div>

                                            <button className="mt-4 w-full bg-[#b87a2c] hover:bg-[#9c6524] text-white text-[13.5px] font-medium py-2 rounded-md">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Buttons (unique per Swiper) */}
                        {!isMobile && (
                            <>
                                <div
                                    ref={prevRef}
                                    className={`absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer transition-opacity ${canSlidePrev ? "opacity-100" : "opacity-0 pointer-events-none"
                                        }`}
                                >
                                    <LeftArrowIcon />
                                </div>
                                <div
                                    ref={nextRef}
                                    className={`absolute top-1/2 -translate-y-1/2 -right-0 z-20 cursor-pointer transition-opacity ${canSlideNext ? "opacity-100" : "opacity-0 pointer-events-none"
                                        }`}
                                >
                                    <RightArrowIcon />
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
            <img src={returnPolicy} alt="returnPolicy" />
        </>
    )
}

export default SpecailDeal