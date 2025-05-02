import React, { useState } from "react";
import "./DataPlans.css";

// Import sample images
import mtnImg from "../../assets/images/mtn.png";
import airtelImg from "../../assets/images/airtel.jpeg";
import gloImg from "../../assets/images/glo.png";
import EtisalatImg from "../../assets/images/9mobile.png";

const livePoolData = [
  {
    network: "MTN",
    poolSize: "100GB",
    slotSize: "10GB",
    price: "₦1,700",
    slotsLeft: "4/10",
    image: mtnImg,
  },
  {
    network: "Airtel",
    poolSize: "50GB",
    slotSize: "5GB",
    price: "₦1,000",
    slotsLeft: "7/10",
    image: airtelImg,
  },
  {
    network: "Glo",
    poolSize: "200GB",
    slotSize: "20GB",
    price: "₦2,900",
    slotsLeft: "10/20",
    image: gloImg,
  },
  {
    network: "9 Mobile",
    poolSize: "200GB",
    slotSize: "20GB",
    price: "₦2,900",
    slotsLeft: "10/20",
    image: EtisalatImg,
  },
];

const soloData = [
  {
    network: "MTN",
    size: "5GB",
    price: "₦1,500",
    validity: "7 Days",
    image: mtnImg,
  },
  {
    network: "Airtel",
    size: "10GB",
    price: "₦2,800",
    validity: "30 Days",
    image: airtelImg,
  },
  {
    network: "Glo",
    size: "10GB",
    price: "₦2,800",
    validity: "30 Days",
    image: gloImg,
  },

  {
    network: "9 Mobile",
    size: "10GB",
    price: "₦2,800",
    validity: "30 Days",
    image: EtisalatImg,
  },
];

const DataPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pool" | "solo">("pool");

  return (
    <div className="data-plans-container">
      <div className="tabs">
        <button
          className={activeTab === "pool" ? "active" : ""}
          onClick={() => setActiveTab("pool")}
        >
          Live Pool Table
        </button>
        <button
          className={activeTab === "solo" ? "active" : ""}
          onClick={() => setActiveTab("solo")}
        >
          Want to Go Solo?
        </button>
      </div>

      {activeTab === "pool" && (
        <div className="card-grid">
          {livePoolData.map((plan, idx) => (
            <div className="plan-card" key={idx}>
              <img
                src={plan.image}
                alt={plan.network}
                className="network-logo"
              />
              <h4>{plan.network}</h4>
              <p>
                <strong>Pool Size:</strong> {plan.poolSize}
              </p>
              <p>
                <strong>Slot Size:</strong> {plan.slotSize}
              </p>
              <p>
                <strong>Price:</strong> {plan.price}
              </p>
              <button className="action-btn">Claim My Data</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "solo" && (
        <div className="card-grid">
          {soloData.map((plan, idx) => (
            <div className="plan-card" key={idx}>
              <img
                src={plan.image}
                alt={plan.network}
                className="network-logo"
              />
              <h4>{plan.network}</h4>
              <p>
                <strong>Size:</strong> {plan.size}
              </p>
              <p>
                <strong>Price:</strong> {plan.price}
              </p>
              <p>
                <strong>Validity:</strong> {plan.validity}
              </p>
              <button className="action-btn">Buy Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPlans;
