import React, { useState } from 'react'
import logo from '../../../assets/images/logo.png'
import FacebookIcon from '../../../assets/icons/FacebookIcon';
import InstagramIcon from '../../../assets/icons/InstagramIcon';
import YouTubeIcon from '../../../assets/icons/YouTubeIcon';
import PhoneIcon from '../../../assets/icons/PhoneIcon';
import MailIcon from '../../../assets/icons/MailIcon';
import LocationIcon from '../../../assets/icons/LocationIcon';
import visa from "../../../assets/images/footer/ames.jpg";
import paypal from "../../../assets/images/footer/paypal.jpg";
import rupay from "../../../assets/images/footer/rupay.jpg";
import ios from "../../../assets/images/footer/ios.png";
import android from "../../../assets/images/footer/android.png";
import dscover from "../../../assets/images/footer/dscover.jpg";
import ames from "../../../assets/images/footer/ames.jpg";
const Footer = () => {

  const [email, setEmail] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribe email:", email);
    setEmail("");
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  return (
    <footer className="bg-[#f4f3ef] py-6 px-4 pb-0">
      <div className="max-w-7xl w-[90%] mx-auto">

        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Newsletter Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src={logo}
                alt="Brado Jewellery Logo"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-lg font-medium text-gray-800">
                Brado Jewellery
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-6">
              <a
                href="#"
                className="text-gray-600 hover:text-[#b4853e] transition-colors"
              >
                <FacebookIcon size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#b4853e] transition-colors"
              >
                <InstagramIcon size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-[#b4853e] transition-colors"
              >
                <YouTubeIcon size={24} />
              </a>
            </div>

            <p className="text-gray-600 text-sm text-center mb-6 px-4">
              Don't miss any updates or promotions by signing up to our newsletter.
            </p>

            <div className="flex gap-2 px-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border bg-white border-gray-300 rounded-sm focus:outline-none focus:border-[#b4853e] text-sm"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#b4853e] px-4 py-3 rounded-sm transition-colors hover:bg-[#a0783a]"
              >
                <span className="text-white">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-1">
            {/* Privacy Policy */}
            <div className="border-t border-gray-300">
              <button
                onClick={() => toggleSection('privacy')}
                className="w-full flex items-center justify-between py-4 px-4 text-left"
              >
                <span className="text-gray-700 font-medium">Privacy Policy</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'privacy' ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {expandedSection === 'privacy' && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm">Privacy policy content...</p>
                </div>
              )}
            </div>

            {/* Refund Policy */}
            <div className="border-t border-gray-300">
              <button
                onClick={() => toggleSection('refund')}
                className="w-full flex items-center justify-between py-4 px-4 text-left"
              >
                <span className="text-gray-700 font-medium">Refund Policy</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'refund' ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Terms of Usage */}
            <div className="border-t border-gray-300">
              <button
                onClick={() => toggleSection('terms')}
                className="w-full flex items-center justify-between py-4 px-4 text-left"
              >
                <span className="text-gray-700 font-medium">Terms of Usage</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'terms' ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Shipping Policy */}
            <div className="border-t border-gray-300">
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between py-4 px-4 text-left"
              >
                <span className="text-gray-700 font-medium">Shipping Policy</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'shipping' ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Sitemap */}
            <div className="border-t border-gray-300">
              <button
                onClick={() => toggleSection('sitemap')}
                className="w-full flex items-center justify-between py-4 px-4 text-left"
              >
                <span className="text-gray-700 font-medium">Sitemap</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'sitemap' ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 space-y-4 px-4">
            <div className="flex items-start gap-3">
              <PhoneIcon size={18} className="text-gray-600 mt-1 flex-shrink-0" />
              <span className="text-gray-600">+91 9016905077</span>
            </div>
            <div className="flex items-start gap-3">
              <MailIcon size={18} className="text-gray-600 mt-1 flex-shrink-0" />
              <span className="text-gray-600">care@bradojewellery.com</span>
            </div>
            <div className="flex items-start gap-3">
              <LocationIcon size={18} className="text-gray-600 mt-1 flex-shrink-0" />
              <span className="text-gray-600 leading-relaxed">
                301, 3rd Floor Ganesh Bhuvan Apartment, Main Road Varachha,
                Surat - 395006, Gujarat, India
              </span>
            </div>
          </div>

          {/* App Download */}
          <div className="mt-8 flex justify-center gap-4">
            <img
              src={ios}
              alt="Download on the App Store"
              className="h-8 sm:h-9 md:h-12 max-w-full object-contain"
            />
            <img
              src={android}
              alt="Get it on Google Play"
              className="h-8 sm:h-9 md:h-12 max-w-full object-contain"
            />
          </div>

          {/* Payment Methods */}
          <div className="mt-8 flex justify-center gap-3">
            <img src={visa} alt="Visa" className="h-8 w-auto" />
            <img src={ames} alt="American Express" className="h-8 w-auto" />
            <img src={dscover} alt="Discover" className="h-8 w-auto" />
            <img src={rupay} alt="RuPay" className="h-8 w-auto" />
            <img src={paypal} alt="PayPal" className="h-8 w-auto" />
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-400 text-center">
            <p className="text-gray-600 text-sm">
              © Brado Jewellery | All rights reserved
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex gap-16 mb-8">
            {/* Newsletter Section */}
            <div className="">
              <div className="flex items-center gap-2 ms-1 mb-4">
                <img
                  src={logo}
                  alt="Brado Jewellery Logo"
                  className="w-10 h-10 object-cover"
                />
                <span className="ml-3 text-[15px] font-[450]">
                  Brado Jewellery
                </span>
              </div>
              <p style={{ wordSpacing: "3px" }} className="text-gray-600 text-[12px] tracking-wide mb-4 font-medium">
                Don't miss any updates or promotions by signing up to our
                newsletter.
              </p>
              <div className="flex w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-2.5 border bg-[#f8f8f6] border-gray-200 placeholder:text-[12px] rounded-sm focus:outline-none text-sm"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-[#b4853e] ml-2 transform rotate-180 px-3 py-2.5 rounded-sm transition-colors"
                >
                  <span className="text-white text-[13px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex px-10">
              <div className="w-1/3">
                <h3 style={{ wordSpacing: "5px" }} className="text-gray-800 font-medium text-[13px] mb-4">
                  Our Policies
                </h3>
                <ul className="space-y-[4px]">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Refund Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Terms of Usage
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Shipping Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="w-1/3">
                <h3 style={{ wordSpacing: "5px" }} className="text-gray-800 font-medium text-[13px] mb-4">
                  Useful Links
                </h3>
                <ul className="space-y-[4px]">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-800 text-[13px] font-[450] transition-colors"
                    >
                      Sitemap
                    </a>
                  </li>
                </ul>
                <div className="mt-6">
                  <h4 style={{ wordSpacing: "3px" }} className="text-gray-800 font-medium text-[13.5px] mb-4">
                    Keep In Touch
                  </h4>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-[#696661] border border-gray-200 rounded-full p-[2.5px] transition-colors"
                    >
                      <FacebookIcon size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-[#696661] border border-gray-200 rounded-full p-[2.5px] transition-colors"
                    >
                      <InstagramIcon size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-[#696661] border border-gray-200 rounded-full p-[2.5px] transition-colors"
                    >
                      <YouTubeIcon size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-1/3">
                <h3 style={{ wordSpacing: "5px" }} className="text-gray-800 font-medium text-[13px] mb-4">
                  Contact Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-[13px] font-[450]">
                    <PhoneIcon
                      size={16}
                      className="text-gray-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600 text-[13px]">+91 9016905077</span>
                  </div>
                  <div className="flex items-start gap-2 text-[13px] font-[450]">
                    <MailIcon
                      size={16}
                      className="text-gray-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600 text-[13px]">
                      care@bradojewellery.com
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-[13px] font-[450]">
                    <LocationIcon
                      size={16}
                      className="text-gray-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-600 text-[13px] leading-relaxed">
                      301, 3rd Floor Ganesh Bhuvan Apartment, Main Road Varachha,
                      Surat - 395006, Gujarat, India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#e6e6e6] py-7 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
              <div className="flex items-center gap-4">
                <img src={visa} alt="Visa" className="h-.5 w-auto" />
                <img src={ames} alt="American Express" className="h-.5 w-auto" />
                <img src={dscover} alt="Discover" className="h-.5 w-auto" />
                <img src={rupay} alt="RuPay" className="h-.5 w-auto" />
                <img src={paypal} alt="PayPal" className="h-.5 w-auto" />
              </div>

              <div className="text-center">
                <p
                  style={{ wordSpacing: "3px" }}
                  className="text-gray-600 text-[12px] font-[450] "
                >
                  © Brado Jewellery | All rights reserved
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={ios}
                  alt="Download on the App Store"
                  className="h-9.5 w-auto"
                />
                <img
                  src={android}
                  alt="Get it on Google Play"
                  className="h-9.5 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default Footer;
