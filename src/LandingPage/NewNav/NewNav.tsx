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

  const userId = localStorage.getItem("bulkup_data_userId");
  const adminId = localStorage.getItem("bulkup_data_admin_userId");

  
  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: 120,
              height: 28,
              cursor: "pointer",
            }}
          />
        </div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeNavbar}>
            Home
          </NavLink>
          <NavLink
              to="/faqs"
              className="nav-link"
              onClick={closeNavbar}
            >
              Faqs
            </NavLink>

          {userId && (
            <NavLink
              to="/user-recharge"
              className="nav-link"
              onClick={closeNavbar}
            >
              My Recharges
            </NavLink>
          )}
          {adminId && (
            <NavLink
              to="/admin"
              className="nav-link"
              onClick={closeNavbar}
            >
              Admin
            </NavLink>
          )}
          <NavLink
            to="/privacy-policy"
            className="nav-link"
            onClick={closeNavbar}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/feedback"
            className="nav-link"
            onClick={closeNavbar}
          >
          Feedback
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
