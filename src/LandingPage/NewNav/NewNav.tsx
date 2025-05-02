import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NewNav.css";
import logo from "../../assets/images/logo.png";
import BuyDataModal from "../Modal/BuyDataModal";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNavbar = (): void => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = (): void => {
    setIsOpen(false);
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img
            src={logo}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.9)",
            }}
          />
        </div>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeNavbar}>
            Home
          </NavLink>{" "}
          <NavLink to="/faq" className="nav-link" onClick={closeNavbar}>
            FAQS
          </NavLink>
          {/* */}
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

      <BuyDataModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Navbar;
