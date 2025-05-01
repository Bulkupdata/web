import React, { useState } from "react";
import "./AboutUs.css";
import whoImage from "../../assets/images/a.jpg";
import missionImage from "../../assets/images/b.jpg";
import visionImage from "../../assets/images/c.jpg";
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
            Join a Preloaded Pool. Get Your Data Instantly.
          </h3>
          <p>
            We’ve already funded the group data plan. Once you pay for your
            slot, we allocate your share immediately tagline: No waiting, No
            delays.{" "}
          </p>
          <p>
            No complicated processes, no unnecessary charges—just smarter data
            access designed to save you money and keep you connected longer.
          </p>

          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: 16,
                borderRadius: 48,
                border: "none",
                marginTop: 16,
                backgroundColor:'red'
              }}
              onClick={handleCtaClick}
            >
              Buy Data Now
            </button>
          </div>
        </div>
      </div>

      {/* CTA Button to Open Modal */}

      {/* Our Mission */}
      <div className="about-section-reverse">
        <div className="about-text">
          <h3 style={{ color: "#FFD000" }}>Affordable. Instant. Flexible.</h3>
          <p style={{ color: "#FFD000" }}>
            • <strong>Affordable Plans:</strong> Access mobile data at a
            fraction of standard network prices.
            <br />• <strong>No Waiting:</strong> Buy data and get it delivered
            instantly—no delays, no hassles.
            <br />• <strong>Flexible Options:</strong> Whether you prefer solo
            purchases or group pools, we’ve got you covered.
            <br />• <strong>Transparent System:</strong> What you see is what
            you get—no hidden fees, just value and clarity.
          </p>

          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: 16,
                borderRadius: 48,
                border: "none",
                marginTop: 24,
                backgroundColor:'red'
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
                backgroundColor:'red'
              }}
              onClick={handleCtaClick}
            >
              Buy Data Now
            </button>
          </div>

        </div>
      </div>

      <div
        className="about-section-reverse"
        style={{ backgroundColor: "#ff0000" }}
      >
        <div className="about-text">
          <h3 style={{ color: "#FFD000" }}>Affordable. Instant. Flexible.</h3>
          <p style={{ color: "#FFD000" }}>
            • <strong>Affordable Plans:</strong> Access mobile data at a
            fraction of standard network prices.
            <br />• <strong>No Waiting:</strong> Buy data and get it delivered
            instantly—no delays, no hassles.
            <br />• <strong>Flexible Options:</strong> Whether you prefer solo
            purchases or group pools, we’ve got you covered.
            <br />• <strong>Transparent System:</strong> What you see is what
            you get—no hidden fees, just value and clarity.
          </p>

          <div className="cta-container">
            <button
              className="cta-button"
              style={{
                padding: 16,
                borderRadius: 48,
                border: "none",
                marginTop: 16,
                backgroundColor:'#023009'
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

      {/* Modal */}
      <BuyDataModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default AboutUs;
