import React, { useState } from "react";
import axios from "axios";
import { BaseUrl, WebBaseUrl } from "../../redux/baseurl";

const PayWithPaystack: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BaseUrl}/api/reloadly/create-paystack-payment`,
        {
          email: `ibenemeikenna2021@gmail.com`,
          amount: 100, // Amount in Naira
          callback_url: `${WebBaseUrl}/payment-success`, // Your frontend callback route
          currency: "NGN", // Optional
        }
      );

      console.log(response.data, "payyy");
      const { checkout_url } = response.data;

      // Redirect to Paystack checkout
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay ₦5 with Paystack"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PayWithPaystack;
