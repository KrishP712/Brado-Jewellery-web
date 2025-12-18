import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ArrowRightIcon from "../../assets/icons/ArrowRightIcon";
import LeftArrowIcon from "../../assets/icons/Leftarrow";
import RightArrowIcon from "../../assets/icons/Rightarrow";
import Cart from "../../assets/icons/Cart";
import { BadgePercent, Heart } from "lucide-react";
import { getAllProducts } from "../../redux/slices/product";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AllProductCard from "../../components/common/AllProductCard";
const Earrings = () => {
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products.products);
    const earringsData = products?.filter((product) => product.categoryName === "Earring");
    useEffect(() => {
        dispatch(getAllProducts());
    }, []);
    const [isDesktop, setIsDesktop] = useState(false);
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(false);
    const [showArrows, setShowArrows] = useState(false);

    // Detect desktop
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Update arrows based on overflow and slider state
    const updateArrows = (swiper) => {
        if (!swiper) return;

        // Determine slidesPerView (number)
        const slidesPerView =
            typeof swiper.params.slidesPerView === "number"
                ? swiper.params.slidesPerView
                : 1;

        const totalSlides = swiper.slides.length;

        setShowArrows(totalSlides > slidesPerView);
        setCanSlidePrev(!swiper.isBeginning);
        setCanSlideNext(!swiper.isEnd);
    };

    const checkOverflow = (swiper) => {
        if (!swiper) return false;
        const slidesPerView = swiper.params.slidesPerView;
        const totalSlides = swiper.slides.length;
        return totalSlides > slidesPerView;
    };
    // Initialize navigation
    useEffect(() => {
        if (!swiperRef.current || !prevRef.current || !nextRef.current) return;
        swiperRef.current.params.navigation.prevEl = prevRef.current;
        swiperRef.current.params.navigation.nextEl = nextRef.current;
        swiperRef.current.navigation.init();
        swiperRef.current.navigation.update();
    }, [isDesktop]);
    return (
        <>
            <div className="w-[87%] mx-auto py-8">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl md:text-[21px] font-medium section-title mb-8">
                            Earring
                        </h2>
                    </div>
                    <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
                        <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
                        <span className="relative">View All</span>
                        <ArrowRightIcon />
                    </button>
                </div>

                <div className="relative">
                    {earringsData && earringsData.length > 0 ? (
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
                            {earringsData.map((product) => {
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
                            No products found
                        </div>
                    )}
                </div>
            </div>

            {/* //    Video Section */}
            <div className="w-full h-[200px] sm:h-[300px] md:h-[600px] lg:h-[450px] pt-5">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://pub-fcbdfa5d08884a7fb45a0457f296badb.r2.dev/video/b/1724486867518.mp4" type="video/mp4" />
                </video>
            </div>


        </>
    )
}

export default Earrings