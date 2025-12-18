import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { traditional } from '../../constant/constant';

const TraditionalImages = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='sm:w-[87%] mx-auto py-8 w-[95%]'>
            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="text-18px md:text-[21px] font-medium section-title inline-block relative">
                    Traditional Jewellery
                </h2>
            </div>

            {/* Grid or Mobile Slider */}
            {isMobile ? (
                <Swiper spaceBetween={16} slidesPerView={1.5}>
                    {traditional.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="overflow-hidden shadow-md hover:shadow-lg transition">
                                <img
                                    src={item}
                                    alt={`product-${index}`}
                                    className="w-full h-[350px] object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
                    {traditional.map((item, index) => (
                        <div
                            key={index}
                            className="overflow-hidden shadow-md hover:shadow-lg transition"
                        >
                            <img
                                src={item}
                                alt={`product-${index}`}
                                className="w-full h-[365px] object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TraditionalImages