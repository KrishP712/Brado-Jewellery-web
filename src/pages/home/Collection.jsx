
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCollection } from "../../redux/slices/collection";
import { useNavigate } from "react-router-dom";
const Collection = () => {
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const collections = useSelector((state) => state.collection.collections);
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCollection());
    }, [dispatch]);
    const updateArrows = (swiper) => {
        if (!swiper) return;
        setCanSlidePrev(!swiper.isBeginning);
        setCanSlideNext(!swiper.isEnd);

        if (swiper.navigation) {
            swiper.navigation.update();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            if (swiperRef.current) updateArrows(swiperRef.current);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div className="bg-gradient-to-b from-white to-[#faf8f4] py-12">
                <div className="sm:w-[87%] mx-auto py-8 w-[95%]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-[22px] font-medium section-title inline-block relative">
                            Discover Our Collections
                        </h2>
                    </div>

                    {/* Swiper Slider */}
                    <div className="relative">
                        <Swiper
                            modules={[Navigation]}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                updateArrows(swiper);
                            }}
                            onSlideChange={(swiper) => updateArrows(swiper)}
                            observer={true}
                            observeParents={true}
                            navigation={{
                                prevEl: ".collection-prev",
                                nextEl: ".collection-next",
                            }}
                            spaceBetween={20}
                            slidesPerView={2}
                            breakpoints={{
                                480: { slidesPerView: 3.5 },
                                640: { slidesPerView: 4 },
                                768: { slidesPerView: 5 },
                                1024: { slidesPerView: 6.2 },
                            }}
                            className="collections-swiper"
                        >
                            {collections.map((item, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="flex flex-col items-center group"
                                    onClick={() => navigate(`/category/${item.categorySlug}`)}
                                >
                                    <div className="relative mb-4 cursor-pointer">
                                        <div className="rounded-full overflow-hidden shadow-lg">
                                            <img
                                                src={item?.icons?.media}
                                                alt={item.categoryName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-center font-medium text-gray-700 text-sm md:text-base px-2">
                                        {item.categoryName}
                                    </p>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Left arrow */}
                        <div
                            className={`collection-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-opacity ${isMobile
                                ? "hidden"
                                : canSlidePrev
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                                }`}
                            aria-hidden={isMobile || !canSlidePrev}
                        >
                            <Leftarrow />
                        </div>

                        {/* Right arrow */}
                        <div
                            className={`collection-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-opacity ${isMobile
                                ? "hidden"
                                : canSlideNext
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                                }`}
                            aria-hidden={isMobile || !canSlideNext}
                        >
                            <Rightarrow />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Collection