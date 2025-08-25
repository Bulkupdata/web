import { FaPhoneAlt, FaSignal, FaCreditCard } from "react-icons/fa";
import "./RechargeInstructions.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const instructions = [
  {
    icon: <FaPhoneAlt size={24} />,
    title: "Enter Multiple Numbers",
    description:
      "Add the phone numbers you want to recharge (family, friends, staff, etc.). The system automatically detects each number’s network.",
  },
  {
    icon: <FaSignal size={24} />,
    title: "Select Bundles or Airtime",
    description:
      "For Airtime: Pick one amount for all numbers or set different amounts individually. For Data: Choose the best bundle for each number.",
  },
  {
    icon: <FaCreditCard size={24} />,
    title: "Confirm & Send",
    description:
      "Review all numbers and bundles in one place. With a single transaction, everyone gets credited instantly.",
  },
];

const RechargeInstructions = () => {
  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <section className="recharge-section" data-aos="zoom-out">
      <section className="recharge-section-div">
        <h2 className="animated-header">How to Use BulkUp Feature</h2>
        <p className="page-description animated-description">
          Follow these quick steps to send airtime or data to multiple numbers at once. BulkUp makes it fast, easy to use, and stress-free.
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
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RechargeInstructions;