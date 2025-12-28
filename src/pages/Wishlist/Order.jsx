import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderData,
  updateOrderData,
} from "../../redux/slices/order";
import { createReviewData } from "../../redux/slices/review";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Order() {
  const dispatch = useDispatch();
  const order = useSelector((state) => state?.order?.order);
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null); // For Timeline Modal

  // REVIEW STATES
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // CANCEL CONFIRMATION STATE
  const [cancelConfirmOrderId, setCancelConfirmOrderId] = useState(null);

  useEffect(() => {
    dispatch(getOrderData());
  }, [dispatch]);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = selectedOrder !== null || showReviewModal || cancelConfirmOrderId !== null;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrder, showReviewModal, cancelConfirmOrderId]);

  // STATUS COLORS
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800";
      case "Packed":
      case "Order Confirmed":
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Order Placed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
      case "Returned and Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // CANCEL BUTTON CONDITION
  const canCancel = (status) => {
    return !["Delivered", "Cancelled", "Returned and Refunded", "Out for Delivery"].includes(status);
  };

  // CANCEL ORDER WITH CONFIRMATION & SHOW TIMELINE AFTER
  const handleCancelOrder = (orderId) => {
    setCancelConfirmOrderId(orderId); // Show confirmation
  };

  const confirmCancel = () => {
    if (!cancelConfirmOrderId) return;

    dispatch(updateOrderData({ orderId: cancelConfirmOrderId, status: "Cancelled" }))
      .unwrap()
      .then((updatedOrder) => {
        dispatch(getOrderData()); // Refresh orders
        // Find the updated order and open timeline
        const canceledOrder = order.find((o) => o.orderId === cancelConfirmOrderId);
        if (canceledOrder) {
          setSelectedOrder(canceledOrder);
        }
        setCancelConfirmOrderId(null);
      })
      .catch((err) => {
        console.error("Failed to cancel order:", err);
        setCancelConfirmOrderId(null);
      });
  };

  // REVIEW SUBMIT
  const handleReviewSubmit = () => {
    dispatch(
      createReviewData({
        productId: selectedReview.productId,
        orderId: selectedReview.orderId,
        rating,
        title,
        comment: description,
      })
    )
      .unwrap()
      .then(() => {
        setShowReviewModal(false);
        setRating(1);
        setTitle("");
        setDescription("");
        setSelectedReview({ orderId: "", productId: "" });
      })
      .catch((err) => console.error("Failed to submit review:", err));
  };

  // OPEN REVIEW MODAL
  const openReviewModal = (orderId, productId) => {
    setSelectedReview({ orderId, productId });
    setShowReviewModal(true);
  };

  // TIMELINE MODAL COMPONENT (Improved Styling)
  const TimelineModal = ({ order, onClose }) => {
    if (!order) return null;

    const timelineSteps = order?.statusTimeline || [];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Order Timeline - {order.orderId}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="relative border-l-4 border-[#b4853e] ml-5">
              {timelineSteps.map((step, index) => (
                <div key={index} className="mb-6 ml-8 relative">
                  <div
                    className={`absolute w-4 h-4 rounded-full -left-10 border-4 border-white ${
                      step.status === "completed" ? "bg-[#b4853e]" : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600 capitalize">{step.status}</p>
                    {step.timestamp && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Orders</h2>
        <span className="text-sm ml-2 text-[#b4853e]">
          [{order?.length || 0} items]
        </span>
      </div>

      {/* Orders Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {order?.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center py-10">No orders found.</p>
        ) : (
          order?.map((orderItem) => {
            const latestStep = orderItem?.statusTimeline
              ?.filter((step) => step.status === "completed")
              ?.pop();
            const latestStatus = latestStep?.title || "Order Placed";
            const latestStatusColor = getStatusColor(latestStatus);

            return (
              <div
                key={orderItem._id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="flex justify-between items-start p-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Order No:</p>
                    <p className="font-medium">{orderItem.orderId}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${latestStatusColor}`}
                  >
                    {latestStatus}
                  </span>
                </div>

                <div
                  className="flex items-center space-x-4 p-4 cursor-pointer"
                  onClick={() => navigate(`/shipment/${orderItem.orderId}`)}
                >
                  <img
                    src={orderItem?.items?.[0]?.image}
                    alt={orderItem?.items?.[0]?.title}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{orderItem?.items?.[0]?.sku}</p>
                    <p className="font-medium text-gray-900">{orderItem?.items?.[0]?.title}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ₹ {orderItem?.items?.[0]?.price}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(orderItem);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Timeline
                  </button>

                  {canCancel(latestStatus) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(orderItem.orderId);
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Order
                    </button>
                  )}

                  {latestStatus === "Delivered" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openReviewModal(orderItem._id, orderItem.items?.[0]?.productId);
                      }}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Timeline Modal */}
      <TimelineModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Cancel Confirmation Modal */}
      {cancelConfirmOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Order?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order <strong>{cancelConfirmOrderId}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelConfirmOrderId(null)}
                className="px-5 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancel}
                className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f8f6] rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Write Your Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-700">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg bg-white"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val > 1 && "s"} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][val - 1]}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700">Review Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg bg-white"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Your Review:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Share your thoughts about the product..."
              className="border border-gray-300 p-3 w-full mb-6 rounded-lg bg-white resize-none"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-5 py-2.5 text-white bg-[#b4853e] rounded-lg hover:bg-[#a07838]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;