import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getorderbyorderidData } from '../../redux/slices/order';

const Shipment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderbyid, loading, error } = useSelector((state) => state.order);
    const orderData = orderbyid?.orders;
    useEffect(() => {
        if (orderId) dispatch(getorderbyorderidData(orderId));
    }, [orderId, dispatch]);

    const orders = Array.isArray(orderData) ? orderData[0] : orderData;
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );
    }

        if (!orders) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">No order found</div>
            </div>
        );
    }

    const getCurrentStatus = () => {
        const completed = orders?.statusTimeline?.filter((s) => s.status === 'completed');
        const last = completed?.[completed.length - 1];
        return last?.title || 'Pending';
    };

    const currentStatus = getCurrentStatus();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800';
            case 'Packed':
            case 'Order Confirmed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Order Placed':
                return 'bg-gray-100 text-gray-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-6">
                <ArrowLeft
                    className="w-5 h-5 cursor-pointer hover:text-gray-600"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-xl lg:text-2xl font-medium">
                    Order Number <span className="text-[#b4853e]">#{orders.orderId}</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-gray-700 text-sm lg:text-base">
                                Shipment #{orders.orderId}
                            </span>
                            <span
                                className={`px-3 py-1 rounded text-xs lg:text-sm font-medium ${getStatusColor(
                                    currentStatus
                                )}`}
                            >
                                {currentStatus}
                            </span>
                        </div>
                    </div>

                    {orders.items?.map((product, index) => (
                        <div key={index} className="bg-white border rounded-lg p-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/150'}
                                        alt={product.title}
                                        className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs lg:text-sm text-gray-500 mb-1">
                                                SKU: {product.sku}
                                            </p>
                                            <h3 className="font-medium text-sm lg:text-base text-gray-800 mb-2 line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                                                <span className="text-base lg:text-lg font-semibold text-gray-900">
                                                    ₹{product.price}
                                                </span>
                                                <p className="text-xs lg:text-sm text-gray-600">
                                                    Qty: {product.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-base lg:text-lg font-semibold text-gray-900">
                                                ₹{product.price * product.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4 lg:p-6">
                        <h2 className="text-base lg:text-lg font-semibold mb-4">Address</h2>

                        {orders.shippingAddress && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                                <p className="text-sm lg:text-base text-gray-800 font-medium">
                                    {orders.shippingAddress.contactPersonName}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                    {orders.shippingAddress.address}
                                    {orders.shippingAddress.address2}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600">
                                    {orders.shippingAddress.city}, {orders.shippingAddress.state} -{' '}
                                    {orders.shippingAddress.pincode}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                    Mobile No: {orders.shippingAddress.contactNo}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border rounded-lg p-4 w-full max-w-xs shadow-sm">
                        <h2 className="text-sm font-semibold mb-3 text-gray-800">Order Summary</h2>

                        <div className="space-y-2 mb-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Created</span>
                                <span className="text-gray-800">{new Date(orders.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Total MRP</span>
                                <span className="text-gray-800">₹{orders.subtotal}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600">-₹{orders.couponDiscount || orders.discount}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping Charge</span>
                                <span className="text-gray-800">₹{orders.shippingFee}</span>
                            </div>

                            {orders.paymentMethod === "COD" && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">COD Charge</span>
                                    <span className="text-gray-800">₹55</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-2 mt-2 flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-800">Total</span>
                            <span className="text-base font-bold text-gray-900">₹{orders.totalAmount}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Shipment;
