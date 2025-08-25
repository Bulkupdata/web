import React, { useState } from "react";
import "./FeedbackForm.css";
import { FaQuestionCircle } from "react-icons/fa";

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    suggestion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:support@lukasdesignlab.com?subject=Suggestion from ${formData.name}&body=${formData.suggestion}`;
  };

  return (
    <section className="feedback-form">
      <div className="feedback-header">
        <FaQuestionCircle className="feedback-icon" />
        <h2>Help Us Improve</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
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

        <button type="submit">Submit</button>
      </form>

      <p className="feedback-note">
        We use your feedback to make <span>BulkUpData</span> better every day.
      </p>
    </section>
  );
};

export default FeedbackForm;