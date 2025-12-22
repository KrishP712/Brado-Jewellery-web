import React, { useState } from 'react'
import SearchIcon from '../../../assets/icons/SearchIcon';
import HeartIcon from '../../../assets/icons/Heart';
import CartIcon from '../../../assets/icons/Cart';
import UserIcon from '../../../assets/icons/UserIcon';
import logo from '../../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import SignIn from '../../../pages/auth/signIn/SignIn';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { getCartData } from '../../../redux/slices/cart';
import { getWishlist } from '../../../redux/slices/wishlist';
import { useEffect } from 'react';
import { searchProducts } from '../../../redux/slices/product';
import { getCategory } from '../../../redux/slices/category';
function Header() {
  const [query, setQuery] = useState("");
  const searchResults = useSelector((state) => state?.products?.searchResults);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isform, setIsForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cart = useSelector((state) => state?.cart?.cart);
  const categories = useSelector((state) => state.category.categories);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = Cookies.get("usertoken");
  const user = useSelector((state) => state?.auth?.user);

  const userlogout = () => {
    dispatch(logout(navigate));
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    dispatch(getWishlist());
  }, []);
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);


  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }


    dispatch(searchProducts(value));
  };

  const toggleMobileSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setQuery("");
      setResults([]);
    }
  };

  const openSignInModal = () => {
    setIsForm(true);
    setIsMenuOpen(false);
  };

  const closeSignInModal = () => {
    setIsForm(false);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (!token) return setIsForm(true);
    setShowUserMenu(!showUserMenu);
    window.onclick = () => setShowUserMenu(false);
  };

  const handlewishClick = () => {
    if (!token) {
      setIsForm(true);
    } else {
      navigate("/wishlist");
    }
  };

  useEffect(() => {
    dispatch(getCartData());
  }, [dispatch]);

  // Calculate total quantity of items in the cart
  const totalCartItems = cart[0]?.products?.reduce((total, item) => total + item.quantity, 0);
  return (
    <>
        {/* Top Bar */}
        <div className="bg-[#544f49] text-white text-[10px] sm:text-[12px] tracking-wider text-center py-1 sm:py-2">
          <span className="hidden sm:inline">Free shipping on orders of 6 items or more</span>
          <span className="sm:hidden">Free shipping 6+ items</span>
        </div>

      <header className="w-full sticky top-0 z-[500]">
        {/* Main Header */}
        <div className="w-full bg-white border-b border-gray-200 ">
          <div className="mx-auto flex items-center justify-between py-2 px-3 lg:px-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
              <span className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12 sm:h-16 md:h-18 hidden lg:block lg:h-19 w-auto" onClick={() => navigate("/")} />
              <img src={logo} alt="Logo" className="h-12 sm:h-12 md:h-12 lg:hidden w-auto" onClick={() => navigate("/")} />
            </div>

            {/* Desktop Search + Icons */}
            <div className="hidden lg:flex w items-center space-x-3 relative">
              <div className="relative w-full lg:min-w-123">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search for products"
                  className="w-full border border-gray-200 rounded-sm pl-5 pr-10 py-2 text-sm focus:outline-none transition-colors"
                />
                <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#000] transition-colors">
                  <SearchIcon className="w-5 h-5" />
                </button>
                {query && (
                  <div className="absolute top-11 left-0 w-full bg-white border rounded-md shadow-lg z-[1000000] max-h-80 overflow-y-auto">

                    {searchResults.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm z-[10000]">No product found.</div>
                    ) : (
                      searchResults.map((item) => (
                        <div
                          key={item.slug}
                          onClick={() => {
                            navigate(`/product/${item.slug}`);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-50 z-[1000000]"
                        >
                          <img
                            src={item.imagesUrl?.[0]}
                            alt="img"
                            className="w-10 h-10 rounded object-cover"
                          />

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800 line-clamp-1">
                              {item.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.categoryName}
                            </span>
                          </div>
                        </div>
                      ))
                    )}

                  </div>
                )}

              </div>

              {/* Icons */}
              <div className="flex items-center space-x-2 lg:-space-x-[2px] relative">
                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handlewishClick}>
                  <HeartIcon className="h-5 w-5 lg:h-6 lg:w-6 text-[#000]" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full relative" onClick={() => {
                  handlewishClick();
                  navigate("/shopping-cart");
                }}>
                  <CartIcon className="h-4 w-4 lg:h-5 lg:w-5 text-[#000]" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#b4893e]  text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handleUserClick}>
                  <UserIcon className="h-5 w-5 lg:h-6 lg:w-6 text-[#000]" />
                </button>
                {showUserMenu && token && (
                  <div className="absolute top-10 right-0 w-56 bg-white border border-gray-200 shadow-lg z-99">
                    <ul className="py-2">
                      <li
                        onClick={() => {
                          navigate("/profile");
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Profile
                      </li>

                      <li
                        onClick={() => {
                          navigate("/orders");
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Orders
                      </li>

                      <li
                        onClick={() => {
                          navigate("/wishlist");
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Wishlist
                      </li>

                      <li
                        onClick={() => {
                          navigate("/address-book");
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Address Book
                      </li>

                      <li
                        onClick={() => {
                          navigate("/wallet");
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Wallet
                      </li>

                      <li
                        onClick={() => {
                          userlogout();
                          setShowUserMenu(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex lg:hidden items-center space-x-[5px]">
              <button onClick={toggleMobileSearch} className="p-1">
                <SearchIcon className="h-5 w-5 text-[#000]" />
              </button>
              <button className="p-1" onClick={handlewishClick}>
                <HeartIcon className="h-5 w-5 text-[#000]" />
              </button>
              <button className="p-1 relative" onClick={() => {
                handlewishClick();
                navigate("/shopping-cart");
              }}>
                <CartIcon className="h-4 w-4 text-[#000]" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b4893e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className={`fixed inset-0 bg-black/40 lg:hidden z-40 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)}></div>

          <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-[#b4893e] rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg text-black-900">{token ? "Account" : "Guest"}</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto px-2 py-6">
              <nav className="space-y-1">

                {token && (
                  <>
                    {categories?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          navigate(`/category/${item.categorySlug}`);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-black text-base font-medium border-b border-gray-100 hover:bg-gray-50"
                      >
                        {item.categoryName}
                      </button>
                    ))}
                  </>
                )}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={() => {
                    if (token) {
                      userlogout();        
                    } else {
                      openSignInModal();   
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-[#b4893e] text-white py-3 rounded-md font-medium hover:bg-[#c19b26] transition-colors"
                >
                  {token ? "Logout" : "Login / Sign Up"}
                </button>
              </div>
            </div>

            {!token && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <button onClick={openSignInModal} className="w-full bg-[#b4893e] text-white py-3 px-4 rounded-md font-medium hover:bg-[#c19b26] transition-colors">
                  Login / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      {isform && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={closeSignInModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <SignIn open={true} onClose={closeSignInModal} />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;