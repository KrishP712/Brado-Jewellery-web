import React from 'react'

const AddressStep = ({ nextStep, prevStep }) => {
    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Delivery Address</h2>
                    {showAddressModal && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg w-[420px] max-h-[90vh] flex flex-col relative">

                                <button
                                    onClick={() => setShowAddressModal(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-6 pb-3 border-b">
                                    <h2 className="text-lg font-semibold">Select Delivery Address</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto px-6 py-4">
                                    {addressData?.length > 0 ? (
                                        <div className="space-y-3">
                                            {addressData.map((item, index) => (
                                                <label
                                                    key={index}
                                                    className={`flex items-start p-4 border rounded-lg cursor-pointer hover:shadow-sm ${selectedAddress?._id === item._id ? "border-[#b4853e]" : "border-gray-200"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="selectedAddress"
                                                        value={index}
                                                        checked={selectedAddress?._id === item._id}
                                                        className="mt-1 mr-3 accent-[#b4853e]"
                                                        onChange={() => setSelectedAddress(item)}
                                                    />
                                                    <div className="flex flex-col text-sm text-gray-700">
                                                        <span className="font-medium text-black">{item.name}</span>
                                                        <span className="text-gray-500">+91 {item.contactno}</span>
                                                        <span className="text-gray-600 mt-1 leading-snug">
                                                            {item.address1}, {item.address2}, {item.landmark}, {item.city}, {item.state} - {item.pincode}, {item.country}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <img src={add} alt="No Address" className="w-24 h-24 mb-4" />
                                            <p className="text-black-600 text-md text-wider">No Address yet!</p>
                                            <p className="text-gray-600 text-sm">You haven't added any address!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {addressData?.length > 0 && (
                                    <div className="border-t p-4 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setShowAddressModal(false);
                                                handleApplyAddress(selectedAddress);
                                            }}
                                            className="bg-[#b4853e] text-white text-sm font-semibold px-5 py-2 rounded hover:bg-[#9a7437]"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            dispatch(getAddressData());
                            setShowAddressModal(true);
                        }}
                        className="text-[#b4853e] px-4 py-2 flex items-center gap-1 text-[14px] cursor-pointer"
                    >
                        <CheckBoxIcon /> Select Address
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
                            <input
                                type="text"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="relative mb-3">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => {
                                handleInputChange(e);
                                if (errors?.email) setErrors({});
                            }}
                            className={`peer w-full border rounded-md py-3 px-3 text-sm focus:outline-none transition-all duration-200 ${errors?.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#b4853e]"
                                }`}
                            placeholder=" "
                        />
                        <label
                            htmlFor="email"
                            className={`absolute outline-none transition-all duration-200 bg-white px-1 pointer-events-none ${formData.email || errors?.email ? "-top-2 left-2 text-xs" : "top-3 left-3 text-sm peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs"
                                } ${errors?.email ? "text-red-500" : formData.email ? "text-[#b4853e]" : "text-gray-500 peer-focus:text-[#b4853e]"
                                }`}
                        >
                            Email Id (Optional)
                        </label>
                        {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2 (Optional)</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                            <input
                                type="text"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Enter State"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="sameAddress"
                            checked={formData.sameAddress}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <span className="text-sm">My delivery and billing addresses are the same.</span>
                    </div>

                    {!formData.sameAddress && (
                        <div className="pt-6 mt-6 border-t">
                            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="billingName"
                                    placeholder="Enter Billing / Legal name"
                                    value={formData.billingName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="billingAddress1"
                                        placeholder="Address line 1"
                                        value={formData.billingAddress1}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingAddress2"
                                        placeholder="Address line 2 (Optional)"
                                        value={formData.billingAddress2}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="billingCity"
                                        placeholder="City"
                                        value={formData.billingCity}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <input
                                        type="text"
                                        name="billingPin"
                                        placeholder="Pin Code"
                                        value={formData.billingPin}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <select
                                        name="billingState"
                                        value={formData.billingState}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="">State</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="addStatutory"
                            checked={formData.addStatutory}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <span className="text-sm">Add statutory information</span>
                    </div>

                    {formData.addStatutory && (
                        <div className="pt-4 mt-4 border-t">
                            <h3 className="text-lg font-semibold mb-4">Statutory Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <input
                                    type="text"
                                    name="gstNo"
                                    placeholder="GST No."
                                    value={formData.gstNo}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg h-fit">
                <h3 className="mb-4">Order Summary <span className='text-[#696661] text-[14px]'>(items {totalItems})</span></h3>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className='text-[#696661] text-[14px]'>Total MRP</span>
                        <span className='text-[14px]'>₹{totals.totalMRP}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span className='text-[#696661] text-[14px]'>Discount</span>
                        <span className='text-[14px]'>-₹{totals.totalDiscount}</span>
                    </div>

                    {cartData?.coupon_discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span className='text-[#696661] text-[14px]'>Coupon Discount ({cart?.coupon?.discountValue})</span>
                            <span className='text-[14px]'>-₹{cartData?.coupon_discount?.toFixed(2)}</span>
                        </div>
                    )}
                    {products.map((item) =>
                        item.itemOfferDiscount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span className='text-[#696661] text-[14px]'>Offer Discount({item.offers.value}%)</span>
                                <span className='text-[14px]'>-₹{item.itemOfferDiscount?.toFixed(2)}</span>
                            </div>
                        ))}
                </div>
                <div className="border-t pt-2 mb-6">
                    <div className="flex justify-between text-lg">
                        <span className='text-[16px]'>
                            {cartData?.coupon_discount > 0 ? 'Grand Total' : 'Total'}
                        </span>
                        <span className='text-[16px] font-semibold'>
                            ₹{cartData?.coupon_discount > 0
                                ? cartData?.total_amount?.toFixed(2)
                                : cartData?.total_amount?.toFixed(2)
                            }
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleNextStep}
                    className="w-full bg-[#b4853e] text-white py-3 mb-4 rounded-lg hover:bg-[#a0753a] transition-colors"
                >
                    Next
                </button>

                <p className="text-xs text-gray-500 mb-4">
                    Note: Shipping & COD Charges will be calculated at the next step if applicable.
                </p>

                <button
                    onClick={prevStep}
                    className="flex items-center text-[#b4853e] cursor-pointer hover:text-[#a0753a] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>
        </div>
    )
}

export default AddressStep