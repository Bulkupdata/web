import React from "react";
import { useSearchParams } from "react-router-dom";
import "./StatusPages.css";

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get("ref");

  return (
    <div className="status-container failure" style={{ height: "100vh" }}>
      <div className="status-icon">❌</div>
      <h1 className="status-title">Payment Failed</h1>
      <p className="status-message">
        Unfortunately, your payment was not successful.
      </p>
      <div className="status-details">
        {ref && (
          <p>
            <span className="status-strong">Reference:</span> {ref}
          </p>
        )}
      </div>
      <p>Please try again or contact support for assistance.</p>
    </div>
  );
};

export default PaymentFailure;
