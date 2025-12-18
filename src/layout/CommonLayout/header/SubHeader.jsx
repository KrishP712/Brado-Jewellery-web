import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCategory } from '../../../redux/slices/category';
import { useDispatch } from 'react-redux';
const SubHeader = () => {
    const categories = useSelector((state) => state.category.categories);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategory());
    }, [dispatch]);
    return (
        <div className="lg:block hidden w-full bg-white z-50 sticky top-0">
            <nav className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <ul className="flex justify-center items-center space-x-7 pt-2.5 pb-3 px-4">
                        {categories.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={`/category/${item.categorySlug}`}
                                    style={{
                                        wordSpacing: "3.5px",
                                    }}
                                    className="
     relative 
                        text-[#000] text-[15.5px] font-[500] 
                        transition-all duration-300
                        hover:text-[#b4853e]
                        whitespace-nowrap
                        after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2  after:-bottom-[15px] 
                        after:h-[2px] after:w-0 after:bg-[#b4853e]
                        hover:after:w-full
                        after:transition-all after:duration-300
                      "
                                >
                                    {item.categoryName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}



export default SubHeader