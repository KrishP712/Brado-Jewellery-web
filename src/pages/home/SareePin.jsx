import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AllProductCard from "../../components/common/AllProductCard";
import Leftarrow from "../../assets/icons/Leftarrow";
import Rightarrow from "../../assets/icons/Rightarrow";
import { ArrowRightIcon } from "lucide-react";
import { getAllProducts } from "../../redux/slices/product";
const SareePin = () => {
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products.products);
    const sareePinData = products?.filter((product) => product.categoryName === "Saree Pin");
    const [isDesktop, setIsDesktop] = useState(false);
    const [canSlidePrev, setCanSlidePrev] = useState(false);
    const [canSlideNext, setCanSlideNext] = useState(false);
    const [showArrows, setShowArrows] = useState(false);

    useEffect(() => {
        dispatch(getAllProducts());
    }, []);
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
    const checkOverflow = (swiper) => {
        if (!swiper) return false;
        const slidesPerView = swiper.params.slidesPerView;
        const totalSlides = swiper.slides.length;
        return totalSlides > slidesPerView;
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-18px md:text-[21px] font-medium section-title">Saree Pin</h2>
                <button className="relative flex items-center gap-2 text-[#b87a2c] font-medium text-sm cursor-pointer">
                    <span className="absolute -left-3 w-10 h-10 bg-[#e6d4bd] rounded-full opacity-40"></span>
                    <span className="relative">View All</span>
                    <ArrowRightIcon />
                </button>
            </div>

            {/* Swiper */}
            <div className="relative">
                {sareePinData && sareePinData.length > 0 ? (
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
                        {sareePinData.map((product) => {
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
    )
}

export default SareePin