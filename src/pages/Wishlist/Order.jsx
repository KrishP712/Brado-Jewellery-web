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
  const userId = useSelector((state) => state?.auth?.user?._id); // Current logged-in user
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Track which products have been reviewed by the user
  const [reviewedProducts, setReviewedProducts] = useState({});

  // Inline alert for "already reviewed"
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    dispatch(getOrderData());
  }, [dispatch]);

  // Check which products the user has already reviewed
  useEffect(() => {
    if (!order || !userId) return;

    const checkReviewedStatus = async () => {
      const reviewedMap = {};

      for (const ord of order) {
        for (const item of ord.items || []) {
          const productId = item.productId || item._id;
          if (!productId || reviewedMap[productId] !== undefined) continue;

          // Here we assume your backend provides reviews in order or you have an endpoint
          // This is a fallback logic using order data if reviews are attached
          // Replace with actual API call if needed
          const hasReview = ord.items.some(
            (i) =>
              (i.productId || i._id).toString() === productId.toString() &&
              i.reviewedBy === userId
          );

          reviewedMap[productId] = hasReview || false;
        }
      }

      setReviewedProducts(reviewedMap);
    };

    checkReviewedStatus();
  }, [order, userId]);

  // Prevent scroll when modals/alert open
  useEffect(() => {
    if (selectedOrder || showReviewModal || alertMessage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrder, showReviewModal, alertMessage]);

  // Status color mapping
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

  const canCancel = (status) => {
    return !["Delivered", "Cancelled", "Returned and Refunded", "Out for Delivery"].includes(status);
  };

  const handleCancelOrder = (orderId) => {
    dispatch(updateOrderData({ orderId, status: "Cancelled" }))
      .unwrap()
      .then(() => dispatch(getOrderData()))
      .catch((err) => console.error("Cancel failed:", err));
  };

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
        setRating(5);
        setTitle("");
        setDescription("");
        // Mark this product as reviewed
        setReviewedProducts((prev) => ({
          ...prev,
          [selectedReview.productId]: true,
        }));
      })
      .catch((err) => console.error("Review submit failed:", err));
  };

  const openReviewModal = (orderId, productId) => {
    if (reviewedProducts[productId]) {
      setAlertMessage("You have already submitted a review for this product.");
      return;
    }
    setSelectedReview({ orderId, productId });
    setShowReviewModal(true);
  };

  const TimelineModal = ({ order, onClose }) => {
    if (!order) return null;

    const cancelledStep = order.statusTimeline.find(
      (step) => (step.title === "Order Cancelled" || step.title === "Cancelled") && step.status === "completed"
    );

    const filteredTimeline = order.statusTimeline.filter((step) => {
      if (cancelledStep) {
        if (step.title === "Order Placed") return true;
        if (step.title === "Order Cancelled" || step.title === "Cancelled") return step.status === "completed";
        return step.status === "completed";
      }
      return true;
    });

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={onClose}>
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Timeline - {order.OrderId}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative border-l border-gray-300 ml-4">
            {filteredTimeline.map((step, index) => (
              <div key={index} className="mb-4 ml-6">
                <div
                  className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${
                    step.status === "completed" ? "bg-[#b4853e]" : "bg-gray-300"
                  }`}
                ></div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{step.title}</span>
                  <span className="text-sm text-gray-500 capitalize">{step.status}</span>
                  {step.timestamp && (
                    <span className="text-sm text-gray-400">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 pb-[10px]">
        <h2 className="text-[22px] text-gray-900">Orders</h2>
        <span className="text-sm ml-[5px] text-[#b4853e]">
          [{order?.length || 0} items]
        </span>
      </div>

      {/* Orders Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {order?.length === 0 ? (
          <p className="text-gray-600 col-span-2 text-center py-8">No orders found.</p>
        ) : (
          order?.map((orderItem) => {
            const latestStep = orderItem?.statusTimeline
              ?.filter((step) => step.status === "completed")
              ?.pop();
            const latestStatus = latestStep?.title || "Unknown";

            // Get first product's ID (adjust if multiple items)
            const productId = orderItem.items?.[0]?.productId || orderItem.items?.[0]?._id;
            const hasReviewed = reviewedProducts[productId];

            return (
              <div
                key={orderItem._id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-start p-[10px] border-b border-gray-200">
                  <div>
                    <div className="flex">
                      <p className="text-[14px] text-gray-400">Order No :</p>
                      <span className="text-[14px] ml-1">{orderItem.orderId}</span>
                    </div>
                  </div>
                  <span className={`inline-block rounded-sm text-[11px] px-[10px] py-[4px] ${getStatusColor(latestStatus)}`}>
                    {latestStatus}
                  </span>
                </div>

                {/* Product Info */}
                <div
                  className="flex items-center space-x-4 p-[10px] cursor-pointer"
                  onClick={() => navigate(`/shipment/${orderItem.orderId}`)}
                >
                  <img
                    src={orderItem?.items?.[0]?.image}
                    alt={orderItem?.items?.[0]?.title || "Product"}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-500 mb-[2px]">
                      {orderItem?.items?.[0]?.sku}
                    </p>
                    <p className="text-[14px] font-medium">{orderItem?.items?.[0]?.title}</p>
                    <p className="text-[14px] text-gray-900 font-semibold">
                      ₹ {orderItem?.items?.[0]?.price}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-[10px] border-t border-gray-200 flex flex-wrap gap-3 justify-between text-sm">
                  <button
                    onClick={() => setSelectedOrder(orderItem)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Timeline
                  </button>

                  {canCancel(latestStatus) && (
                    <button
                      onClick={() => handleCancelOrder(orderItem.orderId)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Order
                    </button>
                  )}

                  {latestStatus === "Delivered" && (
                    <>
                      {hasReviewed ? (
                        <span
                          onClick={() => setAlertMessage("You have already submitted a review for this product.")}
                          className="text-green-600 font-medium flex items-center gap-1 cursor-pointer hover:text-green-800"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Already Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => openReviewModal(orderItem._id, productId)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Write Review
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Timeline Modal */}
      <TimelineModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="bg-[#f8f8f6] p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-900">Write Your Review</h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-3 w-full mb-4 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#b4853e]"
            >
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val > 1 ? "s" : ""} - {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][val]}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700">Review Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-3 w-full mb-4 rounded-md bg-white"
              placeholder="Give your review a title"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Your Review:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border border-gray-300 p-3 w-full mb-6 rounded-md bg-white resize-none"
              placeholder="Share your experience..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-6 py-2.5 bg-[#b4853e] text-white rounded-md hover:bg-[#c4954e] transition font-medium"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Reviewed Alert */}
      {alertMessage && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4"
          onClick={() => setAlertMessage("")}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Review Submitted</p>
            <p className="text-sm text-gray-600">{alertMessage}</p>
            <button
              onClick={() => setAlertMessage("")}
              className="mt-6 px-6 py-2.5 bg-[#b4853e] text-white rounded-md hover:bg-[#c4954e] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;