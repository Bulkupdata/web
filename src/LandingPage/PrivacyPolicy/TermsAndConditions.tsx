import "./PolicyTerms.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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
        Welcome to BulkUpData. These Terms and Conditions (“Terms”) govern your
        access to and use of our platform and services. By using our website,
        creating an account, or transacting through our platform, you agree to
        abide by these Terms in full.
      </p>

      <h2 data-aos="zoom-up">1. Use of Services</h2>
      <p data-aos="zoom-up">
        Our platform provides airtime top-up and data bundle purchase services
        for supported Nigerian mobile networks. You agree to use the services
        for lawful purposes only. Misuse, abuse, or unauthorized access may
        result in account termination.
      </p>

      <h2 data-aos="zoom-up">2. Account Registration</h2>
      <p data-aos="zoom-up">
        To use certain features of our services, you may be required to create
        an account and provide accurate, up-to-date personal information. You
        are responsible for maintaining the confidentiality of your credentials
        and all activities under your account.
      </p>

      <h2 data-aos="zoom-up">3. Payment Terms</h2>
      <p data-aos="zoom-up">
        All payments must be made through the authorized payment methods
        available on our platform. Transactions are processed instantly.
        BulkUpData is not liable for issues resulting from incorrect user input,
        poor network connectivity, or bank downtimes.
      </p>

      <h2 data-aos="zoom-up">4. Refund Policy</h2>
      <p data-aos="zoom-up">
        Due to the digital nature of our services, all successful transactions
        are final and non-refundable. Exceptions may be considered only in cases
        of proven technical errors directly caused by our platform.
      </p>

      <h2 data-aos="zoom-up">5. User Conduct</h2>
      <p data-aos="zoom-up">
        You agree not to use BulkUpData for fraudulent or illegal activities.
        Impersonation, reverse-engineering, interference with service delivery,
        or unauthorized access attempts are strictly prohibited.
      </p>

      <h2 data-aos="zoom-up">6. Intellectual Property</h2>
      <p data-aos="zoom-up">
        All content on our platform, including logos, graphics, code, and
        trademarks, are the intellectual property of BulkUpData or its
        licensors. You may not copy, reproduce, or distribute any part of the
        platform without prior written consent.
      </p>

      <h2 data-aos="zoom-up">7. Service Availability</h2>
      <p data-aos="zoom-up">
        We strive to provide reliable and uninterrupted service. However, we
        cannot guarantee continuous availability and are not responsible for
        delays or outages caused by external systems (e.g., network providers,
        payment gateways).
      </p>

      <h2 data-aos="zoom-up">8. Limitation of Liability</h2>
      <p data-aos="zoom-up">
        To the fullest extent permitted by law, BulkUpData shall not be liable
        for any indirect, incidental, special, or consequential damages
        resulting from your use or inability to use our services.
      </p>

      <h2 data-aos="zoom-up">9. Termination</h2>
      <p data-aos="zoom-up">
        We reserve the right to suspend or terminate your account without prior
        notice if you violate these Terms or engage in behavior that harms our
        operations, users, or reputation.
      </p>

      <h2 data-aos="zoom-up">10. Amendments</h2>
      <p data-aos="zoom-up">
        We may update these Terms from time to time to reflect service
        improvements or legal requirements. We will notify users of material
        changes, and continued use of the service constitutes acceptance of the
        revised Terms.
      </p>

      <h2 data-aos="zoom-up">11. Governing Law</h2>
      <p data-aos="zoom-up">
        These Terms are governed by the laws of the Federal Republic of Nigeria.
        Any disputes shall be resolved in Nigerian courts under applicable
        jurisdiction.
      </p>

      <h2 data-aos="zoom-up">12. Contact Information</h2>
      <p data-aos="zoom-up">
        If you have questions about these Terms, you can contact us at:
        <br />
        <strong>Email:</strong> admin@bulkupdata.com

      </p>
    </div>
  );
};

export default TermsAndConditions;
