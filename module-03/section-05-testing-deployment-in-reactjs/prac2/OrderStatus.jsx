import React from "react";

function OrderStatus({ status }) {
  return <span className="badge-success">{status === "Delivered" ? "Đã giao hàng" : status}</span>;
}

export default OrderStatus;
