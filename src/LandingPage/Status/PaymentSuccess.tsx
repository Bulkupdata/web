import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { makeMainTopup } from "../../redux/Reloadly/Index";
import { BaseUrl } from "../../redux/baseurl";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiClock,
  FiLoader,
} from "react-icons/fi";

type PaymentStatus =
  | "loading"
  | "payment_failed"
  | "payment_success_recharge_success"
  | "payment_success_recharge_failed"
  | "payment_pending"
  | "recharge_pending";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("trxref") || searchParams.get("reference");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState<string>("Verifying your payment...");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const safeParse = (data: string | null) => {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const verifyPayment = async () => {
    if (!ref) {
      setStatus("payment_failed");
      setMessage("No payment reference found.");
      return;
    }

    setStatus("loading");
    setMessage("Verifying payment with Paystack...");

    try {
      const res = await axios.get(`${BaseUrl}/api/reloadly/verify-payment`, {
        params: { reference: ref, trxref: ref },
      });

      if (res.status === 200 && res.data.success) {
        const storedPayloads = localStorage.getItem("topupPayloads");
        const userId = localStorage.getItem("bulkup_data_userId");
        let parsedPayloads = safeParse(storedPayloads);

        if (parsedPayloads && !Array.isArray(parsedPayloads))
          parsedPayloads = [parsedPayloads];

        if (Array.isArray(parsedPayloads) && parsedPayloads.length > 0) {
          setMessage("Payment verified! Processing top-ups...");
          const payloadsWithUserId = parsedPayloads.map((p: any) => ({
            ...p,
            userId,
          }));

          try {
            const response = await dispatch(
              makeMainTopup({ ref, payload: payloadsWithUserId })
            ).unwrap();

            // Check if at least one item succeeded
            const hasSuccessfulRecharge = response.results?.some(
              (r: any) => r.success === true
            );

            if (hasSuccessfulRecharge) {
              setStatus("payment_success_recharge_success");
              setMessage("Payment and recharge successful!");
              setTimeout(() => {
                navigate(`/recharge-success?status=success&ref=${ref}`, {
                  state: { results: response.results },
                });
              }, 2000);
            } else {
              // CASE: All failed (like your log: PHONE_RECENTLY_RECHARGED)
              setStatus("payment_success_recharge_failed");
              const firstError =
                response.results?.[0]?.topupData?.message ||
                "Recharge failed due to provider error.";
              setMessage(firstError);
            }
          } catch (error: any) {
            setStatus("payment_success_recharge_failed");
            setMessage(
              "Payment was successful, but we couldn't trigger the recharge."
            );
          }
        } else {
          setStatus("recharge_pending");
          setMessage(
            "Payment successful, but no pending items found to recharge."
          );
        }
      } else {
        setStatus("payment_failed");
        setMessage("We couldn't verify this payment reference.");
      }
    } catch (err: any) {
      setStatus("payment_failed");
      setMessage(err.response?.data?.error || "Server verification failed.");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [ref]);

  // Card component wrapper to keep UI consistent
  const StatusCard = ({
    children,
    colorClass,
  }: {
    children: React.ReactNode;
    colorClass: string;
  }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div
        className={`bg-white w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-xl shadow-slate-200/50 border-t-8 ${colorClass}`}
      >
        {children}
      </div>
    </div>
  );

  if (status === "loading") {
    return (
      <StatusCard colorClass="border-blue-500">
        <FiLoader
          className="mx-auto text-blue-500 animate-spin mb-6"
          size={60}
        />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Processing</h2>
        <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
      </StatusCard>
    );
  }

  return (
    <>
      {status === "payment_success_recharge_success" && (
        <StatusCard colorClass="border-green-500">
          <FiCheckCircle className="mx-auto text-green-500 mb-6" size={60} />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Success!</h2>
          <p className="text-slate-500 font-medium mb-6">{message}</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-pulse w-full"></div>
          </div>
        </StatusCard>
      )}

      {status === "payment_success_recharge_failed" && (
        <StatusCard colorClass="border-orange-500">
          <FiAlertTriangle className="mx-auto text-orange-500 mb-6" size={60} />
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Action Required
          </h2>
          <div className="bg-orange-50 text-orange-700 p-4 rounded-2xl mb-6 text-sm font-bold border border-orange-100">
            Payment was Successful, but recharge failed: <br />
            <span className="text-slate-900 underline">{message}</span>
          </div>
          <button
            onClick={verifyPayment}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-lg mb-3"
          >
            RETRY RECHARGE
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 bg-white text-slate-500 font-bold rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-colors"
          >
            GO TO DASHBOARD
          </button>
        </StatusCard>
      )}

      {status === "payment_failed" && (
        <StatusCard colorClass="border-red-500">
          <FiXCircle className="mx-auto text-red-500 mb-6" size={60} />
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-slate-500 font-medium mb-8">{message}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg"
          >
            TRY AGAIN
          </button>
        </StatusCard>
      )}

      {(status === "payment_pending" || status === "recharge_pending") && (
        <StatusCard colorClass="border-cyan-500">
          <FiClock className="mx-auto text-cyan-500 mb-6" size={60} />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Pending</h2>
          <p className="text-slate-500 font-medium mb-8">{message}</p>
          <button
            onClick={verifyPayment}
            className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-lg"
          >
            REFRESH STATUS
          </button>
        </StatusCard>
      )}
    </>
  );
};

export default PaymentSuccess;
