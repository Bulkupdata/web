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
import logo from "../../assets/images/vite.png";

const UserRechargesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [recharges, setRecharges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Modal State
  const [selectedRecharge, setSelectedRecharge] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userIdFromLocal = localStorage.getItem("bulkup_data_userId");
    if (userIdFromLocal) setCurrentUserId(userIdFromLocal);
    else {
      setError("User session expired." );
      setLoading(false);
      console.warn(error)
    }
  }, []);

  useEffect(() => {
    const loadRecharges = async (userId: string) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchUserRecharges(userId));
        if (fetchUserRecharges.fulfilled.match(resultAction)) {
          setRecharges(resultAction.payload.data);
        }
      } catch (err) {
        setError("An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUserId) loadRecharges(currentUserId);
  }, [currentUserId, dispatch]);

  const handleDownload = async (id: string, fileName: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // If it's the hidden template, show it briefly
    const isHidden = element.style.display === "none";
    if (isHidden) element.style.display = "block";

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    if (isHidden) element.style.display = "none";

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${fileName}.png`;
    link.click();
  };

  const openDetails = (recharge: any) => {
    setSelectedRecharge(recharge);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiClock className="animate-spin text-2xl text-slate-900" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 pt-28 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Transaction History
            </h1>
            <p className="text-slate-500 font-medium">
              View and download your official receipts.
            </p>
          </div>
          <button
            onClick={() =>
              handleDownload("all-transactions-list", "Full_History")
            }
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <FiDownload /> DOWNLOAD ALL
          </button>
        </div>

        {/* The List that gets downloaded for "Download All" */}
        <div id="all-transactions-list" className="space-y-4">
          {recharges.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 group transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={r.logoUrls || logo}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-50 shadow-sm"
                  alt="operator"
                />
                <div>
                  <p className="font-black text-slate-900 text-lg leading-none mb-1">
                    {r.recipientPhone?.number}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    {r.operatorNickname} •{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-xl font-black text-slate-900">
                    ₦{r.amount.toLocaleString()}
                  </p>
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">
                    {r.status}
                  </span>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => openDetails(r)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  <FiEye /> <span className="text-xs">DETAILS</span>
                </button>

                {/* Direct Download Button */}
                <button
                  onClick={() =>
                    handleDownload(
                      `hidden-receipt-${r._id}`,
                      `Receipt_${r.recipientPhone.number}`
                    )
                  }
                  className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                >
                  <FiDownload size={18} />
                </button>
              </div>

              {/* HIDDEN TEMPLATE FOR DIRECT DOWNLOADS */}
              <div id={`hidden-receipt-${r._id}`} style={{ display: "none" }}>
                <ReceiptTemplate recharge={r} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && selectedRecharge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
                Receipt Preview
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <FiX size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body (Scrollable if needed) */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div id="modal-receipt-capture">
                <ReceiptTemplate recharge={selectedRecharge} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-slate-500 font-black rounded-2xl border-2 border-slate-200 hover:bg-white transition-all"
              >
                CLOSE
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    "modal-receipt-capture",
                    `Receipt_${selectedRecharge.recipientPhone.number}`
                  )
                }
                className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <FiDownload /> DOWNLOAD PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- REUSABLE RECEIPT COMPONENT --- */
const ReceiptTemplate = ({ recharge }: { recharge: any }) => (
  <div
    className="bg-white p-10 font-sans"
    style={{ width: "450px", margin: "0 auto" }}
  >
    <div className="text-center border-b-2 border-dashed border-slate-100 pb-8 mb-8">
      <img src={logo} alt="Logo" className="h-10 mx-auto mb-4" />
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
        Transaction Receipt
      </h2>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
        Lukas Design Lab Official
      </p>
    </div>

    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">
          Total Amount Paid
        </span>
        <span className="text-3xl font-black text-slate-900">
          ₦{recharge.amount.toLocaleString()}
        </span>
      </div>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
            <FiPhone className="text-slate-300" /> Recipient
          </span>
          <span className="text-slate-900 font-black text-sm">
            {recharge.recipientPhone?.number}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
            <FiHash className="text-slate-300" /> Network
          </span>
          <span className="text-slate-900 font-black text-sm uppercase">
            {recharge.operatorNickname}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
            <FiCalendar className="text-slate-300" /> Date & Time
          </span>
          <span className="text-slate-900 font-bold text-xs">
            {new Date(recharge.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
            <FiCheck className="text-slate-300" /> Status
          </span>
          <span className="text-green-600 font-black text-xs uppercase tracking-widest">
            {recharge.status}
          </span>
        </div>
      </div>

      <div className="mt-8 p-5 bg-slate-900 text-white rounded-2xl text-center relative overflow-hidden">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] mb-1 opacity-60">
          Transaction Identifier
        </p>
        <p className="font-mono text-[10px] break-all">
          {recharge.transactionId || recharge._id}
        </p>
        {/* Decorative circle for a "punched card" look */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
      </div>
    </div>

    <div className="mt-10 text-center">
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-1 w-2 bg-slate-100 rounded-full"></div>
        ))}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Thank you for trusting BulkUp Data
      </p>
    </div>
  </div>
);

export default UserRechargesPage;
