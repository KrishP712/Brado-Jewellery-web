import React, { useEffect, useRef, useState } from "react";
import add from "../../assets/images/wishlist/address.png";
import { useDispatch, useSelector } from "react-redux";
import { getAddressData, removeAddressData, updateAddressData, createAddressData } from "../../redux/slices/address";

export default function AddressManager() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focus, setFocus] = useState({});
  const [values, setValues] = useState({});
  const [openId, setOpenId] = useState(null); // Track which dropdown is open
  const dropdownRefs = useRef({}); // Store refs for each dropdown

  const { address, status } = useSelector((state) => state.address.address);

  const addressData = address?.address;
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openId !== null) {
        const dropdownEl = dropdownRefs.current[openId];
        if (dropdownEl && !dropdownEl.contains(event.target)) {
          setOpenId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openId]);

  useEffect(() => {
    dispatch(getAddressData());
  }, [dispatch]);

  // Helper function to check if input is focused or has value
  const isFocused = (field, value) => focus[field] || value;

  // Handle input changes
  const handleInputChange = (field, value) => {
    setValues({ ...values, [field]: value });
  };

  // Reset form data when modal closes
  const closeModal = () => {
    setIsModalOpen(false);
    setValues({});
    setFocus({});
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (values._id) {
      // Update
      dispatch(updateAddressData({addressId: values._id, addressData: values})).then(() => {
        dispatch(getAddressData());
        closeModal();
      });
    } else {
      // Create
      dispatch(createAddressData(values)).then(() => {
        dispatch(getAddressData());
        closeModal();
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* If no addresses → Empty State */}
      {addressData?.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow">
          <div className="mb-6">
            <div className="mx-auto w-40 h-30 flex items-center justify-center mb-4">
              <img src={add} alt="No Address" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Address yet!</h3>
            <p className="text-gray-500">You haven't added any address!</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#b4853e] text-white px-8 py-3 rounded-md cursor-pointer"
          >
            Add New Address
          </button>
        </div>
      ) : (
        // If addresses exist → Show address list
        <div className="space-y-4">
          <div className="flex justify-between align-top">
            <h2>Addresses Book</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#b4853e] px-6 py-2 rounded-md"
            >
              + Add New Address
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {addressData?.map((addr) => (
              <div
                key={addr._id}
                className="bg-white p-3 border border-gray-200 relative sm:w-[48%]"
              >
                {/* 3-dot menu */}
                <div
                  className="absolute top-3 right-3"
                  ref={(el) => (dropdownRefs.current[addr._id] = el)}
                >
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // important!
                        setOpenId(openId === addr._id ? null : addr._id);
                      }}
                      className="p-1 rounded-full"
                    >
                      ⋮
                    </button>


                    {/* Dropdown menu */}
                    {openId === addr._id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white shadow-md rounded-md border border-gray-200 z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true); // open modal
                            setOpenId(null);
                            setValues(addr);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeAddressData(addr._id)).then(() => {
                              dispatch(getAddressData());
                            });
                            setOpenId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* Address details */}
                <h3 className="text-gray-800 mb-[5px]">{addr.name}</h3>
                <p className="text-sm text-gray-600 mb-[5px]">{addr.contactno}</p>
                <p className="text-sm text-gray-600 mb-[5px]">{addr.email}</p>
                <p className="text-sm text-gray-700 mb-[5px]">
                  {addr.address1}, {addr.address2 && `${addr.address2}, `}
                  {addr.landmark && `${addr.landmark}, `}
                  {addr.city} - {addr.pincode}, {addr.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-5 relative my-8 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg mb-2">Add New Address</h2>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("name", values.name) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={values.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setFocus({ ...focus, name: true })}
                  onBlur={() => setFocus({ ...focus, name: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Contact */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("contactno", values.contactno) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Contact No.
                </label>
                <input
                  type="text"
                  value={values.contactno || ""}
                  onChange={(e) => handleInputChange("contactno", e.target.value)}
                  onFocus={() => setFocus({ ...focus, contactno: true })}
                  onBlur={() => setFocus({ ...focus, contactno: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Email */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("email", values.email) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={values.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocus({ ...focus, email: true })}
                  onBlur={() => setFocus({ ...focus, email: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Address Line 1 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("address1", values.address1) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={values.address1 || ""}
                  onChange={(e) => handleInputChange("address1", e.target.value)}
                  onFocus={() => setFocus({ ...focus, address1: true })}
                  onBlur={() => setFocus({ ...focus, address1: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Address Line 2 */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("address2", values.address2) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={values.address2 || ""}
                  onChange={(e) => handleInputChange("address2", e.target.value)}
                  onFocus={() => setFocus({ ...focus, address2: true })}
                  onBlur={() => setFocus({ ...focus, address2: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Landmark */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("landmark", values.landmark) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={values.landmark || ""}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                  onFocus={() => setFocus({ ...focus, landmark: true })}
                  onBlur={() => setFocus({ ...focus, landmark: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* City */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("city", values.city) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  City
                </label>
                <input
                  type="text"
                  value={values.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  onFocus={() => setFocus({ ...focus, city: true })}
                  onBlur={() => setFocus({ ...focus, city: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* Pin Code */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
            ${isFocused("pincode", values.pincode) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  value={values.pincode || ""}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  onFocus={() => setFocus({ ...focus, pincode: true })}
                  onBlur={() => setFocus({ ...focus, pincode: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px]"
                />
              </div>

              {/* State */}
              <div className="relative w-full">
                <label
                  className={`absolute left-3 transition-all duration-200
      ${isFocused("state", values.state) ? "text-[12px] -top-2 text-[#b4853e] bg-white px-1" : "text-[13px] top-3 text-gray-400"} pointer-events-none`}
                >
                  State
                </label>
                <select
                  value={values.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  onFocus={() => setFocus({ ...focus, state: true })}
                  onBlur={() => setFocus({ ...focus, state: false })}
                  className="w-full px-3 pt-3 pb-2 border border-gray-300 rounded-md focus:outline-none text-[13px] bg-white appearance-none"
                >
                  <option value="" disabled hidden>
                    State
                  </option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#b4853e] text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}