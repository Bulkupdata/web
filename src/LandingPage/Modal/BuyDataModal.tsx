import { useState } from "react";
import "./BuyDataModal.css";

const networks = [
  { id: "mtn", name: "MTN" },
  { id: "airtel", name: "AIRTEL" },
  { id: "glo", name: "GLO" },
  { id: "etisalat", name: "ETISALAT" },
];

const dataBundles = [
  { size: "1GB", price: 250, validity: "30 days" },
  { size: "2GB", price: 450, validity: "3 days" },
  { size: "3GB", price: 650, validity: "3 days" },
  { size: "3GB", price: 650, validity: "1 week" },
  { size: "5GB", price: 1000, validity: "1 week" },
  { size: "7GB", price: 1300, validity: "1 week" },
  { size: "10GB", price: 1800, validity: "1 week" },
  { size: "15GB", price: 2500, validity: "1 week" },
  { size: "20GB", price: 3000, validity: "1 week" },
  { size: "25GB", price: 3500, validity: "1 week" },
  { size: "5GB", price: 1000, validity: "2 weeks" },
  { size: "7GB", price: 1300, validity: "2 weeks" },
  { size: "10GB", price: 1800, validity: "2 weeks" },
  { size: "15GB", price: 2500, validity: "2 weeks" },
  { size: "20GB", price: 3000, validity: "2 weeks" },
  { size: "25GB", price: 3500, validity: "2 weeks" },
  { size: "50GB", price: 6000, validity: "30 days" },
  { size: "100GB", price: 11000, validity: "30 days" },
  { size: "125GB", price: 13000, validity: "30 days" },
  { size: "150GB", price: 15000, validity: "30 days" },
  { size: "200GB", price: 20000, validity: "30 days" },
  { size: "250GB", price: 24000, validity: "30 days" },
  { size: "500GB", price: 45000, validity: "60 days" },
  { size: "750GB", price: 60000, validity: "60 days" },
  { size: "1TB", price: 80000, validity: "60 days" },
];

const categories = ["Daily", "Weekly", "Two Weeks", "Monthly", "60 Days"];

const BuyDataModal = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Daily");
  const [selectedBundle, setSelectedBundle] = useState<any>(null);

  if (!isOpen) return null;

  const filterBundles = (category: string) => {
    if (category === "Daily")
      return dataBundles.filter(
        (b) =>
          b.validity.includes("day") &&
          (b.validity.includes("1") ||
            b.validity.includes("2") ||
            b.validity.includes("3"))
      );
    if (category === "Weekly")
      return dataBundles.filter((b) => b.validity === "1 week");
    if (category === "Two Weeks")
      return dataBundles.filter((b) => b.validity === "2 weeks");
    if (category === "Monthly")
      return dataBundles.filter((b) => b.validity === "30 days");
    if (category === "60 Days")
      return dataBundles.filter((b) => b.validity === "60 days");
    return [];
  };

  const handleBundleClick = (bundle: any) => {
    setSelectedBundle(bundle);
    console.log("Selected bundle:", bundle);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className={`modal ${selectedNetwork}`}>
        <h2>Buy Data</h2>

        <label htmlFor="network">Choose Network</label>
        <select
          id="network"
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
        >
          <option value="">Select a network</option>
          {networks.map((net) => (
            <option key={net.id} value={net.id}>
              {net.name}
            </option>
          ))}
        </select>

        <div>
          <label>Choose Bundle Category</label>
          <div className="category-toggle">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedBundle(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label>Select Data Bundle</label>
          <div className="bundle-grid">
            {filterBundles(selectedCategory).map((bundle, index) => (
              <div
                key={index}
                className={`bundle-card ${
                  selectedBundle?.size === bundle.size ? "selected" : ""
                }`}
                onClick={() => handleBundleClick(bundle)}
              >
                <p
                  style={{
                    textAlign: "center",
                    //       backgroundColor: "red",
                    alignSelf: "center",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {bundle.size}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    //       backgroundColor: "red",
                    alignSelf: "center",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  ₦{bundle.price}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    //       backgroundColor: "red",
                    alignSelf: "center",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {bundle.validity}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="buy-button"
          onClick={() => {
            if (selectedNetwork && selectedBundle) {
              alert(
                `Buying ${selectedBundle.size} for ₦${
                  selectedBundle.price
                } on ${selectedNetwork.toUpperCase()}`
              );
            } else {
              alert("Please select a network and a data bundle.");
            }
          }}
        >
          Buy Data
        </button>

        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyDataModal;
