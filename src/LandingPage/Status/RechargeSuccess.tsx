import React from "react";
import { useSearchParams } from "react-router-dom";
import "./StatusPages.css";

const RechargeSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get("ref");
  const amount = searchParams.get("amount");
  const phone = searchParams.get("phone");

  return (
    <div className="status-container success">
      <div className="status-icon">🎉</div>
      <h1 className="status-title">Recharge Successful!</h1>
      <p className="status-message">Your recharge was successful.</p>
      <div className="status-details">
        {ref && <p><span className="status-strong">Reference:</span> {ref}</p>}
        {amount && <p><span className="status-strong">Amount:</span> ₦{amount}</p>}
        {phone && <p><span className="status-strong">Phone:</span> {phone}</p>}
      </div>
      <p>Thank you for using our service.</p>
    </div>
  );
};

export default RechargeSuccess;