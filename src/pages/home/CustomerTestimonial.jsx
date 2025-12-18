import React, { useState, useEffect, useRef } from "react";
import StarRating from "../../assets/icons/StarRating";
import logo from "../../assets/images/testimonial.jpg";
import { useSelector, useDispatch } from "react-redux";
import { getTestimonial } from "../../redux/slices/testimonial";

const CustomerTestimonial = () => {
    const dispatch = useDispatch();

    // Redux Data
    const testimonialState = useSelector((state) => state.testimonial.testimonials);
    const testimonialData = testimonialState?.testimonials || [];


    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState(1);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        dispatch(getTestimonial()); // Fetch reviews from backend
    }, [dispatch]);

    // 🔥 Show only 5-star ratings
    const fiveStarTestimonials = testimonialData.filter((t)=> t.rating === 5);

    // Responsive Slides
    const getVisibleSlides = () => {
        if (typeof window === "undefined") return 1;
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    useEffect(() => {
        const updateSlides = () => {
            setVisibleSlides(getVisibleSlides());
            setCurrentSlide(0);
        };
        updateSlides();
        window.addEventListener("resize", updateSlides);
        return () => window.removeEventListener("resize", updateSlides);
    }, []);

    const needsSlider = visibleSlides < 3;

    // Swipe Handlers
    const handleTouchStart = (e) => {
        if (!needsSlider) return;
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!needsSlider) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!needsSlider || !touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;

        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
    };

    const nextSlide = () => {
        if (!needsSlider) return;
        const maxSlide = fiveStarTestimonials.length - visibleSlides;
        setCurrentSlide((prev) => (prev >= maxSlide ? prev : prev + 1));
    };

    const prevSlide = () => {
        if (!needsSlider) return;
        setCurrentSlide((prev) => (prev <= 0 ? prev : prev - 1));
    };

    return (
        <section
            className="relative py-10 bg-cover bg-center mb-10"
            style={{ backgroundImage: `url(${logo})` }}
        >
            <div className="max-w-[90%] mx-auto relative z-10">

                <h2 className="text-center text-2xl md:text-3xl font-medium text-gray-800 mb-8">
                    Customer Testimonials
                    <div className="w-16 h-0.5 bg-[#b4853e] mx-auto mt-2"></div>
                </h2>

                {fiveStarTestimonials.length === 0 && (
                    <p className="text-center text-gray-700 text-lg py-10">
                        No 5-star reviews yet.
                    </p>
                )}

                {fiveStarTestimonials.length > 0 && (
                    <div className="relative overflow-hidden">

                        <div
                            ref={sliderRef}
                            className={`flex ${needsSlider ? "transition-transform duration-500 ease-in-out" : ""}`}
                            style={
                                needsSlider
                                    ? { transform: `translateX(-${(currentSlide * 100) / visibleSlides}%)` }
                                    : {}
                            }
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {fiveStarTestimonials.map((item) => (
                                <div
                                    key={item._id}
                                    className={`flex-shrink-0 px-2.5 ${
                                        visibleSlides === 1
                                            ? "w-full"
                                            : visibleSlides === 2
                                            ? "w-1/2"
                                            : "w-1/3"
                                    }`}
                                >
                                    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl border-2 border-gray-200 flex flex-col justify-between h-full">
                                        <div className="flex-grow mb-6">
                                            <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed text-justify font-light">
                                                "{item.testimonialText}"
                                            </p>
                                        </div>
                                        <div className="bg-[#e6e6e6] h-[1px] w-full"></div>
                                        <div className="flex flex-col items-center mt-auto pt-5">
                                            <div className="mb-3">
                                                <StarRating rating={item.rating} size={16} />
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-gray-800 font-medium text-sm md:text-base text-center">
                                                    {item.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        {needsSlider && (
                            <>
                                {currentSlide > 0 && (
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg group"
                                    >
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-[#b4853e]" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}

                                {currentSlide < fiveStarTestimonials.length - visibleSlides && (
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg group"
                                    >
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-[#b4853e]" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Mobile swipe hint */}
                {needsSlider && visibleSlides === 1 && (
                    <div className="flex justify-center mt-4">
                        <p className="text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                            👈 Swipe to navigate 👉
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CustomerTestimonial;
