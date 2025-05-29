import React from "react";
import { useSearchParams } from "react-router-dom";
import "./StatusPages.css";

const RechargeFailure: React.FC = () => {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const ref = searchParams.get("ref");
  const amount = searchParams.get("amount");
  const phone = searchParams.get("phone");

  return (
    <div className="status-container failure">
      <div className="status-icon">⚠️</div>
      <h1 className="status-title">Recharge {status || "Failed"}</h1>
      <p className="status-message">Sorry, your transaction was not successful.</p>
      <div className="status-details">
        {ref && <p><span className="status-strong">Reference:</span> {ref}</p>}
        {amount && <p><span className="status-strong">Amount:</span> ₦{amount}</p>}
        {phone && <p><span className="status-strong">Phone:</span> {phone}</p>}
      </div>
      <p>Please try again or contact support if the issue persists.</p>
    </div>
  );
};

export default RechargeFailure;