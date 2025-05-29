// PaystackPayment.tsx

import { PaystackButton } from "react-paystack";

const PaystackPayment = () => {
  const publicKey = "pk_live_1314935c92fe40573d7c8105b93a7201c9cc72e3"; // Replace with your own key
  const amount = 5000 * 100; // Amount in Kobo
  const email = "testuser@example.com";

  const componentProps = {
    email,
    amount,
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: "Test User",
        },
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value: "08123456789",
        },
      ],
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (reference: any) => {
      alert(`Payment successful! Reference: ${reference.reference}`);
    },
    onClose: () => {
      alert("Payment dialog closed");
    },
  };

  return (
    <div style={{ marginTop: 200 }}>
      <h2>React Paystack Integration</h2>
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default PaystackPayment;
