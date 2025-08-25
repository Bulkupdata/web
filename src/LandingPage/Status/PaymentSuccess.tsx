import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { makeMainTopup } from "../../redux/Reloadly/Index";
import { BaseUrl } from "../../redux/baseurl";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import "./PaymentSuccess.css";

type PaymentStatus =
  | "loading"
  | "payment_failed"
  | "payment_success_recharge_success"
  | "payment_success_recharge_failed"
  | "payment_pending"
  | "recharge_pending";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("trxref");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState<string>("Processing your payment...");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // 🔹 Safe JSON parse utility
  const safeParse = (data: string | null) => {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const verifyPayment = async () => {
    setStatus("loading");
    setMessage("Processing your payment...");

    if (!ref) {
      setStatus("payment_failed");
      setMessage("Missing payment reference.");
      return;
    }

    try {
      const res = await axios.get(`${BaseUrl}/api/reloadly/verify-payment`, {
        params: { reference: ref, trxref: ref },
      });

      if (res.status === 200 && res.data.success) {
        const storedPayloads = localStorage.getItem("topupPayloads");
        const userId = localStorage.getItem("bulkup_data_userId");

        let parsedPayloads = safeParse(storedPayloads);

        // ✅ Normalize to array
        if (parsedPayloads && !Array.isArray(parsedPayloads)) {
          parsedPayloads = [parsedPayloads];
        }

        // ✅ Ensure it's a non-empty array
        if (Array.isArray(parsedPayloads) && parsedPayloads.length > 0) {
          const payloadsWithUserId = parsedPayloads.map((p: any) => ({
            ...p,
            userId,
          }));

          try {
            const requestBody = { ref, payload: payloadsWithUserId };
            console.log("✅ Recharge requestBody:", requestBody);

            const response = await dispatch(
              makeMainTopup(requestBody)
            ).unwrap();

            console.log("✅ Recharge response:", response);

            const hasSuccessfulRecharge = response.results?.some(
              (r: any) => r.success === true
            );

            if (hasSuccessfulRecharge) {
              setStatus("payment_success_recharge_success");
              setMessage(
                "Your payment was successful and the recharge has been applied to your number."
              );

              setTimeout(() => {
                navigate(`/recharge-success?status=success&ref=${ref}`, {
                  state: { results: response.results },
                });
              }, 2500);
            } else {
              setStatus("payment_success_recharge_failed");
              setMessage(
                "Your payment was successful, but the recharge could not be completed. Please try again."
              );
            }
          } catch (error: any) {
            console.error("❌ Topup dispatch failed:", error);
            setStatus("payment_success_recharge_failed");
            setMessage(
              "Your payment was successful, but the recharge could not be completed. Please try again."
            );
          }
        } else {
          setStatus("recharge_pending");
          setMessage(
            "Your payment was successful, but no valid recharge payload was found. Please wait or try again."
          );
        }
      } else if (res.data.status === "pending") {
        setStatus("payment_pending");
        setMessage("Your payment is still pending. Please wait a few minutes.");
      } else {
        setStatus("payment_failed");
        setMessage("Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Verification error:", err);
      setStatus("payment_failed");
      setMessage(
        err.response?.data?.error || "An error occurred on the server."
      );
    }
  };
  useEffect(() => {
    verifyPayment();
  }, [ref]);

  return (
    <div className="payment-success-container">
      {status === "loading" && (
        <div className="status-card loading-section">
          <div className="spinner"></div>
          <p>{message}</p>
        </div>
      )}

      {status === "payment_success_recharge_success" && (
        <div className="status-card payment-success">
          <FiCheckCircle size={48} color="#28a745" />
          <h2>Recharge Successful</h2>
          <p>{message}</p>
        </div>
      )}

      {status === "payment_success_recharge_failed" && (
        <div className="status-card payment-warning">
          <FiAlertTriangle size={48} color="#ff0000" />
          <h2>Recharge Failed</h2>
          <p className="payment-success-note">
            Payment was <span className="green-text">successful</span>.
          </p>
          <p>{message}</p>
          <button className="retry-button" onClick={verifyPayment}>
            Retry Recharge
          </button>
        </div>
      )}

      {status === "payment_failed" && (
        <div className="status-card payment-error">
          <FiXCircle size={48} color="#ff0000" />
          <h2>Payment Failed</h2>
          <p>{message}</p>
          <button className="retry-button" onClick={verifyPayment}>
            Retry Payment
          </button>
        </div>
      )}

      {status === "payment_pending" && (
        <div className="status-card payment-pending">
          <FiClock size={48} color="#17a2b8" />
          <h2>Payment Pending</h2>
          <p>{message}</p>
        </div>
      )}

      {status === "recharge_pending" && (
        <div className="status-card payment-pending">
          <FiClock size={48} color="#17a2b8" />
          <h2>Recharge Pending</h2>
          <p>{message}</p>
          <button className="retry-button" onClick={verifyPayment}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
