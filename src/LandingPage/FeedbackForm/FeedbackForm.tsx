import React, { useState } from "react";
import "./FeedbackForm.css";
import { FaQuestionCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { submitFeedback } from "../../redux/Auth/authSlice";
import { useNavigate } from "react-router-dom";

const FeedbackForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    suggestion: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✨ New loading state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true); // ✨ Set loading to true on submit

    dispatch(submitFeedback(formData))
      .then((resultAction) => {
        if (submitFeedback.fulfilled.match(resultAction)) {
          console.log("Feedback submitted successfully:", resultAction.payload);
          setFormData({ name: "", email: "", suggestion: "" });
          setShowSuccessModal(true);
        } else {
          const errorMsg =
            (resultAction.payload as { message?: string })?.message ||
            "Failed to submit feedback. Please try again.";
          console.log("Feedback submission failed:", errorMsg);
          setErrorMessage(errorMsg);
        }
      })
      .catch((error) => {
        const errorMsg =
          error?.message ||
          "An unexpected error occurred. Please try again later.";
        console.error("An unexpected error occurred:", error);
        setErrorMessage(errorMsg);
      })
      .finally(() => {
        setLoading(false); // ✨ Set loading to false when the promise settles
      });
  };

  return (
    <section className="feedback-form">
      <div className="feedback-header">
        <FaQuestionCircle className="feedback-icon" />
        <h2>Help Us Improve</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label>
          Name *
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email *
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Suggestion *
          <textarea
            name="suggestion"
            rows={5}
            placeholder="Share your suggestion with us..."
            value={formData.suggestion}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner-loader"></div> : "Submit"}
        </button>
      </form>

      <p className="feedback-note">
        We use your feedback to make <span>BulkUpData</span> better every day.
      </p>

      {showSuccessModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h2>🎉 Success!</h2>
            <p>
              Thanks {formData.name || "there"}! <br />
              We’ve got your suggestion and will respond to you quickly.
            </p>
            <div className="admin-modal-actions">
              <button
                onClick={() => navigate("/")}
                className="home-btn"
                style={{ width: "100%" }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeedbackForm;
