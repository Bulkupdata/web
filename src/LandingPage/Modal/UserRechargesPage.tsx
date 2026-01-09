import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchUserRecharges } from "../../redux/Reloadly/Index";
import {
  FiDownload,
  FiCheck,
  FiClock,
  FiPhone,
  FiHash,
  FiCalendar,
  FiEye,
  FiX,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; // FIXED: must be lowercase 'jspdf'
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/vite.png";

const UserRechargesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [recharges, setRecharges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Download states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Modal
  const [selectedRecharge, setSelectedRecharge] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userIdFromLocal = localStorage.getItem("bulkup_data_userId");
    if (userIdFromLocal) {
      setCurrentUserId(userIdFromLocal);
    } else {
      setError("User session expired. Please login again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const loadRecharges = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchUserRecharges(currentUserId));
        if (fetchUserRecharges.fulfilled.match(resultAction)) {
          setRecharges(resultAction.payload.data || []);
        }
      } catch {
        setError("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    loadRecharges();
  }, [currentUserId, dispatch]);

  // ─────────────────────────────────────────────────────────────
  //    DOWNLOAD ALL TRANSACTIONS AS TABLE PDF (FIXED)
  // ─────────────────────────────────────────────────────────────
  const downloadAllAsPDF = () => {
    if (!recharges.length) {
      alert("No transactions available to download.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // 1. Header
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59);
      doc.text("BulkUp Transaction Report", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.text(`Generated on: ${dateStr}`, 14, 28);

      // 2. Data
      const tableRows = recharges.map((r, index) => [
        index + 1,
        new Date(r.createdAt).toLocaleDateString("en-GB"),
        r.recipientPhone?.number || "—",
        r.operatorNickname || "—",
        `N${Number(r.amount).toLocaleString()}`,
        r.status,
        r.transactionId || r._id,
      ]);

      // 3. Generate Table
      autoTable(doc, {
        head: [
          [
            "#",
            "Date",
            "Phone Number",
            "Network",
            "Amount",
            "Status",
            "Transaction Ref",
          ],
        ],
        body: tableRows,
        startY: 40,
        theme: "striped",
        headStyles: { fillColor: [30, 41, 59] },
        didDrawPage: (data) => {
          console.warn(data)
          // FIX: Use doc.getNumberOfPages() directly
          // or use the data object provided by autoTable
          const pageCount = doc.getNumberOfPages();

          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${pageCount}`,
            pageWidth - 20,
            doc.internal.pageSize.getHeight() - 10
          );
        },
      });

      doc.save(
        `BulkUp_Transactions_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSingleDownload = async (id: string, fileName: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const wasHidden = element.style.display === "none";
    if (wasHidden) {
      element.style.display = "block";
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.width = "450px";
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${fileName}.png`;
      link.click();
    } catch (err) {
      console.error("Capture failed", err);
    } finally {
      if (wasHidden) element.style.display = "none";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiClock className="animate-spin text-3xl text-slate-700" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Transaction History
            </h1>
            <p className="text-slate-600 mt-1">
              Manage and export your records
            </p>
          </div>

          <button
            onClick={downloadAllAsPDF}
            disabled={recharges.length === 0 || isGeneratingPDF}
            className={`flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold transition-all min-w-[220px] shadow-lg
              ${
                recharges.length === 0 || isGeneratingPDF
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
          >
            {isGeneratingPDF ? (
              <FiClock className="animate-spin" />
            ) : (
              <FiDownload />
            )}
            {isGeneratingPDF ? "GENERATING TABLE..." : "DOWNLOAD TABLE (PDF)"}
          </button>
        </div>

        <div className="space-y-5">
          {recharges.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={r.logoUrls || logo}
                    alt="logo"
                    className="w-14 h-14 rounded-2xl object-cover border"
                  />
                  <div>
                    <div className="font-bold text-lg">
                      {r.recipientPhone?.number || "—"}
                    </div>
                    <div className="text-xs text-slate-500 uppercase">
                      {r.operatorNickname} •{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-2 hidden sm:block">
                    <div className="text-xl font-bold">
                      N{Number(r.amount).toLocaleString()}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRecharge(r);
                      setIsModalOpen(true);
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-sm flex items-center gap-2"
                  >
                    <FiEye /> Details
                  </button>
                  <button
                    onClick={() =>
                      handleSingleDownload(
                        `hidden-receipt-${r._id}`,
                        `Receipt_${r._id}`
                      )
                    }
                    className="p-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                  >
                    <FiDownload size={18} />
                  </button>
                </div>
              </div>
              <div id={`hidden-receipt-${r._id}`} style={{ display: "none" }}>
                <ReceiptTemplate recharge={r} />
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedRecharge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-700">
                  RECEIPT PREVIEW
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div id="modal-receipt-capture">
                  <ReceiptTemplate recharge={selectedRecharge} />
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleSingleDownload(
                      "modal-receipt-capture",
                      `Receipt_${selectedRecharge._id}`
                    )
                  }
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <FiDownload /> Download PNG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReceiptTemplate: React.FC<{ recharge: any }> = ({ recharge }) => (
  <div
    className="bg-white p-8 font-sans"
    style={{ width: "450px", margin: "0 auto" }}
  >
    <div className="text-center border-b-2 border-dashed border-slate-200 pb-8 mb-8">
      <img src={logo} alt="Logo" className="h-10 mx-auto mb-4" />
      <h2 className="text-2xl font-black text-slate-900">
        Transaction Receipt
      </h2>
      <p className="text-slate-500 text-xs font-bold uppercase mt-1">
        BulkUp Data Official
      </p>
    </div>
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl text-center border">
        <div className="text-slate-500 text-xs font-bold uppercase mb-1">
          Total Amount
        </div>
        <div className="text-4xl font-black text-slate-900">
          N{Number(recharge.amount).toLocaleString()}
        </div>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 flex items-center gap-2">
            <FiPhone /> Recipient
          </span>
          <span className="font-bold">{recharge.recipientPhone?.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 flex items-center gap-2">
            <FiHash /> Network
          </span>
          <span className="font-bold uppercase">
            {recharge.operatorNickname}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 flex items-center gap-2">
            <FiCalendar /> Date
          </span>
          <span className="font-medium">
            {new Date(recharge.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 flex items-center gap-2">
            <FiCheck /> Status
          </span>
          <span
            className={`font-bold uppercase ${
              recharge.status === "SUCCESS"
                ? "text-green-600"
                : "text-amber-600"
            }`}
          >
            {recharge.status}
          </span>
        </div>
      </div>
      <div className="mt-8 p-4 bg-slate-900 text-white rounded-2xl text-center">
        <p className="text-[10px] uppercase opacity-70 mb-1">Transaction Ref</p>
        <p className="font-mono text-xs break-all">
          {recharge.transactionId || recharge._id}
        </p>
      </div>
    </div>
  </div>
);

export default UserRechargesPage;
