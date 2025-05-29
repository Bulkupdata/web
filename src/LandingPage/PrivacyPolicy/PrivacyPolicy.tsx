import "./PolicyTerms.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="policy-container">
      <h1 className="policy-title" data-aos="zoom-up">
        Privacy Policy
      </h1>

      <p data-aos="zoom-up">
        At BulkUpData, we are committed to safeguarding your privacy. This
        Privacy Policy outlines how we collect, use, disclose, and protect your
        personal data when you interact with our services — including our
        website, applications, and customer support.
      </p>

      <h2 data-aos="zoom-up">1. Information We Collect</h2>
      <p data-aos="zoom-up">
        We may collect various types of information, including:
        <ul>
          <li>
            Personal Identification Information (Name, Email, Phone Number)
          </li>
          <li>Transaction Data (Payment history, top-up logs, usage data)</li>
          <li>Device and Browser Information (IP address, OS, browser type)</li>
          <li>Optional Demographics (Location, Preferences, Feedback)</li>
        </ul>
      </p>

      <h2 data-aos="zoom-up">2. How We Use Your Information</h2>
      <p data-aos="zoom-up">
        We use your data to:
        <ul>
          <li>Process airtime and data bundle requests</li>
          <li>Respond to customer inquiries and technical support needs</li>
          <li>Send you service updates, alerts, and promotional messages</li>
          <li>Improve our website functionality and user experience</li>
        </ul>
      </p>

      <h2 data-aos="zoom-up">3. Data Security</h2>
      <p data-aos="zoom-up">
        We implement industry-standard measures, including SSL encryption,
        secure server hosting, and access controls, to protect your personal
        information from unauthorized access or disclosure.
      </p>

      <h2 data-aos="zoom-up">4. Cookies & Tracking</h2>
      <p data-aos="zoom-up">
        Our website may use cookies and similar technologies to enhance user
        experience, track user behavior, and gather analytics. You can adjust
        your browser settings to refuse cookies, though some features may not
        work as intended.
      </p>

      <h2 data-aos="zoom-up">5. Sharing Your Information</h2>
      <p data-aos="zoom-up">
        We do not sell or rent your personal data. We may share it only with
        trusted service providers (like payment processors) strictly for the
        purpose of delivering our services. These third parties are
        contractually obligated to maintain confidentiality.
      </p>

      <h2 data-aos="zoom-up">6. Data Retention</h2>
      <p data-aos="zoom-up">
        We retain your information only as long as necessary to provide our
        services and comply with legal obligations. You may request deletion of
        your data, subject to verification and legal requirements.
      </p>

      <h2 data-aos="zoom-up">7. Your Rights</h2>
      <p data-aos="zoom-up">
        You have the right to:
        <ul>
          <li>Access and review the information we hold about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Withdraw your consent or delete your data at any time</li>
        </ul>
        Please contact our support team to exercise any of these rights.
      </p>

      <h2 data-aos="zoom-up">8. Changes to This Policy</h2>
      <p data-aos="zoom-up">
        We may update this Privacy Policy periodically to reflect changes in our
        practices or legal obligations. We will notify users of significant
        updates via email or a prominent notice on our platform.
      </p>

      <h2 data-aos="zoom-up">9. Contact Us</h2>
      <p data-aos="zoom-up">
        If you have any questions, concerns, or feedback regarding this Privacy
        Policy, please reach out to us at:
        <br />
        <strong>Email:</strong> admin@bulkupdata.com
      </p>

      <p data-aos="zoom-up">
        Thank you for trusting BulkUpData. Your privacy matters to us.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
