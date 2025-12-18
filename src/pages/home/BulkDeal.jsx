import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import LeftArrowIcon from '../../assets/icons/Leftarrow';
import RightArrowIcon from '../../assets/icons/Rightarrow';
import { bulkDeal } from '../../constant/constant';
const BulkDeal = () => {
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
        <div className="sm:w-[87%] mx-auto py-8 w-[95%]">
            <div className="text-center mb-8">
                <h2 className="text-18px md:text-[21px] font-medium section-title inline-block relative">
                    BULK DEAL CATEGORY WISE
                </h2>
            </div>

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
                    {bulkDeal.map((src, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={src}
                                alt={`deal-${i}`}
                                className="w-full h-60 sm:h-95 object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows */}
                {!isMobile && (
                    <>
                        <div
                            ref={prevRef}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer transition-opacity ${canSlidePrev ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                        >
                            <LeftArrowIcon />
                        </div>
                        <div
                            ref={nextRef}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer transition-opacity ${canSlideNext ? "opacity-100" : "opacity-0 pointer-events-none"
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

export default BulkDeal