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
  const [selectedOrder, setSelectedOrder] = useState(null);

  // REVIEW STATES
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState({ orderId: "", productId: "" });
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getOrderData());
  }, [dispatch]);

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
    return (
      status !== "Delivered" &&
      status !== "Cancelled" &&
      status !== "Returned and Refunded" &&
      status !== "Out for Delivery"
    );
  };

  // CANCEL ORDER
  const handleCancelOrder = (orderId) => {
    dispatch(updateOrderData({ orderId: orderId, status: "Cancelled" }))
      .unwrap()
      .then(() => dispatch(getOrderData()))
      .catch((err) => console.error("Failed to cancel order:", err));
  };

  // ⭐ REVIEW SUBMIT – FIXED
  const handleReviewSubmit = () => {
    dispatch(
      createReviewData({
        productId: selectedReview.productId,
        orderId: selectedReview.orderId,
        rating,
        title,
        comment: description,  // FIXED
      })
    )
      .unwrap()
      .then(() => {
        setShowReviewModal(false);
        setRating(1);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.error("Failed to submit review:", err));
  };

  // TIMELINE MODAL
  // const TimelineModal = ({ order, onClose }) => {
  //   if (!order) return null;
  //   return (
  //     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
  //         <div className="flex justify-between items-center mb-4">
  //           <h3 className="text-lg font-semibold">
  //             Order Timeline - {order.orderId}
  //           </h3>
  //           <button
  //             onClick={onClose}
  //             className="text-gray-500 hover:text-gray-700"
  //           >
  //             <X className="w-6 h-6" />
  //           </button>
  //         </div>
  //         <div className="relative border-l border-gray-300 ml-4">
  //           {order?.statusTimeline?.map((step, index) => (
  //             <div key={index} className="mb-4 ml-6">
  //               <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-1.5 border border-white"></div>
  //               {step.status === "completed" && (
  //                 <div className="absolute w-3 h-3 bg-[#b4853e] rounded-full -left-1.5 border border-white"></div>
  //               )}
  //               <div className="flex flex-col">
  //                 <span className="font-medium text-gray-900">{step.title}</span>
  //                 <span className="text-sm text-gray-500 capitalize">
  //                   {step.status}
  //                 </span>
  //                 {step.timestamp && (
  //                   <span className="text-sm text-gray-400">
  //                     {new Date(step.timestamp).toLocaleString()}
  //                   </span>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const TimelineModal = ({ order, onClose }) => {
    if (!order) return null;

    const cancelledStep = order.statusTimeline.find(
      (step) => (step.title === "Order Cancelled" || step.title === "Cancelled") && step.status === "completed"
    );

    const orderConfirmedStep = order.statusTimeline.find(
      (step) => step.title === "Order Confirmed" && step.status === "completed"
    );

    const filteredTimeline = order.statusTimeline.filter((step) => {
      if (cancelledStep) {
        if (step.title === "Order Placed") return true;
        if (step.title === "Order Cancelled" || step.title === "Cancelled") {
          return step.status === "completed";
        }
        if (!orderConfirmedStep) {
          return false;
        }
        return step.status === "completed";
      }
      return true;
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Timeline - {order.OrderId}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close timeline modal">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative border-l border-gray-300 ml-4">
            {filteredTimeline.map((step, index) => (
              <div key={index} className="mb-4 ml-6">
                <div className={`absolute w-3 h-3 rounded-full -left-1.5 border border-white ${step.status === "completed" ? "bg-[#b4853e]" : "bg-gray-300"
                  }`}></div>
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
  // OPEN REVIEW MODAL – FIXED
  const openReviewModal = (orderId, productId) => {
    setSelectedReview({ orderId, productId });
    setShowReviewModal(true);
  };

  return (
    <div className="space-y-6 cursor-pointer">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 pb-[10px]">
        <h2 className="text-[22px] text-gray-900">Orders</h2>
        <span className="text-sm ml-[5px] text-[#b4853e]">
          [{order?.length} items]
        </span>
      </div>

      {/* Orders Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {order?.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          order?.map((orderItem) => {
            const latestStep = orderItem?.statusTimeline
              ?.filter((step) => step.status === "completed")
              ?.pop();
            const latestStatus = latestStep?.title || "Unknown";
            const latestStatusColor = getStatusColor(latestStatus);

            return (
              <div
                key={orderItem._id}
                className="bg-white border border-gray-200 sm:w-full hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start p-[10px] border-b border-gray-200">
                  <div>
                    <div className="flex">
                      <p className="text-[14px] text-gray-400">Order No :</p>
                      <span className="text-[14px] ml-1">{orderItem.orderId}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-block rounded-sm text-[11px] px-[10px] py-[4px] ${latestStatusColor}`}
                    onClick={() => setSelectedOrder(orderItem)}
                  >
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
                    className="w-24 h-32 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-500 mb-[2px]">
                      {orderItem?.items?.[0]?.sku}
                    </p>
                    <p className="text-[14px]">{orderItem?.items?.[0]?.title}</p>
                    <p className="text-[14px] text-gray-900">
                      ₹ {orderItem?.items?.[0]?.price}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="p-[10px] border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => setSelectedOrder(orderItem)}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    View Timeline
                  </button>

                  {canCancel(latestStatus) && (
                    <button
                      onClick={() => handleCancelOrder(orderItem.orderId)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* ⭐ REVIEW BUTTON ONLY WHEN DELIVERED */}
                  {latestStatus === "Delivered" && (
                    <button
                      onClick={() =>
                        openReviewModal(orderItem._id, orderItem.items?.[0]?.productId)
                      }
                      className="text-green-600 text-sm hover:text-green-800"
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
      <TimelineModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f8f8f6] p-6 rounded-lg w-96 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Write Your Review</h3>

            <label className="block mb-2 text-sm text-gray-600">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>

            <label className="block mb-2 text-sm text-gray-600">
              Review Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
              placeholder="Enter a title for your review"
            />

            <label className="block mb-2 text-sm text-gray-600">
              Review Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md bg-white text-gray-900"
              placeholder="Enter your review"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleReviewSubmit}
                className="text-[#b4853e] px-4 py-2 rounded-md hover:bg-[#b4853e]/10"
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
