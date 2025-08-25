import React, { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import "./StatusPages.css";

const RechargeSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const ref = searchParams.get("ref");
  const results = (location.state as any)?.results || [];

  // Use useEffect to handle localStorage cleanup
  useEffect(() => {
    // Check if there are results to process
    if (results.length > 0) {
      // Retrieve the existing payloads from localStorage
      const storedPayloads = JSON.parse(
        localStorage.getItem("topupPayloads") || "[]"
      );

      // Filter out the successful items from the stored payloads
      const updatedPayloads = storedPayloads.filter((storedItem: any) => {
        // Find if this stored item's 'id' exists in the list of successful results
        const isSuccessful = results.some(
          (resultItem: any) =>
            resultItem.success && resultItem.payload?.id === storedItem.id
        );
        // If it's successful, we DO NOT keep it (return false)
        return !isSuccessful;
      });

      // Update localStorage with the filtered list
      localStorage.setItem("topupPayloads", JSON.stringify(updatedPayloads));
      console.log(
        "Updated localStorage. Successful items removed:",
        updatedPayloads
      );
    }
  }, [results]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="status-container success">
        <div className="status-inner">
          <div className="status-icon">🎉</div>
          <h1 className="status-title">Recharge Successful!</h1>
          <p className="status-message">
            {" "}
            Your account has been credited instantly. Thank you for trusting us
            — you can continue using your services without interruption. Need
            help? Contact our support team anytime.
          </p>

          {ref && (
            <p className="status-ref">
              <span className="status-strong">Reference:</span> {ref}
            </p>
          )}

          <div className="status-details">
            {results.length > 0 ? (
              results.map((r: any, idx: number) => (
                <div key={idx} className="status-item">
                  {r.payload?.logoUrls && (
                    <img
                      src={r.payload?.logoUrls}
                      alt={`${r.payload?.name} logo`}
                      className="operator-logo"
                      style={{
                        width: "24px",
                        borderRadius: 4,
                        height: "24px",
                        marginRight: "8px",
                      }}
                    />
                  )}

                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span className="status-strong">Phone:</span>
                    <span>{r.payload?.recipientPhone?.number}</span>
                  </p>

                  {r.payload?.retailDataAmount && (
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="status-strong">Data:</span>
                      <span>{r.payload.retailDataAmount}</span>
                    </p>
                  )}

                  {r.payload?.planType && (
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="status-strong">Plan Type:</span>
                      <span>{r.payload.planType}</span>
                    </p>
                  )}

                  {r.payload?.retailPrice && (
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="status-strong">Price:</span>
                      <span>₦{r.payload.retailPrice}</span>
                    </p>
                  )}

                  <p
                    style={{
                      backgroundColor: r.success ? "green" : "red",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      display: "inline-block",
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    {r.success ? "Success" : "Failed"}
                  </p>
                </div>
              ))
            ) : (
              <p>No recharge results found.</p>
            )}
          </div>

          <div className="status-footer">Thank you for using our service.</div>
        </div>
      </div>
    </div>
  );
};

export default RechargeSuccess;
