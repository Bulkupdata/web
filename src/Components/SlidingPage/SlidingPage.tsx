import React from "react";
import "./SlidingPage.css";
import { useTheme } from "../../contexts/ThemeContext";

const slidingText =
  "Bulkup Data, Quick Recharge, Fast Recharge, Reliable Recharge, Data & Bundles, Airtimes ";

const SlidingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className="sliding-page"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="sliding-track">
        <span className="sliding-text">{slidingText.repeat(26)}</span>
        <span className="sliding-text">{slidingText.repeat(26)}</span>
      </div>
    </div>
  );
};

export default SlidingPage;