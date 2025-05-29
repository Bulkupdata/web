// PaymentRedirectHandler.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current path:", location.pathname);
    if (location.pathname.includes("api/reloadly/verify-payment")) {
      console.log("Redirecting to /payment-success");
      navigate("/payment-success");
    }
  }, [location, navigate]);

  return null; // nothing to render
}