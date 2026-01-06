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
import Papa from "papaparse";
import BulkSummaryPage, { PurchaseItem } from "./BulkSummaryPage";

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
  budPrice: number;
  description: string;
  operatorId: number;
  planType: string;
  logoUrls?: any;
  isCustom?: boolean;
}

interface AirtimeBundle {
  amount: string;
  price: number;
  fixedPrice: number;
  id?: any;
  budPrice?: any;
  logoUrls?: any;
  network?: any;
  isCustom?: boolean;
}

const categories = ["Daily", "Weekly", "Monthly", "90 days", "365 days"];

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
  >([
    // Dummy for styling preview
  ]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
  const [allNumbersBundle, setAllNumbersBundle] =
    useState<AirtimeBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSamePrice, setIsSamePrice] = useState(false);
  const [isServiceFeeExpanded, setIsServiceFeeExpanded] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [customAmountError, setCustomAmountError] = useState<string | null>(
    null
  );
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const [modalPurchaseList, setModalPurchaseList] = useState<PurchaseItem[]>(
    []
  );
  const [modalSubtotal, setModalSubtotal] = useState(0);
  const [modalServiceFee, setModalServiceFee] = useState(0);
  const [modalGrandTotal, setModalGrandTotal] = useState(0);

  const updateTotalPrice = (numbers: typeof detectedNumbers) => {
    const total = numbers.reduce((sum, item) => {
      const price = item.selectedBundle
        ? isData
          ? (item.selectedBundle as DataBundle).budPrice
          : (item.selectedBundle as AirtimeBundle).price
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
      return airtimeBundles.map((b) => ({ ...b, network: networkName }));
    }

    const planTypesMap: Record<string, string[]> = {
      Daily: ["daily", "2 days"],
      Weekly: ["weekly", "7 days"],
      Monthly: ["monthly", "30 days"],
      "90 days": ["90 days"],
      "365 days": ["365 days"],
    };

    const planTypes = planTypesMap[category] || ["daily", "2 days"];

    return dataBundles.filter(
      (b) =>
        networkName.toLowerCase().includes(b.network.toLowerCase()) &&
        planTypes.includes(b.planType.toLowerCase())
    );
  };

  const deleteNumber = (id: string, isInvalid: boolean) => {
    if (isInvalid) {
      setInvalidNumbers((prev) => prev.filter((n) => n.id !== id));
    } else {
      const updated = detectedNumbers.filter((n) => n.id !== id);
      setDetectedNumbers(updated);
      updateTotalPrice(updated);
    }
  };

  const handleBundleSelect = (
    numberId: string,
    bundle: DataBundle | AirtimeBundle
  ) => {
    setDetectedNumbers((prev) =>
      prev.map((n) =>
        n.id === numberId ? { ...n, selectedBundle: bundle } : n
      )
    );
  };

  const handleAllNumbersBundleSelect = (bundle: AirtimeBundle) => {
    setAllNumbersBundle(bundle);
    setDetectedNumbers((prev) =>
      prev.map((n) => ({ ...n, selectedBundle: bundle }))
    );
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setCustomAmount("");
      setCustomAmountError(null);
      return;
    }

    const num = Number(val);
    if (isNaN(num)) {
      setCustomAmountError("Please enter a valid number.");
    } else if (num < 50 || num > 200000) {
      setCustomAmountError("Amount must be between ₦50 and ₦200,000.");
    } else {
      setCustomAmountError(null);
    }
    setCustomAmount(num);
  };

  const handleCategorySelect = (numberId: string, category: string) => {
    setDetectedNumbers((prev) =>
      prev.map((item) =>
        item.id === numberId && item.selectedCategory !== category
          ? { ...item, selectedCategory: category, selectedBundle: undefined }
          : item
      )
    );
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculateFees = () => {
    const successfulCount = detectedNumbers.filter(
      (n) => n.selectedBundle
    ).length;
    const subtotal = totalPrice;
    const processingFee = 499 * successfulCount;
    const runFee = 50;
    const vat = 0;
    const totalBeforePaystack = subtotal + processingFee + runFee + vat;

    let paystackFee = 0.015 * totalBeforePaystack;
    if (paystackFee > 2000) paystackFee = 2000;

    const serviceFee = processingFee + runFee + vat + paystackFee;
    const grandTotal = subtotal + serviceFee;

    return { processingFee, runFee, vat, paystackFee, serviceFee, grandTotal };
  };

  const fees = calculateFees();

  const handlePay = () => {
    const purchaseList = detectedNumbers
      .map((item) => {
        if (!item.selectedBundle) return null;

        const bundle = item.selectedBundle;
        const amount = bundle.isCustom
          ? (bundle as AirtimeBundle).price
          : isData
          ? (bundle as DataBundle).budPrice
          : (bundle as AirtimeBundle).fixedPrice;

        const customId = uuidv4();

        return {
          logoUrls: item.logoUrls,
          network: bundle.network,
          operatorId: item.operatorId,
          amount,
          useLocalAmount: true,
          customIdentifier: customId,
          recipientEmail: "bulkupdata@gmail.com",
          recipientPhone: { countryCode: "NG", number: item.number },
          senderPhone: { countryCode: "NG", number: item.number },
          buyData: isData,
          type: isData ? "Data" : "Airtime",
          bundle,
        };
      })
      .filter((x): x is any => !!x);

    if (purchaseList.length === 0) {
      alert("Please select a bundle for at least one number.");
      return;
    }

    setModalPurchaseList(purchaseList as any);
    setModalSubtotal(totalPrice);
    setModalServiceFee(fees.serviceFee);
    setModalGrandTotal(fees.grandTotal);
    setIsSummaryModalOpen(true);
  };

  const handleSubmitNumbers = async () => {
    setDetectedNumbers([]);
    setInvalidNumbers([]);

    const numbers = bulkInput
      .split(/[\s,;]+/)
      .map((n) => {
        let clean = n.trim();
        if (clean.startsWith("+234")) clean = "0" + clean.slice(4);
        if (clean.startsWith("234")) clean = "0" + clean.slice(3);
        return clean;
      })
      .filter((n) => n.length === 11 && /^0\d{10}$/.test(n))
      .slice(0, 500);

    if (numbers.length === 0) {
      alert("Please enter valid Nigerian phone numbers.");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(
        autoDetectOperatorGroup({ phones: numbers, countryCode: "NG" })
      ).unwrap();

      const detected: typeof detectedNumbers = [];
      const invalid: typeof invalidNumbers = [];

      res.results.forEach((r: any) => {
        const id = uuidv4();
        if (r.success) {
          const { data, phone } = r;
          const op = data;
          const name = op?.name || "";
          const nickname = name.toLowerCase().split(" ")[0];
          const logoUrls = op?.logoUrls?.[0];

          detected.push({
            id,
            number: phone,
            detectedNetwork: { id: nickname, name, nickname, logoUrls },
            selectedBundle: undefined,
            operatorId: op?.operatorId || "",
            selectedCategory: "Daily",
            logoUrls,
          });
        } else {
          invalid.push({
            id,
            number: r.phone,
            error: r.error || "Network not detected",
            isEditing: false,
          });
        }
      });

      setDetectedNumbers(detected);
      setInvalidNumbers(invalid);
    } catch (err) {
      console.error("Bulk auto-detect failed:", err);
      alert("Failed to detect networks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const nums = (results.data as { PhoneNumber: string }[])
          .map((r) => r.PhoneNumber?.trim())
          .filter(Boolean);

        const cleaned = nums
          .map((n) => {
            let clean = String(n);
            if (clean.startsWith("+234")) clean = "0" + clean.slice(4);
            if (clean.startsWith("234")) clean = "0" + clean.slice(3);
            return clean;
          })
          .filter((n) => n.length === 11 && /^0\d{10}$/.test(n))
          .slice(0, 500);

        setBulkInput(cleaned.join("\n"));
      },
    });
  };

  const allBundlesSelected =
    isData || !isSamePrice
      ? detectedNumbers.every((n) => !!n.selectedBundle)
      : !!allNumbersBundle;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-4xl font-black mt-6 mb-2 tracking-tight text-slate-900">
          Bulk Top-up
        </h2>
        <p className="text-slate-500 mb-6 font-medium">
          Fast, reliable bulk data and airtime processing.
        </p>

        <div
          className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm font-bold p-4 rounded-r-xl mb-8 cursor-pointer  transition-all flex items-center justify-between group shadow-sm"
          onClick={() =>
            (window.location.href = "mailto:business@lukasdesignlab.com")
          }
        >
          <span>Need more than 500 numbers? Contact our enterprise team.</span>
          <span className="underline ">Email Admin</span>
        </div>

        {/* Toggle Data / Airtime */}
        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
              isData
                ? "bg-yellow-400 text-slate-900 shadow-md"
                : "bg-slate-200 text-slate-500"
            }`}
            onClick={() => setIsData(true)}
          >
            DATA
          </button>
          <button
            className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
              !isData
                ? "bg-yellow-400 text-slate-900 shadow-md"
                : "bg-slate-200 text-slate-500"
            }`}
            onClick={() => setIsData(false)}
          >
            AIRTIME
          </button>
        </div>

        {/* Input Area */}
        <div className="mb-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <label className="block text-sm font-bold text-slate-600 mb-3  tracking-wider">
            Phone Numbers List
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="08012345678, 09012345678..."
            rows={5}
            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all resize-none font-mono text-lg"
          />

          {!loading && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-between items-center">
              <div>
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center px-6 py-3 bg-white text-slate-700 font-bold rounded-xl cursor-pointer transition-all border-2 border-slate-100 shadow-sm"
                >
                  Upload CSV
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleCsvUpload(e.target.files[0])
                  }
                />
              </div>

              <button
                onClick={handleSubmitNumbers}
                disabled={!bulkInput.trim() || loading}
                className="w-full sm:w-auto px-10 py-4 bg-yellow-400 text-slate-900 font-black rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                DETECT NETWORKS
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 font-bold text-slate-400">
              Verifying numbers...
            </p>
          </div>
        )}

        {/* Invalid Numbers */}
        {invalidNumbers.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-black mb-4 text-red-500  tracking-tight">
              Errors found
            </h3>
            <div className="grid gap-3">
              {invalidNumbers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-red-50 p-4 rounded-2xl border border-red-100"
                >
                  <div className="flex items-center gap-4">
                    <FaTimesCircle className="text-red-400 text-xl" />
                    <div>
                      <p className="font-bold text-slate-900">{item.number}</p>
                      <p className="text-xs text-red-500 font-bold ">
                        {item.error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNumber(item.id, true)}
                    className="p-3 text-red-300  rounded-xl transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detected Numbers */}
        {detectedNumbers.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">
                Detected Recipient List
              </h3>
              {!isData && (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className="text-sm font-bold text-slate-500 transition-colors">
                    Bulk Amount
                  </span>
                  <input
                    type="checkbox"
                    checked={isSamePrice}
                    onChange={() => setIsSamePrice(!isSamePrice)}
                    className="w-6 h-6  rounded-lg accent-yellow-400 cursor-pointer"
                  />
                </label>
              )}
            </div>

            {isSamePrice && !isData && (
              <div className="mb-8 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
                <label className="block text-sm font-bold text-slate-400 mb-3  tracking-widest">
                  Global Airtime Amount (₦)
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount (e.g. 1000)"
                    className="flex-1 p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={() => {
                      if (!customAmountError && customAmount) {
                        handleAllNumbersBundleSelect({
                          amount: String(customAmount),
                          price: customAmount,
                          fixedPrice: customAmount,
                          id: `custom-${customAmount}`,
                          isCustom: true,
                        });
                      }
                    }}
                    disabled={!!customAmountError || !customAmount}
                    className="px-8 py-4 bg-yellow-400 text-slate-900 font-black rounded-2xl isabled:opacity-30 transition-all"
                  >
                    APPLY ALL
                  </button>
                </div>
                {customAmountError && (
                  <p className="text-red-400 text-xs mt-3 font-bold ">
                    {customAmountError}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {detectedNumbers.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                    expandedAccordions.includes(item.id)
                      ? "border-yellow-400 shadow-md"
                      : "border-slate-100 shadow-sm"
                  }`}
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleAccordion(item.id)}
                    className="flex flex-col p-5 cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <FaCheckCircle className="text-green-500 text-lg absolute -top-1 -right-1 bg-white rounded-full z-10" />
                          {item.detectedNetwork.logoUrls ? (
                            <img
                              src={item.detectedNetwork.logoUrls}
                              alt="logo"
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-none">
                            {item.number}
                          </p>
                          <p className="text-xs text-slate-400 font-bold  mt-1">
                            {item.detectedNetwork.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNumber(item.id, false);
                          }}
                          className="p-3 text-slate-300 rounded-xl transition-all"
                        >
                          <FaTrash size={18} />
                        </button>
                        <div
                          className={`transition-transform duration-300 ${
                            expandedAccordions.includes(item.id)
                              ? "rotate-180 text-yellow-500"
                              : "text-slate-300"
                          }`}
                        >
                          <FaChevronDown />
                        </div>
                      </div>
                    </div>

                    {item.selectedBundle && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 bg-yellow-400 px-3 py-1.5 rounded-lg  tracking-tight shadow-sm">
                          {isData
                            ? (item.selectedBundle as DataBundle).budDataAmount
                            : `₦${(
                                item.selectedBundle as AirtimeBundle
                              ).price.toLocaleString()}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  {expandedAccordions.includes(item.id) && (
                    <div className="px-5 pb-6 pt-2 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                      {isData && (
                        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-200/50 rounded-xl w-fit">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategorySelect(item.id, cat)}
                              className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                                item.selectedCategory === cat
                                  ? "bg-white text-slate-900 shadow-sm"
                                  : "text-slate-500 "
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {getNetworkBundles(
                          item.detectedNetwork.name,
                          item.selectedCategory
                        ).map((bundle) => (
                          <button
                            key={bundle.id}
                            onClick={() =>
                              handleBundleSelect(item.id, bundle as any)
                            }
                            className={`p-4 rounded-2xl text-left border-2 transition-all group/btn ${
                              item.selectedBundle?.id === bundle.id
                                ? "border-yellow-400 bg-yellow-50 shadow-inner"
                                : "border-white bg-white hover:bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            {isData ? (
                              <>
                                <div className="font-black text-slate-900 text-lg tracking-tighter">
                                  {(bundle as DataBundle).budDataAmount}
                                </div>
                                <div className="text-xs font-bold text-slate-400">
                                  ₦
                                  {(
                                    bundle as DataBundle
                                  ).budPrice.toLocaleString()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-black text-slate-900 text-lg tracking-tighter">
                                  ₦
                                  {(
                                    bundle as AirtimeBundle
                                  ).price.toLocaleString()}
                                </div>
                                <div className="text-xs font-bold text-slate-400  tracking-widest">
                                  Credit
                                </div>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary & Pay */}
        {(detectedNumbers.length > 0 || invalidNumbers.length > 0) && (
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
              <FaCheckCircle size={140} className="text-yellow-400" />
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold  tracking-widest text-xs">
                  Bundle Total
                </span>
                <span className="text-slate-900 font-black text-2xl tracking-tighter">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>

              <div
                onClick={() => setIsServiceFeeExpanded(!isServiceFeeExpanded)}
                className={`flex justify-between items-center cursor-pointer py-4 px-6 rounded-2xl transition-all border-2 ${
                  isServiceFeeExpanded
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-50 "
                }`}
              >
                <span className="font-bold">Service Fees</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-black ${
                      isServiceFeeExpanded
                        ? "text-yellow-400"
                        : "text-slate-900"
                    }`}
                  >
                    ₦{fees.serviceFee.toLocaleString()}
                  </span>
                  <span className="opacity-50">
                    {isServiceFeeExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
              </div>

              {isServiceFeeExpanded && (
                <div className="px-6 py-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Gateways & Processing</span>
                    <span className="text-slate-900">
                      ₦
                      {(fees.processingFee + fees.paystackFee).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>System Maintenance</span>
                    <span className="text-slate-900">
                      ₦{fees.runFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t-2 border-slate-100 flex justify-between items-center">
                <span className="text-slate-900 font-black text-xl">
                  Total Due
                </span>
                <span className="text-yellow-500 font-black text-4xl tracking-tight">
                  ₦{fees.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!allBundlesSelected || loading}
              className="w-full mt-10 py-5 bg-yellow-400 text-slate-900 font-black text-xl rounded-2xl active:translate-y-0 disabled:opacity-30 disabled:transform-none transition-all shadow-xl shadow-yellow-200"
            >
              PROCEED TO SECURE PAYMENT
            </button>
          </div>
        )}

        {isSummaryModalOpen && (
          <BulkSummaryPage
            isOpen={isSummaryModalOpen}
            onClose={() => setIsSummaryModalOpen(false)}
            purchaseList={modalPurchaseList}
            subtotal={modalSubtotal}
            serviceFee={modalServiceFee}
            grandTotal={modalGrandTotal}
            totalPrice={modalGrandTotal}
          />
        )}
      </div>
    </div>
  );
};

export default BulkPaymentPage;
