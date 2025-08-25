import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./LiveChatButton.css";

const LiveChatButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/2347019758061"
      target="_blank"
      rel="noopener noreferrer"
      className="live-chat-btn"
    >
      <FaWhatsapp className="chat-icon" />
      <span>Live Chat</span>
    </a>
  );
};

export default LiveChatButton;