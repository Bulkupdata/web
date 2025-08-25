import React, { useState } from "react";
import "./FAQPage.css";
import { FaQuestionCircle } from "react-icons/fa";

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
        "BulkUpData is a smart data platform that allows you to purchase affordable mobile data plans directly through our system at discounted rates.",
    },
    {
      question: "How do I purchase data?",
      answer:
        "Simply sign up, log in, choose your preferred data plan, and complete payment. Your data will be delivered instantly.",
    },
    {
      question: "Is there a subscription or membership fee?",
      answer:
        "No. There are no hidden fees or subscriptions—you only pay for the data plans you purchase.",
    },
    {
      question: "How quickly will I receive my data?",
      answer:
        "Your data is delivered instantly once your payment is confirmed. In rare cases, delivery may take a few minutes due to network delays.",
    },
    {
      question: "Which networks are supported?",
      answer:
        "BulkUpData currently supports all major mobile networks in Nigeria, including MTN, Airtel, Glo, and 9Mobile.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept multiple payment options including bank transfer, debit/credit cards, and secure online payment gateways.",
    },
    {
      question: "Can I buy data for someone else?",
      answer:
        "Yes. You can enter any valid mobile number while purchasing and the data will be delivered directly to that recipient.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Absolutely. We use secure encryption and industry best practices to ensure your personal and payment information is fully protected.",
    },
    {
      question: "What should I do if I don’t receive my data?",
      answer:
        "If your data does not arrive within a few minutes, please contact our support team with your transaction details, and we will resolve it promptly.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="faq-container">
        <br /> <br /> <br />
        <h1 className="faq-header">Frequently Asked Questions</h1>
        <p className="faq-subtext">
          Have questions about BulkUpData? Here are answers to the most common
          ones.
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
            
                  borderRadius: "50%",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaQuestionCircle size={16} color="#000" />
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
