import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { makeMainTopup } from "../../redux/Reloadly/Index";
import { BaseUrl } from "../../redux/baseurl";
import "./PaymentSuccess.css";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("trxref");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const verifyPayment = async () => {
    setLoading(true);
    setError(null);

    if (!ref) {
      setError("Missing payment reference.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BaseUrl}/api/reloadly/verify-payment`, {
        params: { reference: ref, trxref: ref },
      });

      console.log(res.data, "✅ Verified Payment");

      if (res.status === 200 && res.data.success) {
        const storedPayload = localStorage.getItem("topupPayload");
        if (storedPayload) {
          const parsedPayload = JSON.parse(storedPayload);

          try {
            const response = await dispatch(
              makeMainTopup({ ref, payload: parsedPayload })
            ).unwrap();

            console.log("✅ makeMainTopup response:", response);

            const { amount, phone } = response;

            navigate(
              `/recharge-success?status=success&ref=${ref}&amount=${amount}&phone=${phone}`
            );
          } catch (error: any) {
            console.error("❌ makeMainTopup failed:", error);
            setError("Recharge failed. Please retry.");
          }
        }
      } else {
        setError("Payment verification failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [ref]);

  return (
    <div className="payment-success-container">
      {loading && (
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Processing your payment...</p>
        </div>
      )}

      {!loading && error && (
        <div className="payment-error">
          <h2>❌ Recharge Failed</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={verifyPayment}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;