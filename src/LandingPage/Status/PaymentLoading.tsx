import React from "react";
import "./PaymentLoading.css";

const PaymentLoading: React.FC = () => {
  return (
    <div className="overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentLoading;