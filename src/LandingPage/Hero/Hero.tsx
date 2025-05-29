import { useTheme } from "../../contexts/ThemeContext";

import React, { useState } from "react";
import "./Hero.css";
import BuyDataModal from "../Modal/BuyDataModal";
import { FaArrowRight } from "react-icons/fa";
import mtnImg from "../../assets/images/mtn.png";
import airtelImg from "../../assets/images/airtel.jpeg";
import gloImg from "../../assets/images/glo.png";
import EtisalatImg from "../../assets/images/9mobile.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { selectedProvider, setSelectedProvider, theme } = useTheme();

  const providers = ["MTN", "Airtel", "Glo", "9mobile"];

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <div>
      <div
        className="hero"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
        }}
      >
        <div className="hero-content">
          <span
            data-aos="zoom-out"
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#fff",
              backgroundColor:
                selectedProvider === "Airtel"
                  ? "#ffffff32"
                  : selectedProvider === "MTN"
                  ? "#00000065"
                  : "#FFFFFF21",
              borderRadius: 400,
              padding: `12px 16px`,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🇳🇬 Swiftly topup Nigerian bundles <FaArrowRight />
          </span>

          <h1 style={{ marginTop: 8 }} data-aos="zoom-out">
            Get More Data, Pay Less with
            <span style={{ paddingLeft: 8 }}>
              <span style={{ color: theme.textColor }}>Bulk</span>
              <span style={{ color: theme.textColor }}>Up</span>
              <span style={{ color: theme.textColor }}>Data</span>
            </span>
          </h1>

          <p
            style={{ color: theme.textColor }}
            data-aos="zoom-out"
            className="hero-p"
          >
            Say goodbye to overpriced data plans. Join a smart, affordable way
            to access mobile data through shared bulk purchases. Instant.
            Seamless. Cost-effective.
          </p>

          <h3
            className="hero-content-tray-h3"
            style={{ color: theme.textColor, marginBottom: 12, marginTop: 48 }}
          >
            Choose a provider
          </h3>

          <div
            data-aos="zoom-out"
            className="provider-buttons-container"
            style={{ display: "flex", gap: "0", flexWrap: "wrap" }}
          >
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                style={{
                  backgroundColor: "transparent",
                  border:
                    selectedProvider === provider
                      ? provider === "MTN"
                        ? "2px solid #000"
                        : "1px solid #fff"
                      : "1px solid transparent",
                  borderRadius: "48px",
                  padding: `20px 7px`,
                  width: "fit-content",

                }}
              >
                <span
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "0.9rem 1rem",
                    fontWeight: "600",
                    borderRadius: "24px",
        
                  }}
                >
                  {provider}
                </span>
              </button>
            ))}
          </div>

          <div
            data-aos="zoom-out"
            style={{
              maxWidth: 550,
              maxHeight: selectedProvider ? "400px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.5s ease-in-out, padding 0.5s",
              backgroundColor:
                selectedProvider === "MTN"
                  ? "#000"
                  : selectedProvider === "Airtel"
                  ? "#121212"
                  : "#ffffff",
              color:
                selectedProvider === "Glo" || selectedProvider === "9mobile"
                  ? "#000"
                  : "#fff",
              marginTop: "2rem",
              padding: selectedProvider ? "16px" : "0",
              borderRadius: "12px",
              width: "100%", // ✅ ensures full width
              boxSizing: "border-box", // ✅ avo
            }}
          >
            {(() => {
              const bundles = [
                {
                  network: "MTN",
                  size: "5GB",
                  price: "₦300",
                  validity: "7 Days",
                  image: mtnImg,
                  description:
                    "MTN is Nigeria’s largest telecom operator with extensive coverage and reliable network quality. Their data bundles are diverse, ranging from daily to monthly plans, often bundled with voice and SMS packages. MTN is known for fast internet speeds and innovative offers like social media bundles and rollover data.",
                },
                {
                  network: "Airtel",
                  size: "10GB",
                  price: "₦300",
                  validity: "30 Days",
                  image: airtelImg,
                  description:
                    "Airtel Nigeria is a major competitor in the telecom market, popular for its competitive pricing and extensive nationwide coverage. Airtel’s bundles include varied data plans, social media bundles, and special night plans, appealing to a broad range of users. Their customer service and network reliability are highly rated.",
                },
                {
                  network: "Glo",
                  size: "10GB",
                  price: "₦300",
                  validity: "30 Days",
                  image: gloImg,
                  description:
                    "Glo stands out for its affordable data bundles and frequent promotional offers, such as unlimited night browsing and weekend data bonuses. It is recognized for its strong urban coverage and appealing data plan packages for heavy internet users. Glo also offers innovative services like the Glo Cafè Wi-Fi hotspots.",
                },
                {
                  network: "9mobile",
                  size: "10GB",
                  price: "₦300",
                  validity: "30 Days",
                  image: EtisalatImg,
                  description:
                    "9mobile, formerly Etisalat Nigeria, is known for quality customer support and value-packed data bundles. Their offerings include daily, weekly, and monthly data plans with competitive prices and attractive bonuses. 9mobile also provides innovative data options such as weekend data and social media packages.",
                },
              ];

              const selected = bundles.find(
                (b) =>
                  b.network.toLowerCase() === selectedProvider.toLowerCase()
              );

              if (!selected) return null;

              return (
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    flexWrap: "wrap",
                  }}
                  className="hero-content-tray"
                >
                  <img
                    src={selected.image}
                    alt={`${selected.network} logo`}
                    style={{
                      height: 48,
                      width: 48,
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                  <div>
                    <p className="hero-content-tray-p" style={{}}>
                      {selected.description}
                    </p>
                    <p
                      className="hero-content-tray-p"
                      style={{
                        marginTop: 16,
                        color: theme.backgroundColor,
                      }}
                    >
                      Starting from {selected.price}
                    </p>

                    <button
                      style={{
                        backgroundColor: theme.trayBackground,
                        color: theme.trayTextColor,
                        padding: 14,
                        width: "100%",
                        borderRadius: 36,
                        border: "none",
                        marginTop: 24,
                        fontWeight: 700,
                        fontSize: 17,
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      Buy Now
                    </button>
                    {/* <p style={{ margin: 0, fontWeight: 500 }}>
                      Validity: {selected.validity}
                    </p>
                    <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                      Enjoy affordable bulk data rates with {selected.network}.
                    </p> */}
                  </div>
                </div>
              );
            })()}
          </div>

          <BuyDataModal
            isOpen={showModal}
            themeMode={theme}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
