import React, { useEffect, useRef } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaInfoCircle, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
// Import your logo
import logo from "../../assets/images/vite.png";

const RechargeSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Create a ref for the specific div you want to download
  const receiptRef = useRef<HTMLDivElement>(null);

  const ref = searchParams.get("ref");
  const results = (location.state as any)?.results || [];

  useEffect(() => {
    if (results.length > 0) {
      const storedPayloads = JSON.parse(
        localStorage.getItem("topupPayloads") || "[]"
      );
      const updatedPayloads = storedPayloads.filter((storedItem: any) => {
        const isSuccessful = results.some(
          (resultItem: any) =>
            resultItem.success && resultItem.payload?.id === storedItem.id
        );
        return !isSuccessful;
      });
      localStorage.setItem("topupPayloads", JSON.stringify(updatedPayloads));
    }
  }, [results]);

  const handleDownloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Allows loading external images like logos
        backgroundColor: "#ffffff",
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `receipt-${ref || "transaction"}.png`;
      link.click();
    }
  };

  const successfulCount = results.filter((r: any) => r.success).length;
  const failedCount = results.length - successfulCount;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Wrap everything inside the Ref that you want in the image */}
        <div
          ref={receiptRef}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100"
        >
          {/* Header Section */}
          <div className="bg-white p-8 pb-4 text-center">
            {/* Logo added here */}
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="Company Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Transaction Processed
            </h1>
            <p className="text-slate-500 font-medium px-4">
              Bulk request processing complete. Detailed report below.
            </p>
          </div>

          {/* Reference Badge */}
          {ref && (
            <div className="flex justify-center mb-6">
              <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                REF: {ref}
              </span>
            </div>
          )}

          {/* Summary Stats */}
          <div className="flex gap-4 px-8 mb-8">
            <div className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
              <p className="text-green-600 text-xs font-black uppercase tracking-widest mb-1">
                Success
              </p>
              <p className="text-2xl font-black text-green-700">
                {successfulCount}
              </p>
            </div>
            {failedCount > 0 && (
              <div className="flex-1 bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                <p className="text-red-600 text-xs font-black uppercase tracking-widest mb-1">
                  Failed
                </p>
                <p className="text-2xl font-black text-red-700">
                  {failedCount}
                </p>
              </div>
            )}
          </div>

          {/* List Section */}
          <div className="px-8 pb-10">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
              Detailed Results
            </h3>
            <div className="space-y-4">
              {results.map((r: any, idx: number) => {
                const isSuccess = r.success;
                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border-2 p-5 ${
                      isSuccess
                        ? "border-slate-50 bg-slate-50/30"
                        : "border-red-50 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={r.payload?.logoUrls}
                          alt="Logo"
                          className="w-10 h-10 rounded-xl"
                        />
                        <div>
                          <p className="font-black text-slate-900 leading-none">
                            {r.payload?.recipientPhone?.number}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                            {r.payload?.network}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black ${
                          isSuccess
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isSuccess ? "DELIVERED" : "FAILED"}
                      </span>
                    </div>
                    {!isSuccess && (
                      <div className="mt-3 p-3 bg-red-50 rounded-xl flex gap-2 items-center text-[11px] font-bold text-red-600 border border-red-100">
                        <FaInfoCircle />{" "}
                        {r.topupData?.message || "Recharge error"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Official Transaction Receipt • Lukas Design Lab
            </p>
          </div>
        </div>

        {/* Action Buttons (Excluded from Ref/Download) */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            RETURN TO DASHBOARD
          </button>
          <button
            onClick={handleDownloadReceipt}
            className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <FaDownload /> DOWNLOAD RECEIPT (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};

export default RechargeSuccess;
