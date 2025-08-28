import React, { useState } from "react";
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
  totalPrice: number; // This is the same as grandTotal
}

const BulkSummaryPage: React.FC<BulkSummaryPageProps> = ({
  isOpen,
  onClose,
  purchaseList,
  subtotal,
  serviceFee,
  grandTotal,
  totalPrice,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("bulkup_data_token");

  const handleProceedToPay = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (purchaseList.length === 0) return;

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
          recipientEmail: "bulkupdata@gmail.com",
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

      console.log("✅ Generated Topup Payloads:", totalPrice, topupPayloads);
      localStorage.setItem("topupPayloads", JSON.stringify(topupPayloads));

      const response = await axios.post(
        `${BaseUrl}/api/reloadly/create-paystack-payment`,
        {
          email: "bulkupdata@gmail.com",
          amount: Math.round(grandTotal),
          callback_url: `${WebBaseUrl}/payment-success`,
          currency: "NGN",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { checkout_url } = response.data;
      window.location.href = checkout_url;
    } catch (error) {
      console.error("❌ Payment initiation failed:", error);
      alert("Payment initiation failed. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="bulk-summary-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <br />
        <h2 className="" style={{ marginTop: 16 }}>
          Purchase Summary
        </h2>

        {/* Summary Table */}
        {purchaseList.length === 0 ? (
          <div className="no-items-message">
            <p>No items to summarize.</p>
            <button className="modal-back-btn" onClick={onClose}>
              Go Back
            </button>
          </div>
        ) : (
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
                          "-"
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
        )}

        {/* Payment Section */}
        <div className="bulk-summary-payment-summary">
          <div className="bulk-summary-price-breakdown">
            <p style={{ fontSize: 10, color: "#666", fontWeight: 400 }}>
              Subtotal:
              <span
                style={{
                  fontSize: 15,
                  color: "#666",
                  fontWeight: 700,
                  marginLeft: 12,
                }}
              >
                ₦{subtotal?.toLocaleString()}
              </span>
            </p>
            <p style={{ fontSize: 10, color: "#666", fontWeight: 400 }}>
              Service Fee:
              <span
                style={{
                  fontSize: 15,
                  color: "#666",
                  fontWeight: 700,
                  marginLeft: 12,
                }}
              >
                ₦{serviceFee?.toLocaleString()}
              </span>
            </p>
            <p style={{ fontWeight: 700, fontSize: 24, marginTop: "1rem" }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>
                Grand Total:
              </span>{" "}
              ₦{grandTotal?.toLocaleString()}
            </p>
          </div>
          <br />
          <button
            className="bulk-summary-pay-btn"
            onClick={handleProceedToPay}
            disabled={loading || purchaseList.length === 0}
          >
            {loading ? (
              <span className="loader"></span>
            ) : token ? (
              "Pay Now"
            ) : (
              "Proceed to Pay"
            )}
          </button>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default BulkSummaryPage;
