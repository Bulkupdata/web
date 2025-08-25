import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dataBundles, airtimeBundles } from "./utils";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { autoDetectOperatorGroup } from "../../redux/Reloadly/Index";
import { AppDispatch } from "../../redux/store";
import "./BulkPurchasePage.css";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

interface Network {
  id: string;
  name: string;
  nickname: string;
  logoUrls: any;
}

interface DataBundle {
  id: string;
  network: string;
  budDataAmount: string;
  retailPrice: number;
  description: string;
  operatorId: number;
  planType: string;
  logoUrls?: any;
}

interface AirtimeBundle {
  amount: string;
  price: number;
  fixedPrice: number;
  id?: any;
  retailPrice?: any;
  logoUrls?: any;
  network?: any;
}

const categories = ["Daily", "Weekly", "Monthly", "90 days", "365 days"];
const ITEM_PLATFORM_FEE = 950;

const BulkPaymentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isData, setIsData] = useState(true);
  const [bulkInput, setBulkInput] = useState("");
  const [detectedNumbers, setDetectedNumbers] = useState<
    {
      id: string;
      number: string;
      detectedNetwork: Network;
      selectedBundle?: DataBundle | AirtimeBundle;
      operatorId?: any;
      selectedCategory: string;
      logoUrls?: any;
    }[]
  >([]);
  const [invalidNumbers, setInvalidNumbers] = useState<
    { id: string; number: string; error: string; isEditing: boolean }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
  const [allNumbersBundle, setAllNumbersBundle] =
    useState<AirtimeBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSamePrice, setIsSamePrice] = useState(false);

  const updateTotalPrice = (numbers: typeof detectedNumbers) => {
    const total = numbers.reduce((sum, current) => {
      const price = current.selectedBundle
        ? isData
          ? (current.selectedBundle as DataBundle).retailPrice
          : (current.selectedBundle as AirtimeBundle).price
        : 0;
      return sum + price;
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    updateTotalPrice(detectedNumbers);
  }, [detectedNumbers, isData]);

  const getNetworkBundles = (networkName: string, category: string) => {
    if (!isData) {
      return airtimeBundles.map((bundle) => ({
        ...bundle,
        network: networkName,
      }));
    }
    const getPlanType = (categoryName: string) => {
      switch (categoryName) {
        case "Daily":
          return ["daily", "2 days"];
        case "Weekly":
          return ["weekly", "7 days"];
        case "Monthly":
          return ["monthly", "30 days"];
        case "90 days":
          return ["90 days"];
        case "365 days":
          return ["365 days"];
        default:
          return ["daily", "2 days"];
      }
    };
    const planTypes = getPlanType(category);
    return dataBundles.filter(
      (bundle) =>
        networkName.toLowerCase().includes(bundle.network.toLowerCase()) &&
        planTypes.includes(bundle.planType.toLowerCase())
    );
  };

  const handleBulkInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBulkInput(value);
  };

  const deleteNumber = (id: string, isInvalid: boolean) => {
    if (isInvalid) {
      setInvalidNumbers((prev) => prev.filter((item) => item.id !== id));
    } else {
      const updatedNumbers = detectedNumbers.filter((item) => item.id !== id);
      setDetectedNumbers(updatedNumbers);
      updateTotalPrice(updatedNumbers);
    }
  };

  const handleBundleSelect = (
    numberId: string,
    bundle: DataBundle | AirtimeBundle
  ) => {
    const updatedNumbers = detectedNumbers.map((num) =>
      num.id === numberId ? { ...num, selectedBundle: bundle } : num
    );
    setDetectedNumbers(updatedNumbers);
  };

  const handleAllNumbersBundleSelect = (
    bundle: AirtimeBundle,
    numbersToUpdate = detectedNumbers
  ) => {
    setAllNumbersBundle(bundle);
    const updatedNumbers = numbersToUpdate.map((num) => ({
      ...num,
      selectedBundle: bundle,
    }));
    setDetectedNumbers(updatedNumbers);
  };

  const handleCategorySelect = (numberId: string, category: string) => {
    setDetectedNumbers((prev) =>
      prev.map((item) => {
        if (item.id === numberId && item.selectedCategory !== category) {
          return {
            ...item,
            selectedCategory: category,
            selectedBundle: undefined,
          };
        }
        return item;
      })
    );
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const navigate = useNavigate();

  const handlePay = () => {
    const newList = detectedNumbers
      .map((item) => {
        const buyData = isData;
        const selectedBundle = item.selectedBundle;
        const customId = uuidv4();
        const phoneNumber = item.number;
        if (!selectedBundle) {
          return null;
        }
        return {
          logoUrls: item?.logoUrls,
          network: selectedBundle?.network,
          operatorId: item?.operatorId,
          amount: buyData
            ? (selectedBundle as DataBundle).retailPrice
            : (selectedBundle as AirtimeBundle).fixedPrice,
          useLocalAmount: true,
          customIdentifier: customId,
          recipientEmail: "bulkupdata@gmail.com",
          recipientPhone: {
            countryCode: "NG",
            number: phoneNumber,
          },
          senderPhone: {
            countryCode: "NG",
            number: phoneNumber,
          },
          buyData: isData,
          type: isData ? "Data" : "Airtime",
          bundle: selectedBundle,
        };
      })
      .filter(Boolean);

    if (newList.length === 0) {
      alert("Please select a bundle for at least one number.");
      return;
    }

    const platformFee = newList.length * ITEM_PLATFORM_FEE;
    const totalWithFee = totalPrice + platformFee;

    navigate("/bulk-summary", {
      state: {
        purchaseList: newList,
        totalPrice: totalPrice,
        platformFee: platformFee,
        totalWithFee: totalWithFee,
      },
    });
  };

  const handleSubmitNumbers = async () => {
    setDetectedNumbers([]);
    setInvalidNumbers([]);
    const numbersToProcess = bulkInput
      .split(/[\s,;]+/)
      .map((num) => {
        let clean = num.trim();
        if (clean.startsWith("+234")) {
          clean = "0" + clean.slice(4);
        } else if (clean.startsWith("234")) {
          clean = "0" + clean.slice(3);
        }
        return clean;
      })
      .filter((num) => num.length === 11 && /^0\d{10}$/.test(num))
      .slice(0, 500); // FIX: Limited to 500 numbers

    if (numbersToProcess.length === 0) {
      alert("Please enter valid Nigerian phone numbers.");
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(
        autoDetectOperatorGroup({ phones: numbersToProcess, countryCode: "NG" })
      ).unwrap();

      const newDetectedNumbers: any[] = [];
      const newInvalidNumbers: any[] = [];
      response.results.forEach((res: any) => {
        const id = uuidv4();
        if (res.success) {
          const { data, phone } = res;
          const operator = data;
          const name = operator?.name || "";
          const nickname = name.toLowerCase().split(" ")[0];
          const logoUrls = operator?.logoUrls?.[0];
          const detectedNetwork = { id: nickname, name, nickname, logoUrls };
          const operatorId = operator?.operatorId || "";

          newDetectedNumbers.push({
            id,
            number: phone,
            detectedNetwork,
            selectedBundle: undefined,
            operatorId,
            selectedCategory: "Daily",
            logoUrls,
          });
        } else {
          const { phone, error } = res;
          newInvalidNumbers.push({
            id,
            number: phone,
            error: error || "Network not detected",
            isEditing: false,
          });
        }
      });

      setDetectedNumbers(newDetectedNumbers);
      setInvalidNumbers(newInvalidNumbers);
    } catch (error) {
      console.error("❌ Bulk auto-detect error:", error);
      alert("Failed to detect networks for all numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allBundlesSelected =
    isData || !isSamePrice
      ? detectedNumbers.every((num) => num.selectedBundle !== undefined)
      : !!allNumbersBundle;

  const handleToggleChange = (isDataToggle: boolean) => {
    setIsData(isDataToggle);
    setDetectedNumbers([]);
    setInvalidNumbers([]);
    setBulkInput("");
    setTotalPrice(0);
    setIsSamePrice(false);
    setAllNumbersBundle(null);
  };

  const successfulItemsCount = detectedNumbers.filter(
    (item) => item.selectedBundle
  ).length;
  const platformFee = successfulItemsCount * ITEM_PLATFORM_FEE;
  const totalWithFee = totalPrice + platformFee;

  interface CsvRow {
    PhoneNumber: string;
  }

  const handleCsvUploadAndPopulate = (file: File) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const allNumbers = (results.data as CsvRow[])
          .map((row) => row.PhoneNumber)
          .filter(Boolean);

        const numbersToPopulate = allNumbers
          .map((num) => {
            let clean = String(num).trim();
            if (clean.startsWith("+234")) {
              clean = "0" + clean.slice(4);
            } else if (clean.startsWith("234")) {
              clean = "0" + clean.slice(3);
            }
            return clean;
          })
          .filter((num) => num.length === 11 && /^0\d{10}$/.test(num))
          .slice(0, 500); // FIX: Limited to 500 numbers

        const numbersString = numbersToPopulate.join("\n");
        setBulkInput(numbersString);
      },
      error: (err, file) => {
        console.error("Error parsing CSV:", err, file);
      },
    });
  };
  return (
    <div className="bulk-page-container">
      <h3 style={{ fontSize: 24, marginTop: 20, marginBottom: 0 }}>
        Bulk Top-up
      </h3>
      <br />
      <div
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          backgroundColor: "#ff0000",
          padding: `12px 24px`,
          borderRadius: 24,
          marginBottom: 32,
          marginTop: -12,
        }}
      >
        Anything more than 500 numbers contact admin
      </div>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${isData ? "active" : ""}`}
          onClick={() => handleToggleChange(true)}
        >
          Data
        </button>
        <button
          className={`toggle-btn ${!isData ? "active" : ""}`}
          onClick={() => handleToggleChange(false)}
        >
          Airtime
        </button>
      </div>
      <div className="input-section">
        <label htmlFor="bulk-input">
          Paste up to 500 numbers (separate by space, comma or new line):
        </label>{" "}
        <br />
        <textarea
          id="bulk-input"
          value={bulkInput}
          onChange={handleBulkInput}
          placeholder="e.g., 08012345678, 09012345678"
          rows={5}
        ></textarea>
        <br />
        <div
          style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
        >
          <div
            className="file-upload-wrapper"
            style={{
              color: "#ffdb1b",
            }}
          >
            <label
              htmlFor="csv-file-upload"
              className="upload-btn"
              style={{
                color: "#ffdb1b",
              }}
            >
              Upload CSV
            </label>
            <input
              id="csv-file-upload"
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleCsvUploadAndPopulate(file);
                }
              }}
            />
            <p className="helper-text">Only .csv files are allowed</p>
          </div>
          <div>
            <button
              className="submit-numbers-btn"
              style={{ height: 50 }}
              onClick={handleSubmitNumbers}
              disabled={bulkInput.trim().length === 0 || loading}
            >
              Submit All Numbers
            </button>
          </div>
        </div>
      </div>
      {loading && <div className="loader" />}
      {invalidNumbers.length > 0 && (
        <div className="invalid-numbers-list">
          <h3>Invalid or Undetected Numbers</h3>
          {invalidNumbers.map((item) => (
            <div key={item.id} className="number-item invalid">
              <FaTimesCircle className="icon error-icon" />
              <div className="number-details">
                <h5 className="network-number">{item.number}</h5>
                <p className="error-text">{item.error}</p>
              </div>
              <div className="number-actions">
                <button
                  onClick={() => deleteNumber(item.id, true)}
                  className="action-btn delete-btn"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {detectedNumbers.length > 0 && (
        <div className="detected-numbers-list">
          {!isData && (
            <div className="same-price-toggle-container">
              <input
                id="same-price-toggle"
                type="checkbox"
                checked={isSamePrice}
                onChange={() => setIsSamePrice(!isSamePrice)}
              />
              <label htmlFor="same-price-toggle">
                Same Price for all numbers
              </label>
            </div>
          )}
          {!isData && isSamePrice ? (
            <>
              <h3>Select a Bundle for All Numbers</h3>
              <div className="bundle-grid">
                {airtimeBundles?.map((bundle) => (
                  <button
                    key={bundle.id}
                    className={`bundle-option ${
                      allNumbersBundle?.id === bundle?.id ? "selected" : ""
                    }`}
                    onClick={() => handleAllNumbersBundleSelect(bundle)}
                  >
                    <h4>₦{bundle?.price?.toLocaleString()}</h4>
                    <p>Airtime</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}

          <>
            <br />
            <h3>Detected Numbers</h3>
            {detectedNumbers?.map((item) => (
              <div key={item.id} className="accordion-container">
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion(item.id)}
                >
                  <div className="network-info">
                    <FaCheckCircle className="icon success-icon" />
                    {item.detectedNetwork.logoUrls && (
                      <img
                        src={item.detectedNetwork.logoUrls}
                        alt={`${item.detectedNetwork.name} logo`}
                        className="operator-logo"
                        style={{
                          width: "24px",
                          borderRadius: 4,
                          height: "24px",
                          marginRight: "8px",
                        }}
                      />
                    )}
                    <h5 className="network-number-detected">{item?.number}</h5>
                    <span className="network-name-detected">
                      ({item?.detectedNetwork?.name})
                    </span>
                    {item?.selectedBundle && (
                      <span className="selected-bundle-summary">
                        (
                        {isData
                          ? `${
                              (item?.selectedBundle as DataBundle)
                                ?.budDataAmount
                            } `
                          : `₦${(
                              item?.selectedBundle as AirtimeBundle
                            )?.price?.toLocaleString()}`}
                        )
                      </span>
                    )}
                  </div>
                  <div className="accordion-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNumber(item?.id, false);
                      }}
                      className="action-btn delete-btn"
                    >
                      <FaTrash />
                    </button>
                    <span className="expand-icon">
                      {expandedAccordions.includes(item?.id) ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  </div>
                </div>
                {expandedAccordions.includes(item?.id) && (
                  <div className="accordion-content">
                    {isData && (
                      <div className="category-toggles">
                        {categories?.map((category) => (
                          <button
                            key={category}
                            className={`category-btn ${
                              item?.selectedCategory === category
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleCategorySelect(item?.id, category)
                            }
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="bundle-grid">
                      {getNetworkBundles(
                        item?.detectedNetwork?.name,
                        item?.selectedCategory
                      )?.map((bundle) => (
                        <button
                          key={bundle?.id}
                          className={`bundle-option ${
                            item?.selectedBundle?.id === bundle?.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleBundleSelect(item?.id, bundle as any)
                          }
                        >
                          {isData ? (
                            <>
                              <h5 style={{ fontSize: 16, marginBottom: 4 }}>
                                {(bundle as DataBundle)?.budDataAmount}
                              </h5>
                              <p>
                                ₦
                                {(
                                  (bundle as DataBundle)?.retailPrice ?? 0
                                ).toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <>
                              <h4>
                                ₦
                                {(
                                  bundle as AirtimeBundle
                                )?.price?.toLocaleString()}
                              </h4>
                              <p>Airtime</p>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        </div>
      )}
      {(detectedNumbers.length > 0 || invalidNumbers.length > 0) && (
        <div className="payment-summary">
          <div className="total-price-display">
            <p style={{ fontSize: 16, color: "gray" }}>
              Subtotal: ₦{totalPrice.toLocaleString()}
            </p>
            <p style={{ fontSize: 13, color: "gray" }}>
              Platform Fee ({successfulItemsCount} x ₦
              {ITEM_PLATFORM_FEE.toLocaleString()}): ₦
              {platformFee.toLocaleString()}
            </p>
            <p style={{ fontWeight: 700, fontSize: 24 }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>
                Grand Total:
              </span>{" "}
              ₦{totalWithFee.toLocaleString()}
            </p>
          </div>
          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={!allBundlesSelected || loading}
          >
            Pay for All
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkPaymentPage;
