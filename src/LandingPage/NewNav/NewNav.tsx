import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NewNav.css";
import BuyDataModal from "../Modal/BuyDataModal";
import { useTheme } from "../../contexts/ThemeContext";
import logo from "../../assets/images/bud.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const toggleNavbar = (): void => setIsOpen(!isOpen);
  const closeNavbar = (): void => setIsOpen(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          {/* <h5>BulkupData</h5> */}
          <img
            src={logo}
            alt="logo"
            style={{
              width: 120,
              height: 36,
              cursor:'pointer'
            }}
          />
        </div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeNavbar}>
            Home
          </NavLink>
          <NavLink
            to="/privacy-policy"
            className="nav-link"
            onClick={closeNavbar}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/terms-and-conditions"
            className="nav-link"
            onClick={closeNavbar}
          >
            Terms & Conditions
          </NavLink>
          <button
            className="donate-btn"
            style={{ border: "none" }}
            onClick={() => setShowModal(true)}
          >
            Buy Data
          </button>
        </div>

        <div className="menu-icon" onClick={toggleNavbar}>
          {isOpen ? "✕" : "☰"}
        </div>
      </nav>
      {isOpen && <div className="backdrop" onClick={closeNavbar}></div>}
      <BuyDataModal
        isOpen={showModal}
        themeMode={theme}
        onClose={() => setShowModal(false)}
      />{" "}
    </>
  );
};

export default Navbar;
