import "./PolicyTerms.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./PolicyTerms.css";

const TermsAndConditions = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return (
    <div className="policy-container">
      <h1 className="policy-title" data-aos="zoom-up">
        Terms & Conditions
      </h1>
      <p data-aos="zoom-up">
        These terms govern your use of BulkUpData services. By accessing our
        platform, you agree to the following terms.
      </p>

      <h2 data-aos="zoom-up">Service Use</h2>
      <p data-aos="zoom-up">
        BulkUpData allows users to top-up airtime and purchase data bundles for
        Nigerian networks. All transactions are final and processed instantly.
      </p>

      <h2 data-aos="zoom-up">Payment</h2>
      <p data-aos="zoom-up">
        Payments must be made via the available channels. We are not liable for
        failed transactions due to network or banking issues.
      </p>

      <h2 data-aos="zoom-up">Account Security</h2>
      <p data-aos="zoom-up">
        You are responsible for maintaining the confidentiality of your login
        credentials.
      </p>

      <h2 data-aos="zoom-up">Limitation of Liability</h2>
      <p data-aos="zoom-up">
        BulkUpData is not responsible for service interruptions or losses
        resulting from third-party errors or force majeure events.
      </p>

      <h2 data-aos="zoom-up">Changes to Terms</h2>
      <p data-aos="zoom-up">
        We reserve the right to modify these terms at any time. Continued use
        constitutes acceptance of the updated terms.
      </p>
    </div>
  );
};

export default TermsAndConditions;
