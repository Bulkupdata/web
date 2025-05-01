import React, { useState } from "react";
import "./FAQPage.css";
import AddIcon from "../../Components/Icons/AddIcon";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggleAnswer = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqItems: FAQItem[] = [
    {
      question: "What is BulkUpData?",
      answer:
        "BulkUpData is a smart data-sharing platform that allows users to save on mobile data by pooling resources to purchase bulk bundles at lower rates.",
    },
    {
      question: "How do I get data?",
      answer:
        "Simply sign up, join a group pool, or go solo—then choose a plan and receive your data instantly.",
    },
    {
      question: "Is there a subscription fee?",
      answer: "No. You only pay when you buy a data plan.",
    },
    {
      question: "How fast will I receive my data?",
      answer:
        "Instantly. Once payment is confirmed, your data is delivered without delay.",
    },
    {
      question: "Can I buy data alone without a group?",
      answer:
        "Yes. You can purchase data individually and still enjoy discounted rates.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="faq-container">
        <h1 className="faq-header">Frequently Asked Questions</h1>
        <p className="faq-subtext">
          Got questions about BulkUpData? We’ve answered the most common ones
          here.
        </p>

        {faqItems.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() => handleToggleAnswer(index)}
              aria-expanded={activeIndex === index}
            >
              <h3 className="faq-title">{faq.question}</h3>
              <span
                style={{
                  marginLeft: 12,
                  backgroundColor: "#023009",
                  border: "1px solid #023009",
                  borderRadius: "50%",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon width={16} height={16} color="#FFD000" />
              </span>
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
