import React, { useState } from "react";
import "./Hero.css";
//import libraryImg from "../../assets/images/donny.jpg";
import BuyDataModal from "../Modal/BuyDataModal";

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div
        className="hero"
        style={{
          //backgroundImage: `url(${libraryImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          width: "100vw",
          flexDirection: "column",
          backgroundColor: "#3F3C3C",
        }}
      >
        <div
          className="hero-content"
          style={{
            backgroundColor: "#",
          }}
        >
          <h1>
            Get More Data, Pay Less with
            <span style={{ paddingLeft: 8, paddingRight: 0 }}>
              <span style={{ color: "red" }}>Bulk</span>
              <span style={{ color: "yellow" }}>Up</span>
              <span style={{ color: "green" }}>Data</span>
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
