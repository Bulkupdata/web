import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store"; // adjust to your store path
import "./UserRechargesPage.css";
import { fetchUserRecharges } from "../../redux/Reloadly/Index";

// Define an interface for the Recharge data structure
interface Recharge {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const UserRechargesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // State for local management (not selectors)
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ Get userId from localStorage
  useEffect(() => {
    const userIdFromLocal = localStorage.getItem("bulkup_data_userId");
    if (userIdFromLocal) {
      setCurrentUserId(userIdFromLocal);
    } else {
      setError("User ID (bulkup_data_userId) not found in localStorage.");
      setLoading(false);
    }
  }, []);

  // ✅ Fetch with thunk, but store results in local state
  useEffect(() => {
    const loadRecharges = async (userId: string) => {
      setLoading(true);
      setError(null);

      try {
        const resultAction = await dispatch(fetchUserRecharges(userId));
        console.log("✅ Recharges loaded:", resultAction);
        if (fetchUserRecharges.fulfilled.match(resultAction)) {
          const { code, data } = resultAction.payload;
          if (code === 200) {
            setRecharges(data);
            console.log("✅ Recharges loaded:", data);
          }
        } else if (fetchUserRecharges.rejected.match(resultAction)) {
          const { code, message } = resultAction.payload as {
            code: number;
            message: string;
          };

          // 🎯 Now you can display different errors by status
          if (code === 400) {
            setError("No recharges found for this user.");
          } else if (code === 500) {
            setError("Server error, please try again later.");
          } else {
            setError(message || "Request failed.");
          }
        }
      } catch (err: any) {
        console.error("❌ Error dispatching fetchUserRecharges:", err);
        setError(err?.message || "Failed to fetch recharges.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      loadRecharges(currentUserId);
    }
  }, [currentUserId, dispatch]);

  if (loading) {
    return (
      <div className="recharges-container">
        <p className="loading-message">Loading recharges... 🚀</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recharges-container">
        <p className="error-message">Error: {error} 🙁</p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="recharges-container">
        <p className="error-message">User ID could not be determined. 😟</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        // paddingTop: 120,
      }}
    >
      <div className="status-container success">
        <div className="status-inner">
          <div className="status-icon">🎉</div>
          <h1 className="status-title">Your Recharge History</h1>
          <p className="status-message">
            Here you can view the detailed history of all your recharge
            transactions,
          </p>
          {recharges.length === 0 ? (
            <p className="no-recharges-message">
              No recharges found for this user. 😔
            </p>
          ) : (
            <div className="status-details">
              {recharges.length > 0 ? (
                recharges.map((r: any, idx: number) => (
                  <div key={idx} className="status-item">
                    {r?.logoUrls && (
                      <img
                        src={r?.logoUrls}
                        alt={`${r?.name} logo`}
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="status-strong">Phone:</span>
                      <span>{r?.recipientPhone?.number}</span>
                    </p>

                    {r?.retailDataAmount && (
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="status-strong">Data:</span>
                        <span>{r.retailDataAmount}</span>
                      </p>
                    )}

                    {r?.planType && (
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="status-strong">Plan Type:</span>
                        <span>{r.planType}</span>
                      </p>
                    )}

                    {r?.retailPrice && (
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="status-strong">Price:</span>
                        <span>₦{r.retailPrice}</span>
                      </p>
                    )}

                    {/* 
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
                    */}

                  </div>
                ))
              ) : (
                <p>No recharge results found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRechargesPage;
