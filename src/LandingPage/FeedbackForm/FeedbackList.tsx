import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getAllFeedbacks } from "../../redux/Auth/authSlice";
import "./FeedbackList.css";
import Modal from "./Modal"; // Import the Modal component

type Feedback = {
  _id?: string;
  name: string;
  email: string;
  suggestion: string;
  createdAt?: string;
};

const FeedbackList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for modal
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFeedbacks = () => {
    setLoading(true);
    setError(null);

    dispatch(getAllFeedbacks() as any)
      .then((resultAction: any) => {
        setLoading(false);
        if (getAllFeedbacks.fulfilled.match(resultAction)) {
          setFeedbacks(resultAction.payload || []);
        } else {
          const message =
            resultAction.payload ||
            resultAction.error?.message ||
            "Failed to load feedbacks";
          setError(message);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.error("Unexpected error loading feedbacks:", err);
        setError("An unexpected error occurred.");
      });
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleRowClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="feedback-list-wrapper">
      <div className="feedback-list-header">
        <h2>Submitted Feedbacks</h2>
        <div>
          <button
            className="btn-refresh"
            onClick={loadFeedbacks}
            disabled={loading}
            aria-label="Refresh feedback list"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {error && <div className="feedback-error">{error}</div>}

      {!loading && feedbacks.length === 0 && !error && (
        <div className="no-feedbacks-found">No feedbacks found.</div>
      )}

      {!loading && feedbacks.length > 0 && (
        <div className="feedback-table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Suggestion</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f, idx) => (
                <tr
                  key={f?._id || idx}
                  onClick={() => handleRowClick(f)}
                  className="clickable-row"
                >
                  <td>{idx + 1}</td>
                  <td>{f?.name}</td>
                  <td>
                    <a
                      href={`mailto:${f?.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="email-link"
                    >
                      {f?.email}
                    </a>
                  </td>
                  <td className="suggestion-cell">
                    {f?.suggestion?.length > 30
                      ? f?.suggestion?.slice(0, 30) + "..."
                      : f?.suggestion}
                  </td>{" "}
                  <td>
                    {f?.createdAt
                      ? new Date(f?.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* The Modal Component */}
      {isModalOpen && selectedFeedback && (
        <Modal onClose={handleCloseModal}>
          <div className="feedback-modal-content">
            <h3>Feedback Details</h3>
            <p>
              <strong>Name:</strong> {selectedFeedback.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedFeedback.email}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {selectedFeedback.createdAt
                ? new Date(selectedFeedback.createdAt).toLocaleString()
                : "-"}
            </p>
            <p>
              <strong>Suggestion:</strong>
            </p>
            <div className="modal-suggestion-box" style={{ marginTop: -8 }}>
              <p>{selectedFeedback?.suggestion}</p>
            </div>

            {/* Send Email Button */}
            <div style={{ marginTop: 20 }}>
              <a
                href={`mailto:${selectedFeedback.email}`}
                style={{
                  backgroundColor: "#ffeb3b",
                  border: "1px solid #000",
                  borderRadius: 6,
                  padding: "10px 16px",
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Send Email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FeedbackList;
