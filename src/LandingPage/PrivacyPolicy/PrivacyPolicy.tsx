import "./PolicyTerms.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./PolicyTerms.css";
import PaystackPayment from "../Modal/Pay";
import PayWithPaystack from "../Modal/PayWithPaystack";

const PrivacyPolicy = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="policy-container">
      <h1 className="policy-title" data-aos="zoom-up">
        Privacy Policy
      </h1>
      <PaystackPayment />
      <PayWithPaystack />
      <p data-aos="zoom-up">
        At BulkUpData, your privacy is our priority. This policy outlines how we
        collect, use, and protect your personal information when you use our
        platform for airtime and data bundle purchases.
      </p>

      <h2 data-aos="zoom-up">Information We Collect</h2>
      <p data-aos="zoom-up">
        We collect personal details such as your name, phone number, and email
        address to process top-ups and offer customer support.
      </p>

      <h2 data-aos="zoom-up">How We Use Your Information</h2>
      <p data-aos="zoom-up">
        Your information is used solely to provide seamless recharge services,
        communicate with you, and improve our offerings.
      </p>

      <h2 data-aos="zoom-up">Data Protection</h2>
      <p data-aos="zoom-up">
        We use encryption and secure servers to ensure your data is safe and
        protected from unauthorized access.
      </p>

      <h2 data-aos="zoom-up">Third-Party Services</h2>
      <p data-aos="zoom-up">
        We may use third-party vendors for payment processing, but they are
        required to uphold confidentiality and data security.
      </p>

      <h2 data-aos="zoom-up">Your Consent</h2>
      <p data-aos="zoom-up">
        By using BulkUpData, you agree to our privacy practices as described in
        this policy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
