import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
} from "../../redux/Auth/authSlice";
import "./AuthModal.css";

type AuthView = "login" | "register" | "otpVerification";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = "login",
}) => {
  const dispatch = useDispatch();

  // Form states
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [name, setName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Feedback & token
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetAllFields();
    }
  }, [isOpen]);

  // Close modal on successful authentication
  useEffect(() => {
    if (token) {
      onClose();
    }
  }, [token, onClose]);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const resultAction: any = await dispatch(
        registerUser({ name, email: formEmail }) as any
      );
      if (registerUser.fulfilled.match(resultAction)) {
        setSubmittedEmail(formEmail);
        setMessage(
          resultAction.payload.message ||
            "Registration successful. Please verify your email."
        );
        setCurrentView("otpVerification");
      } else {
        setError(resultAction.payload || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const resultAction: any = await dispatch(loginUser(formEmail) as any);
      if (loginUser.fulfilled.match(resultAction)) {
        setSubmittedEmail(formEmail);
        setMessage(resultAction.payload.message || "OTP sent to your email.");
        setCurrentView("otpVerification");
      } else {
        setError(resultAction.payload || "Login failed.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const resultAction: any = await dispatch(
        verifyOtp({ email: submittedEmail, otp }) as any
      );

      if (verifyOtp.fulfilled.match(resultAction)) {
        const token = resultAction.payload.token;
        const userId = resultAction.payload.userId;
        setMessage(resultAction.payload.message || "OTP verified!");

        if (token) {
          // save token in localStorage as bulkup_data_token
          localStorage.setItem("bulkup_data_token", token);
          localStorage.setItem("bulkup_data_userId", userId);
          //bulkup_data_userId
          // still update state if you need to trigger useEffect/onClose
          setToken(token);
        }
      } else {
        setError(resultAction.payload || "OTP verification failed.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!submittedEmail) {
      setError("Missing email to resend OTP.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const resultAction: any = await dispatch(
        resendOtp(submittedEmail) as any
      );
      if (resendOtp.fulfilled.match(resultAction)) {
        setMessage(resultAction.payload.message || "New OTP sent.");
      } else {
        setError(resultAction.payload || "Failed to resend OTP.");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error during OTP resend.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <button className="auth-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Section Heading */}
        {currentView === "login" && (
          <>
            <h2 className="auth-modal-title">Login</h2>
            <p className="auth-description">
              Enter your email to receive a One-Time Password (OTP) and log in
              without a password.
            </p>
          </>
        )}

        {currentView === "register" && (
          <>
            <h2 className="auth-modal-title">Create Account</h2>
            <p className="auth-description">
              Sign up with your name and email. You'll receive a One-Time
              Password to verify your account.
            </p>
          </>
        )}

        {currentView === "otpVerification" && (
          <>
            <h2 className="auth-modal-title">Verify OTP</h2>
            <p className="auth-description">
              A verification code was sent to <strong>{submittedEmail}</strong>.
              Please enter it below to continue.
            </p>
          </>
        )}

        {/* Feedback Messages */}
        {loading && <p className="auth-message loading-message">Loading...</p>}
        {message && <p className="auth-message success-message">{message}</p>}
        {error && <p className="auth-message error-message">{error}</p>}

        {/* Forms */}
        {currentView === "register" && (
          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              Register
            </button>
            <p className="auth-switch-text">
              Already have an account?{" "}
              <span
                onClick={() => setCurrentView("login")}
                className="auth-link"
              >
                Login
              </span>
            </p>
          </form>
        )}

        {currentView === "login" && (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              Send OTP
            </button>
            <p className="auth-switch-text">
              Don’t have an account?{" "}
              <span
                onClick={() => setCurrentView("register")}
                className="auth-link"
              >
                Create Account
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
            />
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              Verify OTP
            </button>
            <p className="auth-switch-text">
              Didn’t receive OTP?{" "}
              <span onClick={handleResendOtp} className="auth-link">
                Resend
              </span>
            </p>
            <p className="auth-switch-text">
              <span
                onClick={() => setCurrentView("login")}
                className="auth-link"
              >
                Back to Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
