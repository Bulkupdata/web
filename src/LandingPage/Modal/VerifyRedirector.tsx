import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../redux/baseurl";

const VerifyRedirector: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const reference = searchParams.get("reference");
      const orderID = searchParams.get("orderID");
      if (!reference || !orderID) {
        navigate("/payment-failed", { replace: true });
        return;
      }
      try {
        const res = await axios.get(`${BaseUrl}/api/reloadly/verify-payment`, {
          params: { reference, orderID },
        });
        if (res.data.success) {
          navigate(
            `/payment-success?reference=${reference}&orderID=${orderID}`,
            {
              replace: true,
            }
          );
        } else {
          navigate("/payment-failed", { replace: true });
        }
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/payment-failed", { replace: true });
      }
    };

    verifyAndRedirect();
  }, [navigate, searchParams]);

  return <p>Verifying your payment...</p>;
};

export default VerifyRedirector;
