import { FaPhoneAlt, FaSignal, FaCreditCard } from "react-icons/fa";
import "./RechargeInstructions.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const instructions = [
  {
    icon: <FaPhoneAlt size={24} />,
    title: "Enter Your Number",
    shortDescription: "Input your valid phone number to start.",
    description:
      "Ensure your phone number is exactly 11 digits and starts with a 0. For example, 08012345678. This is important so your data gets credited correctly.",
  },
  {
    icon: <FaSignal size={24} />,
    title: "Choose Network & Data Bundle",
    description:
      "Select your mobile network provider (MTN, Airtel, Glo, or 9mobile). Then choose from available data bundles that fit your usage needs and budget.",
  },
  {
    icon: <FaCreditCard size={24} />,
    title: "Confirm & Purchase",
    description:
      "Review your selected phone number, network, and data bundle carefully. Once confirmed, click 'Buy Data' to complete your purchase securely.",
  },
];

const RechargeInstructions = () => {
  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <section className="recharge-section" data-aos="zoom-out">
      <section className="recharge-section-div">
        <h2 className="animated-header">How to Recharge Your Data</h2>
        <p className="page-description animated-description">
          Follow these simple steps to quickly recharge your mobile data. Make
          sure to enter your phone number correctly and choose the best data
          bundle for your needs.
        </p>
      </section>
      <br />
      <br />
      <div className="cards-container">
        {instructions.map((step, i) => (
          <div key={i} className="instruction-card" data-aos="fade-up">
            <div className="icon-container">{step.icon}</div>
            <div>
              <h3>{step.title}</h3>
              <br />
              {i === 0 && (
                <>
                  <p>{step.description}</p>
                </>
              )}
              {i !== 0 && <p>{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RechargeInstructions;
