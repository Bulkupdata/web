import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  adminLogin,
  verifyAdminOtp,
  resendAdminOtp,
  createAdmin,
} from "../../redux/Reloadly/adminSlice";
import "./AuthModal.css";
import SpinnerLoader from "../../Components/SpinnerLoader/SpinnerLoader";

type AuthView = "login" | "otpVerification" | "createAdmin";

interface AdminAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  initialView?: AuthView;
}

const AdminAuth: React.FC<AdminAuthProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialView = "login",
}) => {
  const dispatch = useDispatch<any>();

  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [name, setName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetAllFields();
    }
  }, [isOpen]);

  const resetAllFields = () => {
    setName("");
    setFormEmail("");
    setSubmittedEmail("");
    setOtp("");
    setMessage(null);
    setError(null);
    setLoading(false);
    setCurrentView(initialView);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    dispatch(createAdmin({ name, email: formEmail }))
      .unwrap()
      .then((response: any) => {
        setMessage(response.message || "Admin account created successfully.");
        setFormEmail("");
        setName("");
      })
      .catch((err: string) => {
        setError(err || "Failed to create admin.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    dispatch(adminLogin(formEmail))
      .unwrap()
      .then((response: any) => {
        setSubmittedEmail(formEmail);
        setMessage(response.message || "OTP sent to your admin email.");
        setCurrentView("otpVerification");



      })
      .catch((err: string) => {
        setError(err || "Admin login failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    dispatch(verifyAdminOtp({ email: submittedEmail, otp }))
      .unwrap()
      .then((response: any) => {
        const { token, userId, admin } = response;
        setMessage(response.message || "OTP verified successfully!");

        localStorage.setItem("bulkup_data_admin_token", token);
        localStorage.setItem("bulkup_data_admin_userId", userId);
        localStorage.setItem(
          "bulkup_data_admin_name",
          admin
        );
        localStorage.setItem("bulkup_data_isAdmin", "true");

        onLoginSuccess();
      })
      .catch((err: string) => {
        setError(err || "OTP verification failed. Please check the code.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOtp = () => {
    if (!submittedEmail) {
      setError("No email found to resend OTP. Please go back to login.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    dispatch(resendAdminOtp(submittedEmail))
      .unwrap()
      .then((response: any) => {
        setMessage(response.message || "New OTP sent to your email.");
      })
      .catch((err: string) => {
        setError(err || "Failed to resend OTP.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <button className="auth-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {currentView === "login" && (
          <>
            <h2 className="auth-modal-title">Admin Login</h2>
            <p className="auth-description">
              Enter your admin email to receive a One-Time Password (OTP) and
              log in.
            </p>
          </>
        )}

        {currentView === "otpVerification" && (
          <>
            <h2 className="auth-modal-title">Verify Admin OTP</h2>
            <p className="auth-description">
              A verification code was sent to **{submittedEmail}**. Please enter
              it below to proceed to the admin dashboard.
            </p>
          </>
        )}

        {currentView === "createAdmin" && (
          <>
            <h2 className="auth-modal-title">Create New Admin</h2>
            <p className="auth-description">
              Enter details to create a new admin account.
            </p>
          </>
        )}

        {loading && (
          <p className="auth-message loading-message">
            <SpinnerLoader />
          </p>
        )}
        {message && <p className="auth-message success-message">{message}</p>}
        {error && (
          <p
            className="auth-message error-message"
            style={{ fontSize: 14, padding: 16, marginTop: -24 }}
          >
            {error}
          </p>
        )}

        {currentView === "createAdmin" && (
          <form onSubmit={handleCreateAdmin} className="auth-form">
            <input
              type="text"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              style={{ fontSize: "13px" }}
            />
            <input
              type="email"
              placeholder="Admin Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              className="auth-input"
              style={{ fontSize: "13px" }}
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ fontSize: "13px" }}
            >
              Create Admin
            </button>
            <p className="auth-switch-text">
              Already have an admin account?{" "}
              <span
                onClick={() => setCurrentView("login")}
                className="auth-link"
              >
                Admin Login
              </span>
            </p>
          </form>
        )}

        {currentView === "login" && (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Admin Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              className="auth-input"
              style={{ fontSize: "13px" }}
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ fontSize: "13px" }}
            >
              Send OTP
            </button>
            <p className="auth-switch-text">
              Need to create an admin account?{" "}
              <span
                onClick={() => setCurrentView("createAdmin")}
                className="auth-link"
              >
                Create Admin
              </span>
            </p>
          </form>
        )}

        {currentView === "otpVerification" && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="auth-input"
              style={{ fontSize: "13px" }}
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ fontSize: "13px" }}
            >
              Verify OTP
            </button>
            <p className="auth-switch-text">
              Did not receive OTP?{" "}
              <span onClick={handleResendOtp} className="auth-link">
                Resend
              </span>
            </p>
            <p className="auth-switch-text">
              <span
                onClick={() => setCurrentView("login")}
                className="auth-link"
              >
                Back to Admin Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
