import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import "./BulkSummaryPage.css";
import AuthModal from "./AuthModal";
import { BaseUrl, WebBaseUrl } from "../../redux/baseurl";

interface PurchaseItem {
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

const BulkSummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { purchaseList, totalPrice } = (location.state as {
    purchaseList: PurchaseItem[];
    totalPrice: number;
  }) || {
    purchaseList: [],
    totalPrice: 0,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("bulkup_data_token");

  const handleProceedToPay = async () => {
    if (!token) {
      setIsModalOpen(true);
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

      console.log("✅ Generated Topup Payloads:", topupPayloads);
      localStorage.setItem("topupPayloads", JSON.stringify(topupPayloads));

      // 🔹 Request Paystack checkout link from backend
      const response = await axios.post(
        `${BaseUrl}/api/reloadly/create-paystack-payment`,
        {
          email: "bulkupdata@gmail.com",
          amount: totalPrice, // Paystack expects kobo (₦1000 = 100000)
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

  if (purchaseList.length === 0) {
    return (
      <div className="bulk-summary-page-container">
        <h3>No items to summarize.</h3>
        <button className="bulk-summary-btn" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bulk-summary-page-container">
      <h3 className="bulk-summary-title">Purchase Summary</h3>

      {/* Summary Table */}
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

      {/* Payment Section */}
      <div className="bulk-summary-payment-summary">
        <div className="bulk-summary-total-price-display">
          Total Price: ₦{totalPrice?.toLocaleString()}
        </div>
        <button
          className='bulk-summary-pay-btn'
          onClick={handleProceedToPay}
          disabled={loading}
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

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div style={{ marginTop: "20px" }}>
        <button
          className="bulk-summary-toggle-btn"
          onClick={() => navigate("/")}
        >
          &larr; Go Back and Edit
        </button>
      </div>
    </div>
  );
};

export default BulkSummaryPage;
