import { useState, useEffect, useMemo } from "react";
import "./BuyDataModal.css";
import Modal from "./Modal";
import { useTheme } from "../../contexts/ThemeContext";
import { airtimeBundles, dataBundles } from "./utils"; // Removed initialNetworks
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { autoDetectOperator } from "../../redux/Reloadly/Index";
import { v4 as uuidv4 } from "uuid";
import { BaseUrl, WebBaseUrl } from "../../redux/baseurl";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
  const [selectedCategory, setSelectedCategory] = useState("daily"); // Default to lowercase
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [operatorID, setOperatorID] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [operatorNickname, setOperatorNickname] = useState("");
  const [buyData, setBuyData] = useState(true);
  const [operatorLoading, setOperatorLoading] = useState(false);
  const [operatorlogoUrls, setOperatorlogoUrls] = useState("");

  const getCategoryFromPlanType = (planType: any) => {
    const lowerCasePlanType = planType.toLowerCase();
    if (
      lowerCasePlanType.includes("daily") ||
      lowerCasePlanType.includes("2 days")
    ) {
      return "Daily";
    }
    if (
      lowerCasePlanType.includes("weekly") ||
      lowerCasePlanType.includes("7 days")
    ) {
      return "Weekly";
    }
    if (
      lowerCasePlanType.includes("monthly") ||
      lowerCasePlanType.includes("30 days") ||
      lowerCasePlanType.includes("60 days")
    ) {
      return "Monthly";
    }
    if (
      lowerCasePlanType.includes("90 days") ||
      lowerCasePlanType.includes("365 days")
    ) {
      return "Yearly";
    }
    return "Other";
  };

  // Helper function to format category names
  const formatCategoryName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const filterBundles = (category: any, operatorNickname: any) => {
    if (!operatorNickname) return [];

    const normalizedNickname = operatorNickname.toLowerCase();
    const bundlesForNetwork = dataBundles.filter(
      (b) => b.network.toLowerCase() === normalizedNickname
    );

    return bundlesForNetwork.filter(
      (b) => getCategoryFromPlanType(b.planType) === category
    );
  };
  // Dynamically generate categories from the dataBundles based on the detected network
  const categories = useMemo(() => {
    if (!operatorNickname) return [];

    const allAvailablePlanTypes = new Set();
    dataBundles.forEach((b) => {
      if (b.network.toLowerCase() === operatorNickname.toLowerCase()) {
        allAvailablePlanTypes.add(getCategoryFromPlanType(b.planType));
      }
    });

    const orderedCategories = ["Daily", "Weekly", "Monthly", "Yearly"];
    const filteredCategories = orderedCategories.filter((cat) =>
      allAvailablePlanTypes.has(cat)
    );

    return filteredCategories;
  }, [operatorNickname, dataBundles]);
  useEffect(() => {
    // This effect runs when operatorNickname changes, ensuring categories are updated
    // and a valid default category is set.

    console.log(themeMode, "themeMode");
    if (operatorNickname && categories.length > 0) {
      // If the current selectedCategory is not in the new list of categories,
      // or if it's empty, set the first available category as default.
      if (
        !categories.includes(selectedCategory.toLowerCase()) ||
        selectedCategory === ""
      ) {
        setSelectedCategory(categories[0]);
      }
    } else if (!operatorNickname) {
      setSelectedCategory("daily"); // Reset to a default when no operator is detected
    }
  }, [operatorNickname, categories]); // Depend on operatorNickname and categories

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(themeMode, "daily,", "themeMode");

    setError("");
    let value = e.target.value;
    if (value.startsWith("+234")) {
      value = value.replace(/^\+234\s?/, "0");
    } else if (value.startsWith("234")) {
      value = value.replace(/^234/, "0");
    }
    setPhoneNumber(value);

    if (value.length >= 5) {
      // Trigger auto-detect after a few digits
      setOperatorLoading(true);
      dispatch(autoDetectOperator({ phone: value, countryCode: "+234" }))
        .unwrap()
        .then((res) => {
          console.log("✅ Auto detect success:", res);
          // This is the correct logic for setting the state
          const operatorData = res; // Use the entire response object

          const name = operatorData?.name || "";
          const ID = operatorData?.id || ""; // Set the ID from the response's 'id' field
          const nickname = name.toLowerCase().split(" ")[0]; // Correctly get the nickname
          const logoUrls = operatorData.logoUrls[0];

          setOperatorlogoUrls(logoUrls);
          setOperatorName(name);
          setOperatorID(ID); // This is where the ID is stored
          setOperatorNickname(nickname);
          setSelectedNetwork(nickname);
          setSelectedProvider(nickname);
          setSelectedBundle(null); // Reset selected bundle when network changes
        })
        .catch((err) => {
          console.error("❌ Auto detect error:", err);
          setError("Network error");
          setOperatorName("");
          setOperatorID("");
          setOperatorNickname("");
          setSelectedNetwork(""); // Reset selected network on error
          setSelectedBundle(null); // Reset selected bundle on error
        })
        .finally(() => {
          setOperatorLoading(false);
        });
    } else {
      setOperatorName("");
      setOperatorID("");
      setOperatorNickname("");
      setSelectedNetwork("");
      setSelectedBundle(null);
      setOperatorlogoUrls(""); // Clear logo
    }

    validatePhoneNumber(value);
  };

  const validatePhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\s+/g, "");
    const num = cleanedInput.startsWith("0")
      ? cleanedInput
      : `0${cleanedInput}`;

    const onlyDigits = /^\d+$/;

    if (!onlyDigits.test(num)) {
      setPhoneError("Only digits are allowed.");
      return false;
    }

    if (num.length > 11) {
      setPhoneError("Phone number cannot exceed 11 digits.");
      return false;
    }
    if (num.length < 11 && num.length > 0) {
      setPhoneError(`Must be 11 digits, ${11 - num.length} left`);
      return false;
    }

    setPhoneError("");
    return true;
  };

  if (!isOpen) return null;

  const handleBundleClick = (bundle: any) => {
    setSelectedBundle(bundle);
    console.log("Selected bundle:", bundle);
  };

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
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <p
            style={buyData ? activeStyle : inactiveStyle}
            onClick={() => {
              setBuyData(true);
              setSelectedBundle(null); // Clear selected bundle when switching type
            }}
          >
            Buy Data
          </p>

          <p
            style={!buyData ? activeStyle : inactiveStyle}
            onClick={() => {
              setBuyData(false);
              setSelectedBundle(null); // Clear selected bundle when switching type
            }}
          >
            Buy Airtime
          </p>
        </div>

        <div
          style={{
            backgroundColor: themeMode?.backgroundColor,
            padding: "16px",
            borderRadius: "8px",
            color: themeMode?.textColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: 24,
          }}
          onClick={() => navigate("/bulk-data")}
        >
          <h3 style={{ margin: 0, fontSize: 15 }}>Click to Buy Bulk</h3>
          <FaChevronRight />
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
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? themeMode?.backgroundColor
                            : "#f5f5f5",
                        color:
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? themeMode?.textColor
                            : "#000",
                        border: "none",
                        borderBottom:
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? "none"
                            : "none",
                      }}
                      className={`category-btn ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedBundle(null);
                      }}
                    >
                      {formatCategoryName(cat)}
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
                        key={bundle.id || index} // Use bundle.id for a stable key
                        style={{
                          backgroundColor:
                            selectedBundle?.id === bundle.id
                              ? "#000"
                              : "#f5f5f5",
                          color:
                            selectedBundle?.id === bundle.id ? "#fff" : "#000",
                          border: "none",
                        }}
                        className={`bundle-card ${
                          selectedBundle?.id === bundle.id ? "selected" : ""
                        }`}
                        onClick={() => handleBundleClick(bundle)}
                      >
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            marginTop: 10,
                          }}
                        >
                          {bundle.retailDataAmount}
                        </p>
                        <p
                          style={{
                            fontWeight: 500,
                            fontSize: 12,
                            marginTop: 10,
                          }}
                        >
                          ₦
                          {bundle?.budPrice?.toLocaleString()?.toLowerCase()}
                        </p>
                        <p style={{ fontSize: 10, marginTop: 6 }}>
                          {formatCategoryName(bundle.planType)}
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
                    {airtime?.amount?.toLocaleString()?.toLowerCase()}
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

              if (!operatorID || !selectedBundle) {
                alert("Please select a network and a data bundle.");
                return;
              }

              try {
                console.log(selectedBundle, "selectedBundle");
                const timestamp = Date.now();
                const itemId = `${uuidv4()}_${timestamp}`; // Generate a new unique ID

                // Create the payload for the current transaction
                const topupPayload = {
                  id: itemId,
                  operatorId: selectedBundle?.operatorId ?? operatorID,
                  retailDataAmount: selectedBundle?.retailDataAmount,
                  budPrice:
                    selectedBundle?.budPrice ?? selectedBundle?.price,
                  operatorNickname,
                  amount: buyData
                    ? selectedBundle.planAmount
                    : selectedBundle.fixedPrice,
                  useLocalAmount: true,
                  customIdentifier: itemId,
                  recipientEmail: "bulkupdata@gmail.com",
                  recipientPhone: {
                    countryCode: "NG",
                    number: phoneNumber,
                  },
                  senderPhone: {
                    countryCode: "NG",
                    number: phoneNumber,
                  },
                  batchId: `${uuidv4()}_${timestamp}`,
                  status: "pending",
                  planType: selectedBundle?.planType,
                };
                console.log("Operator ID:", selectedBundle.planType);
                console.log("Operator Nickname:", operatorNickname);

                const storedPayloads = JSON.parse(
                  localStorage.getItem("topupPayloads") || "[]"
                );

                const existingItemIndex = storedPayloads.findIndex(
                  (item: any) =>
                    item.recipientPhone.number === phoneNumber &&
                    item.planType === selectedBundle.planType
                );

                if (existingItemIndex !== -1) {
                  console.log(
                    "✅ Updating existing topupPayload in localStorage."
                  );
                  storedPayloads[existingItemIndex] = topupPayload;
                } else {
                  console.log("✅ Adding new topupPayload to localStorage.");
                  storedPayloads.push(topupPayload);
                }

                localStorage.setItem(
                  "topupPayloads",
                  JSON.stringify(storedPayloads)
                );

                setLoading(true);

                const response = await axios.post(
                  `${BaseUrl}/api/reloadly/create-paystack-payment`,
                  {
                    email: "bulkupdata@gmail.com",
                    amount: buyData
                      ? selectedBundle.budPrice
                      : selectedBundle.price,
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
            {loading ? "Processing..." : `Buy ${buyData ? "Data" : "Airtime"}`}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default BuyDataModal;
