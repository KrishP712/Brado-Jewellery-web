import React, { useRef } from 'react'
import img1 from "../../assets/images/hs1.jpeg";
import img2 from "../../assets/images/hs2.jpeg";
import img3 from "../../assets/images/hs3.jpeg";
import img4 from "../../assets/images/hs4.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import LeftArrowIcon from '../../assets/icons/Leftarrow'
import RightArrowIcon from '../../assets/icons/Rightarrow'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCarousel } from "../../redux/slices/carousel";
import { useEffect } from "react";
const HeroSlider = () => {
    const videoRef = useRef(null);
    const swiperRef = useRef(null);
    const dispatch = useDispatch();
    const carousels = useSelector((state) => state.carousel.carousels);
    useEffect(() => {
        dispatch(getCarousel());
    }, [dispatch]);
    return (
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[470px]">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="w-full h-full"
                slidesPerView={1}
                spaceBetween={20}
                loop={true}
                modules={[Navigation, Autoplay]}
                navigation={{
                    prevEl: ".swiper-button-prev-custom",
                    nextEl: ".swiper-button-next-custom",
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => {
                    const realIndex = swiper.realIndex;

                    if (realIndex === 1 && videoRef.current) {
                        swiper.autoplay.stop();
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();

                        videoRef.current.onended = () => {
                            swiper.autoplay.start();
                        };
                    } else if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }}
            >
                {carousels?.carousel?.map((item) => (
                    <SwiperSlide key={item._id}>
                        <img
                            src={item.desktopimage || item.mobileimage}
                            alt={item.slug || "carousel"}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <div className="swiper-button-prev-custom absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/40 hover:bg-white/70 p-2 rounded-full">
                <LeftArrowIcon />
            </div>
            <div className="swiper-button-next-custom absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/40 hover:bg-white/70 p-2 rounded-full">
                <RightArrowIcon />
            </div>
        </div>
    )
}

export default HeroSlider