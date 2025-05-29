import { useState, useEffect } from "react";
import "./BuyDataModal.css";
import Modal from "./Modal";
import { useTheme } from "../../contexts/ThemeContext";
import {
  airtimeBundles,
  categories,
  dataBundles,
  networks as initialNetworks,
} from "./utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { autoDetectOperator } from "../../redux/Reloadly/Index";
import { v4 as uuidv4 } from "uuid";
import { BaseUrl, WebBaseUrl } from "../../redux/baseurl";
import axios from "axios";

// interface Network {
//   operatorId: number;
//   name: string;
//   nickname: string;
// }

const BuyDataModal = ({
  onClose,
  isOpen,
  themeMode,
}: {
  onClose: () => void;
  isOpen: boolean;
  themeMode?: any;
}) => {
  const { setSelectedProvider } = useTheme();
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Daily");
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  //const [networksState, setNetworksState] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const [operatorID, setOperatorID] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [operatorNickname, setOperatorNickname] = useState(""); //Airtel
  const [airtelData, setAirtelData] = useState("1256");
  const [MTNData, setMTNData] = useState("346");

  // const [gloData, setGloData] = useState("1256");
  // const [mobileData, set9mobileData] = useState("1256");

  //1256
  const [buyData, setBuyData] = useState(true);
  const [operatorLoading, setOperatorLoading] = useState(false); // 👈 loading state
  const [operatorlogoUrls, setOperatorlogoUrls] = useState("");
  //logoUrls
  console.log(operatorID, operatorName, operatorNickname, "operatorNickname");

  useEffect(() => {
    setMTNData("346");
    setAirtelData("1256");
    setBuyData(true);
    const processedNetworks = initialNetworks.map((net) => ({
      operatorId: net.id,
      name: net.name,
      nickname: net.nickname || net.name.toLowerCase(),
    }));
    console.log(processedNetworks, "processedNetworks");
    //setNetworksState(processedNetworks as any);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    let value = e.target.value;
    if (value.startsWith("+234")) {
      value = value.replace(/^\+234\s?/, "0");
    } else if (value.startsWith("234")) {
      value = value.replace(/^234/, "0");
    }
    setPhoneNumber(value);

    const isValid = validatePhoneNumber(value);

    if (isValid) {
      setOperatorLoading(true);
      dispatch(autoDetectOperator({ phone: value, countryCode: "+234" }))
        .unwrap()
        .then((res) => {
          console.log("✅ Auto detect success:", res);
          const name = res?.name || "";
          const ID = res?.operatorId || "";
          const nickname = name.split(" ")[0];
          const logoUrls = res.logoUrls[0];

          setOperatorlogoUrls(logoUrls);
          setOperatorName(name);
          setOperatorID(ID);
          setOperatorNickname(nickname);
          setSelectedNetwork(nickname);
          setSelectedProvider(nickname);
        })
        .catch((err) => {
          console.error("❌ Auto detect error:", err);
          setError("Network error");
          setOperatorName("");
          setOperatorID("");
          setOperatorNickname("");
        })
        .finally(() => {
          setOperatorLoading(false);
        });
    }
  };

  const validatePhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\s+/g, "");
    let num = cleanedInput.startsWith("+234")
      ? cleanedInput.slice(4)
      : cleanedInput;

    const onlyDigits = /^\d*$/;

    if (!onlyDigits.test(num)) {
      setPhoneError("Only digits are allowed.");
      return false;
    }

    if (num?.startsWith("0")) {
      if (num?.length > 11) {
        setPhoneError("Phone number cannot exceed 11 digits.");
        return false;
      }
      if (num?.length < 11) {
        setPhoneError(`Must be 11 digits, ${11 - num?.length} left`);
        return false;
      }
    } else {
      if (num?.length > 10) {
        setPhoneError("Phone number cannot exceed 10 digits.");
        return false;
      }
      if (num?.length < 10) {
        setPhoneError(`Must be 10 digits, ${10 - num?.length} left`);
        return false;
      }
    }

    setPhoneError("");
    return true;
  };

  if (!isOpen) return null;

  const filterBundles = (category: string, operatorNickname: string) => {
    // Return no bundles if operatorNickname is falsy (null, undefined, or empty string)
    if (!operatorNickname) return [];

    const allBundles = dataBundles.filter(
      (b) => b.network === operatorNickname
    );

    if (category === "Daily")
      return allBundles.filter(
        (b) =>
          b.validity.includes("day") &&
          (b.validity.includes("1") ||
            b.validity.includes("2") ||
            b.validity.includes("3"))
      );

    if (category === "Weekly")
      return allBundles.filter((b) => b.validity === "1 week");

    if (category === "Two Weeks")
      return allBundles.filter((b) => b.validity === "2 weeks");

    if (category === "Monthly")
      return allBundles.filter((b) => b.validity === "30 days");

    if (category === "60 Days")
      return allBundles.filter((b) => b.validity === "60 days");

    return [];
  };

  const handleBundleClick = (bundle: any) => {
    setSelectedBundle(bundle);
    console.log("Selected bundle:", bundle);
  };
  console.log("Selected selectedNetwork:", selectedNetwork);

  const activeStyle = {
    color: "#000",
    borderBottom: "4px solid #000000",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    fontWeight: 900,
    fontSize: 14,
  };

  const inactiveStyle = {
    color: "gray",
    borderBottom: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    fontSize: 14,
  };

  return (
    <Modal onClose={onClose}>
      <div className={`modal ${selectedNetwork}`}>
        {/* <button className="close-button" onClick={onClose}>
          Cancel
        </button> */}

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <p
            style={buyData ? activeStyle : inactiveStyle}
            onClick={() => setBuyData(true)}
          >
            Buy Data
          </p>

          <p
            style={!buyData ? activeStyle : inactiveStyle}
            onClick={() => setBuyData(false)}
          >
            Buy Airtime
          </p>
        </div>

        <label htmlFor="phone" style={{ fontSize: 13, marginTop: 10 }}>
          Phone Number
        </label>
        <div className="phone-input-wrapper">
          <div className="country-code">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="16"
              viewBox="0 0 24 16"
              style={{
                marginRight: 4,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <rect width="24" height="16" fill="#008751" />
              <rect x="8" width="8" height="16" fill="#fff" />
            </svg>
            <span>+234</span>
          </div>
          <input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="phone-input"
          />
        </div>
        {(phoneError || error) && (
          <p
            style={{
              color: "red",
              fontSize: 13,
              marginTop: 4,
              fontWeight: 700,
              backgroundColor: "#ff000020",
              width: "fit-content",
              padding: `10px 12px`,
              borderRadius: 24,
            }}
          >
            {phoneError || error}
          </p>
        )}

        {operatorName.trim() === "" && !operatorLoading ? null : (
          <div>
            {operatorLoading ? (
              <div className="loader" />
            ) : (
              <>
                <label
                  htmlFor="network"
                  style={{ fontSize: 13, marginTop: 20 }}
                >
                  Network
                </label>
                <div className="new-div-networks">
                  <img
                    src={operatorlogoUrls}
                    alt="operatorlogoUrls"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                    }}
                  />
                  <span>{operatorName || "N/A"}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* <select
          id="network"
          value={selectedNetwork}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedNetwork(val);
            setSelectedProvider(val);
          }}
        >
          <option value="">Select a network</option>
          {networksState.map((net) => (
            <option key={net.operatorId} value={net.name}>
              {net.name}
            </option>
          ))}
        </select> */}

        {buyData ? (
          operatorNickname?.trim() && (
            <>
              <div>
                <label style={{ fontSize: 13, marginTop: 20 }}>
                  Choose Bundle Category
                </label>
                <div className="category-toggle">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      style={{
                        backgroundColor:
                          selectedCategory === cat
                            ? themeMode?.backgroundColor
                            : "#f5f5f5",
                        color:
                          selectedCategory === cat
                            ? themeMode?.textColor
                            : "#000",
                        border: "none",
                        borderBottom:
                          selectedCategory === cat ? "none" : "none",
                      }}
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
                <label style={{ fontSize: 13, marginTop: 20 }}>
                  Select Data Bundle
                </label>
                <div className="bundle-grid">
                  {filterBundles(selectedCategory, operatorNickname).map(
                    (bundle, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            selectedBundle?.size === bundle.size
                              ? "#000"
                              : "#f5f5f5",
                          color:
                            selectedBundle?.size === bundle.size
                              ? "#fff"
                              : "#000",
                          border: "none",
                        }}
                        className={`bundle-card ${
                          selectedBundle?.size === bundle.size ? "selected" : ""
                        }`}
                        onClick={() => handleBundleClick(bundle)}
                      >
                        <p style={{ fontWeight: 700, fontSize: 16 }}>
                          {bundle.size}
                        </p>
                        <p>₦{bundle.price}</p>
                        <p style={{ fontSize: 10, marginTop: 6 }}>
                          {bundle.validity}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <div>
              <label style={{ fontSize: 13, marginTop: 20 }}>
                Choose Airtime Amount
              </label>
              <div className="category-toggle">
                {airtimeBundles.map((airtime) => (
                  <button
                    key={airtime.amount}
                    style={{
                      backgroundColor:
                        selectedBundle?.amount === airtime.amount
                          ? themeMode?.backgroundColor
                          : "#f5f5f5",
                      color:
                        selectedBundle?.amount === airtime.amount
                          ? themeMode?.textColor
                          : "#000",
                      border: "none",
                      borderBottom:
                        selectedBundle?.amount === airtime.amount
                          ? "none"
                          : "none",
                    }}
                    className={`category-btn ${
                      selectedBundle?.amount === airtime.amount ? "active" : ""
                    }`}
                    onClick={() => setSelectedBundle(airtime)}
                  >
                    {airtime.amount}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedBundle && operatorNickname?.trim() && (
          <button
            style={{
              backgroundColor: themeMode?.backgroundColor,
              color: themeMode?.textColor,
              marginTop: 20,
            }}
            className="buy-button"
            onClick={async () => {
              console.log(selectedBundle, "selectedBundle");
              if (!phoneNumber) {
                alert("Please enter your phone number.");
                return;
              }

              if (!selectedNetwork || !selectedBundle) {
                alert("Please select a network and a data bundle.");
                return;
              }

              try {
                // Display confirmation
                // alert(
                //   `Buying ${selectedBundle.size} for ₦${
                //     selectedBundle.price
                //   } on ${selectedNetwork.toUpperCase()} to phone +234${phoneNumber}`
                // );

                const timestamp = Date.now();
                const customId = `${uuidv4()}_${timestamp}`;

                let operatorId;

                if (buyData) {
                  console.log("buyData is true");
                  if (operatorNickname === "Airtel") {
                    console.log("Operator is Airtel. Using airtelData.");
                    operatorId = airtelData;
                  } else if (operatorNickname === "MTN") {
                    console.log("Operator is MTN. Using MTNData.");
                    operatorId = MTNData;
                  } else {
                    console.log(
                      `Operator is ${operatorNickname}. Using fallback operatorID.`
                    );
                    operatorId = operatorID;
                  }
                } else {
                  console.log("buyData is false. Using operatorID.");
                  operatorId = operatorID;
                }
                console.log("Final operatorId:", operatorId);

                const topupPayload = {
                  operatorId,
                  amount: selectedBundle?.fixedPrice,
                  //amountNew: selectedBundle.fixedPrice.toFixed(2),
                  useLocalAmount: true,
                  customIdentifier: customId,
                  recipientEmail: "ceo@lukasdesignlab.com",
                  recipientPhone: {
                    countryCode: "NG",
                    number: phoneNumber,
                  },
                  senderPhone: {
                    countryCode: "NG",
                    number: phoneNumber,
                  },
                };

                const existingTopup = localStorage.getItem("topupPayload");
                if (existingTopup) {
                  console.log("⚠️ topupPayload already exists. Updating...");
                } else {
                  console.log("✅ Storing new topupPayload to localStorage.");
                }
                localStorage.setItem(
                  "topupPayload",
                  JSON.stringify(topupPayload)
                );

                setLoading(true);

                const response = await axios.post(
                  `${BaseUrl}/api/reloadly/create-paystack-payment`,
                  {
                    email: "bulkupdata@gmail.com",
                    amount: selectedBundle.price, // Naira
                    callback_url: `${WebBaseUrl}/payment-success`,
                    currency: "NGN",
                  }
                );

                const { checkout_url } = response.data;
                window.location.href = checkout_url;
              } catch (err: any) {
                console.error("Payment initiation failed:", err);
                setError(err.response?.data?.error || "Something went wrong.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Processing..." : "Buy Data"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default BuyDataModal;
