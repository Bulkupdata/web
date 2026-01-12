import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./BulkSummaryPage.css";
import AuthModal from "./AuthModal";
import { BaseUrl, WebBaseUrl } from "../../redux/baseurl";

export interface PurchaseItem {
  recipientPhone: { countryCode?: string; number: string };
  senderPhone?: { countryCode?: string; number: string };
  type: "Data" | "Airtime";
  operatorId?: number;
  operatorNickname?: string;
  planType?: string;
  bundle?: {
    budDataAmount?: string;
    planAmount?: number;
    amount?: number;
    price?: number;
    fixedPrice?: number;
    retailPrice?: number;
    retailDataAmount?: string;
    planType?: string;
  };
  amount?: number;
  logoUrls?: any;
  network?: any;
}

interface BulkSummaryPageProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseList: PurchaseItem[];
  subtotal: number;
  serviceFee: number;
  grandTotal: number;
  totalPrice: number; // consider removing if unused
}

const BulkSummaryPage: React.FC<BulkSummaryPageProps> = ({
  isOpen,
  onClose,
  purchaseList,
  subtotal,
  serviceFee,
  grandTotal,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("bulkup_data_token");

  // Auto-show auth modal when summary opens and there's no email yet
  useEffect(() => {
    if (!isOpen) return;
  
    const checkEmail = () => {
      const email = localStorage.getItem("bulkup_data_email");
      if (!email) {
        setIsAuthModalOpen(true);
      }
    };
  
    checkEmail();
  
    // Optional: listen for storage changes (if login happens in another tab/window)
    window.addEventListener("storage", checkEmail);
    return () => window.removeEventListener("storage", checkEmail);
  }, [isOpen]);

  const handleProceedToPay = async () => {
    // Always read fresh from localStorage on every click
    const userEmail = localStorage.getItem("bulkup_data_email");

    if (!userEmail) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optional: also re-check token here if you want to be extra safe
    const currentToken = localStorage.getItem("bulkup_data_token");
    if (!currentToken) {
      setIsAuthModalOpen(true);
      return;
    }

    if (purchaseList.length === 0) {
      alert("No items selected for purchase.");
      return;
    }

    setLoading(true);

    try {
      const timestamp = Date.now();
      const batchId = `${uuidv4()}_${timestamp}`;

      const topupPayloads = purchaseList.map((item) => {
        const itemId = `${uuidv4()}_${timestamp}`;
        return {
          id: itemId,
          operatorId: item.operatorId,
          operatorNickname: item.operatorNickname ?? "",
          retailDataAmount:
            item.bundle?.retailDataAmount ||
            item.bundle?.budDataAmount ||
            undefined,
          retailPrice:
            item.bundle?.retailPrice ??
            item.bundle?.price ??
            item.bundle?.fixedPrice ??
            item.amount,
          amount:
            item.bundle?.planAmount ??
            item.bundle?.fixedPrice ??
            item.bundle?.price ??
            item.amount,
          planType: item.bundle?.planType ?? item.planType ?? item.type,
          useLocalAmount: true,
          customIdentifier: itemId,
          recipientEmail: null, // ← most common for airtime/data
          // recipientEmail: userEmail,   // ← only if backend really needs buyer email here
          recipientPhone: item.recipientPhone,
          senderPhone: item.senderPhone || {
            countryCode: "NG",
            number: item.recipientPhone.number,
          },
          batchId,
          status: "pending",
          type: item.type,
          network: item?.network,
          logoUrls: item?.logoUrls,
        };
      });

      console.log("Generated top-up payloads:", topupPayloads);

      localStorage.setItem("topupPayloads", JSON.stringify(topupPayloads));

      const response = await axios.post(
        `${BaseUrl}/api/reloadly/create-paystack-payment`,
        {
          email: userEmail, // fresh value sent to Paystack
          amount: Math.round(grandTotal), // Paystack → kobo
          callback_url: `${WebBaseUrl}/payment-success`,
          currency: "NGN",
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { checkout_url } = response.data;

      if (!checkout_url) {
        throw new Error("No payment URL received from server");
      }

      window.location.href = checkout_url;
    } catch (error: any) {
      console.error("Payment initiation failed:", error);

      let msg = "Failed to start payment. Please try again.";

      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isLoggedIn = !!token && !!localStorage.getItem("bulkup_data_email");

  return (
    <div className="modal-overlay">
      <div className="bulk-summary-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 style={{ marginTop: 16 }}>Purchase Summary</h2>

        {purchaseList.length === 0 ? (
          <div className="no-items-message">
            <p>No items to summarize.</p>
            <button className="modal-back-btn" onClick={onClose}>
              Go Back
            </button>
          </div>
        ) : (
          <>
            <div className="bulk-summary-table-wrapper">
              <table className="bulk-summary-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Phone Number</th>
                    <th>Type</th>
                    <th>Bundle</th>
                    <th>Amount (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseList.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.recipientPhone.number}</td>
                      <td>{item.type}</td>
                      <td>
                        {item.type === "Data"
                          ? item.bundle?.budDataAmount ||
                            item.bundle?.retailDataAmount ||
                            "–"
                          : "Airtime"}
                      </td>
                      <td>
                        {(
                          item.bundle?.retailPrice ??
                          item.bundle?.price ??
                          item.bundle?.fixedPrice ??
                          item.amount ??
                          0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bulk-summary-payment-summary">
              <div className="bulk-summary-price-breakdown">
                <p style={{ fontSize: 14, color: "#555" }}>
                  Subtotal: <strong>₦{subtotal?.toLocaleString()}</strong>
                </p>
                <p style={{ fontSize: 14, color: "#555" }}>
                  Service Fee: <strong>₦{serviceFee?.toLocaleString()}</strong>
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    marginTop: "1rem",
                  }}
                >
                  Grand Total: ₦{grandTotal?.toLocaleString()}
                </p>
              </div>

              <br />

              {!isLoggedIn && (
                <p
                  style={{
                    color: "#d32f2f",
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                  }}
                >
                  Please log in or create an account to proceed with payment
                </p>
              )}

              <button
                className="bulk-summary-pay-btn"
                onClick={handleProceedToPay}
                disabled={loading || purchaseList.length === 0 || !isLoggedIn}
              >
                {loading ? (
                  <span className="loader" />
                ) : !isLoggedIn ? (
                  "Login to Pay"
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </>
        )}

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView="login"
        />
      </div>
    </div>
  );
};

export default BulkSummaryPage;
