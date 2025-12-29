import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderData,
  updateOrderData,
} from "../../redux/slices/order";
import { createReviewData, getReviewsByProduct } from "../../redux/slices/review"; // ← Add getReviewsByProduct
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ← Optional: for nice toast messages

function Order() {
  const dispatch = useDispatch();
  const order = useSelector((state) => state?.order?.order);
  const userId = useSelector((state) => state?.auth?.user?._id); // ← Get logged-in user ID
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  // REVIEW STATES
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Track reviewed products per order (to avoid API call on every render)
  const [reviewedProducts, setReviewedProducts] = useState({}); // { productId: true/false }

  useEffect(() => {
    dispatch(getOrderData());
  }, [dispatch]);

  // Fetch review status for all products in orders
  useEffect(() => {
    if (!order || !userId) return;

    const fetchReviewStatus = async () => {
      const reviewedMap = {};

      for (const ord of order) {
        for (const item of ord.items || []) {
          const productId = item.productId || item._id;
          if (!productId) continue;

          // Skip if already checked
          if (reviewedMap[productId] !== undefined) continue;

          try {
            const res = await dispatch(
              getReviewsByProduct({ productId })
            ).unwrap();

            const hasReviewed = res?.data?.reviews?.some(
              (rev) => rev.userId?._id === userId || rev.userId === userId
            );

            reviewedMap[productId] = hasReviewed;
          } catch (err) {
            console.error("Failed to check review status:", err);
            reviewedMap[productId] = false;
          }
        }
      }

      setReviewedProducts(reviewedMap);
    };

    fetchReviewStatus();
  }, [order, userId, dispatch]);

  // Prevent body scroll
  useEffect(() => {
    if (selectedOrder || showReviewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrder, showReviewModal]);

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

  const canCancel = (status) => {
    return !["Delivered", "Cancelled", "Returned and Refunded", "Out for Delivery"].includes(status);
  };

  const handleCancelOrder = (orderId) => {
    dispatch(updateOrderData({ orderId, status: "Cancelled" }))
      .unwrap()
      .then(() => {
        dispatch(getOrderData());
        toast.success("Order cancelled successfully");
      })
      .catch((err) => {
        toast.error("Failed to cancel order");
        console.error(err);
      });
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
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setRating(5);
        setTitle("");
        setDescription("");

        // Update reviewed status
        setReviewedProducts((prev) => ({
          ...prev,
          [selectedReview.productId]: true,
        }));
      })
      .catch((err) => {
        toast.error("Failed to submit review");
        console.error(err);
      });
  };

  const openReviewModal = (orderId, productId) => {
    const hasReviewed = reviewedProducts[productId];
    if (hasReviewed) {
      toast("You have already reviewed this product", {
        icon: "ℹ️",
        style: { background: "#333", color: "#fff" },
      });
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
        if (step.title === "Order Cancelled" || step.title === "Cancelled") {
          return step.status === "completed";
        }
        return step.status === "completed" && step.title !== "Order Confirmed";
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
      <div className="flex items-center border-b border-gray-200 pb-[10px]">
        <h2 className="text-[22px] text-gray-900">Orders</h2>
        <span className="text-sm ml-[5px] text-[#b4853e]">[{order?.length || 0} items]</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {order?.length === 0 ? (
          <p className="text-gray-600 col-span-2 text-center py-8">No orders found.</p>
        ) : (
          order?.map((orderItem) => {
            const latestStep = orderItem?.statusTimeline
              ?.filter((step) => step.status === "completed")
              ?.pop();
            const latestStatus = latestStep?.title || "Unknown";
            const latestStatusColor = getStatusColor(latestStatus);

            // Assume first item for simplicity (or loop if multiple items)
            const productId = orderItem.items?.[0]?.productId || orderItem.items?.[0]?._id;
            const hasReviewed = productId ? reviewedProducts[productId] : false;

            return (
              <div
                key={orderItem._id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
              >
                <div className="flex justify-between items-start p-[10px] border-b border-gray-200">
                  <div>
                    <div className="flex">
                      <p className="text-[14px] text-gray-400">Order No :</p>
                      <span className="text-[14px] ml-1">{orderItem.orderId}</span>
                    </div>
                  </div>
                  <span className={`inline-block rounded-sm text-[11px] px-[10px] py-[4px] ${latestStatusColor}`}>
                    {latestStatus}
                  </span>
                </div>

                <div
                  className="flex items-center space-x-4 p-[10px]"
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
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
              className="border border-gray-300 p-3 w-full mb-4 rounded-md bg-white text-gray-900"
              placeholder="Give your review a title"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Your Review:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border border-gray-300 p-3 w-full mb-6 rounded-md bg-white text-gray-900 resize-none"
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
    </div>
  );
}

export default Order;