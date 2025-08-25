import { useState, useEffect } from "react";
import AdminAuth from "./AdminAuth";
import { FaLock, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { useDispatch } from "react-redux";
import { updateReloadlyToken } from "../../redux/Reloadly/adminSlice";
import { AppDispatch } from "../../redux/store";

const Admin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Local state to manage the token update status and messages
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpdateTokenModalOpen, setIsUpdateTokenModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  // New state variables to manage the UI feedback
  const [isTokenUpdating, setIsTokenUpdating] = useState(false);
  const [tokenUpdateError, setTokenUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state for success modal

  useEffect(() => {
    const token = localStorage.getItem("bulkup_data_admin_token");
    const userId = localStorage.getItem("bulkup_data_admin_userId");
    const name = localStorage.getItem("bulkup_data_admin_name");

    if (token && userId) {
      setIsAuthenticated(true);
      setAdminName(name);
    } else {
      setIsAuthenticated(false);
      setIsAuthModalOpen(true);
    }
  }, []);

  // Effect to show alerts based on local state
  useEffect(() => {
    if (tokenUpdateError) {
      alert(`Error updating token: ${tokenUpdateError}`);
      setTokenUpdateError(null); // Clear the error after showing
    }
    // No alert needed for success message here, as we are using a modal instead
  }, [tokenUpdateError]);

  const handleLoginSuccess = () => {
    const name = localStorage.getItem("bulkup_data_admin_name");
    setIsAuthenticated(true);
    setAdminName(name);
    setIsAuthModalOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("bulkup_data_admin_token");
    localStorage.removeItem("bulkup_data_admin_userId");
    localStorage.removeItem("bulkup_data_isAdmin");
    localStorage.removeItem("bulkup_data_admin_name");
    setIsAuthenticated(false);
    setAdminName(null);
    setIsAuthModalOpen(true);
    setIsLogoutModalOpen(false);
  };

  const handleUpdateTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsTokenUpdating(true); // Set local loading state
    setTokenUpdateError(null); // Clear previous errors

    console.log("Dispatching updateReloadlyToken with:", {
      clientId,
      clientSecret,
    });

    try {
      const resultAction = await dispatch(
        updateReloadlyToken({ clientId, clientSecret })
      ).unwrap();

      console.log("Reloadly Access Token Update Success:", resultAction);
      setSuccessMessage(resultAction.message); // Set local success message

      // Close the input modal and open the success modal
      setIsUpdateTokenModalOpen(false);
      setIsSuccessModalOpen(true);

      // Clear inputs
      setClientId("");
      setClientSecret("");
    } catch (error: any) {
      console.error("Reloadly Access Token Update Failed:", error);
      setTokenUpdateError(error); // Set local error message
    } finally {
      setIsTokenUpdating(false); // Reset local loading state
    }
  };

  return (
    <div className="admin-container">
      {isAuthenticated ? (
        <div className="admin-card">
          <div className="admin-icon">
            <FaUserShield size={28} color="#000" />
          </div>
          <h1>Welcome {adminName ? adminName : "Admin"} to the Admin Panel!</h1>
          <p>You have successfully logged in.</p>

          <button
            className="admin-btn primary-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Proceed to Dashboard
          </button>
          <button
            className="admin-btn secondary-btn"
            onClick={() => navigate("/admin-users")}
          >
            Bulk Buyers
          </button>
          <button
            className="admin-btn secondary-btn"
            style={{display:'none'}}
            onClick={() => setIsUpdateTokenModalOpen(true)}
          >
            Update Access Token
          </button>
          <button
            className="admin-btn secondary-btn"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-icon danger">
            <FaLock size={28} color="#000" />
          </div>
          <h1>Admin Access Required</h1>
          <p>Please log in to continue.</p>
          <button
            className="admin-btn primary-btn"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Admin Login
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn secondary-btn"
                style={{ height: 50, margin: 0, fontSize: 13 }}
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn primary-btn"
                style={{ height: 50, margin: 0, fontSize: 13 }}
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Token Modal (for input) */}
      {isUpdateTokenModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>Update Access Token</h2>
            <form onSubmit={handleUpdateTokenSubmit}>
              <div className="form-group">
                <label htmlFor="clientId">Client ID</label>
                <input
                  type="text"
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Your account's client ID"
                  required
                  disabled={isTokenUpdating}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientSecret">Client Secret</label>
                <input
                  type="password"
                  id="clientSecret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Your account's client secret"
                  required
                  disabled={isTokenUpdating}
                />
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn secondary-btn"
                  style={{ height: 50, margin: 0, fontSize: 13 }}
                  onClick={() => setIsUpdateTokenModalOpen(false)}
                  disabled={isTokenUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn primary-btn"
                  style={{ height: 50, margin: 0, fontSize: 13 }}
                  disabled={isTokenUpdating}
                >
                  {isTokenUpdating ? "Updating..." : "Update Token"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Success Message Modal */}
      {isSuccessModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card success-card">
            <h2>Success!</h2>
            <p>{successMessage}</p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn primary-btn"
                style={{ height: 50, margin: 0, fontSize: 13 }}
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminAuth
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Admin;
