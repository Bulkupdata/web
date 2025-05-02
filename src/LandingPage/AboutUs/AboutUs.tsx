import React, { useState } from "react";
import "./AboutUs.css";
import whoImage from "../../assets/images/sectiona.jpg";
import missionImage from "../../assets/images/section.jpg";
import visionImage from "../../assets/images/sectionb.png";
import BuyDataModal from "../Modal/BuyDataModal";

interface AboutUsProps {
  showCta?: boolean;
}

const AboutUs: React.FC<AboutUsProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCtaClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="about-page">
      {/* Who We Are */}
      <div className="about-section">
        <div className="about-image">
          <img src={whoImage} alt="About BulkUpData" />
        </div>
        <div className="about-text">
          <h3 style={{ color: "#023009" }}>
            Instant Data, Zero Hassle. Join a Preloaded Pool Today.
          </h3>
          <p>
            We’ve already paid for the group data plan, so you don’t have to
            wait. Just grab your slot, and your data is delivered instantly.
          </p>
          <br />
          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: `24px 26px`,
                borderRadius: 48,
                border: "none",
                marginTop: 16,
                backgroundColor: "red",
                color: "white",
                fontSize: 17,
              }}
              onClick={handleCtaClick}
            >
              Join the Pool Now
            </button>
          </div>
        </div>
      </div>

      {/* CTA Button to Open Modal */}

      {/* Our Mission */}
      <div className="about-section-reverse">
        <div className="about-text">
          <h3 style={{ color: "#fff" }}>Affordable. Instant. Flexible.</h3>
          <p style={{ color: "#fff" }}>
            • <strong>Affordable Plans:</strong> Access mobile data at a
            fraction of standard network prices.
            <br /> <br />• <strong>No Waiting:</strong> Buy data and get it
            delivered instantly—no delays, no hassles.
            <br /> <br />• <strong>Flexible Options:</strong> Whether you prefer
            solo purchases or group pools, we’ve got you covered.
            <br /> <br />• <strong>Transparent System:</strong> What you see is
            what you get—no hidden fees, just value and clarity.
          </p>

          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: `24px 26px`,
                borderRadius: 48,
                border: "none",
                marginTop: 24,
                backgroundColor: "#000",
                color: "white",
                fontSize: 17,
              }}
              onClick={handleCtaClick}
            >
              Buy Data Now
            </button>
          </div>
        </div>
        <div className="about-image">
          <img src={missionImage} alt="Our Mission" />
        </div>
      </div>

      {/* Our Vision */}
      <div className="about-section">
        <div className="about-image">
          <img src={visionImage} alt="Our Vision" />
        </div>
        <div className="about-text">
          <h3 style={{ color: "#023009" }}>Data That Works for Everyone</h3>
          <p>
            We believe access to affordable data shouldn’t be a privilege—it
            should be a standard. That’s why BulkUpData is built for everyone:
            from students trying to stay on top of their classes, to
            entrepreneurs growing businesses online, to families trying to
            stretch their data budget.
          </p>
          <p>
            Our vision is to become the go-to solution for smart, accessible,
            and reliable mobile data in Africa—helping people stay connected to
            the things that matter most.
          </p>

          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: 16,
                borderRadius: 48,
                border: "none",
                marginTop: 16,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={handleCtaClick}
            >
              Buy Data Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BuyDataModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default AboutUs;
