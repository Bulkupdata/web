import React, { useState } from "react";
import "./Hero.css";
import libraryImg from "../../assets/images/home.jpg";
import BuyDataModal from "../Modal/BuyDataModal";

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div
        className="hero"
        style={{
          backgroundImage: `url(${libraryImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          width: "100vw",
          flexDirection: "column",
        }}
      >
        <div className="hero-content">
          <h1>
            Get More Data, Pay Less with
            <span style={{ color: "#FFD000", paddingLeft: 8, paddingRight: 0 }}>
              BulkUpData
            </span>
          </h1>
          <p>
            Say goodbye to overpriced data plans. Join a smart, affordable way
            to access mobile data through shared bulk purchases. Instant.
            Seamless. Cost-effective.
          </p>

          {/* CTA Button */}
          <div style={{ marginTop: "2rem" }}>
            <button
              className="buy-data-button"
              style={{
                backgroundColor: "#FFD000",
                color: "#000",
                padding: "1rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "none",
              }}
              onClick={() => setShowModal(true)}
            >
              Buy Data Now
            </button>
          </div>

          <BuyDataModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
