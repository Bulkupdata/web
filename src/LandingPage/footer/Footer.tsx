import { FaTelegram, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import "./Footer.css";

const iconStyle = { fontSize: 24, color: "#fff" };

const Footer = () => {
  return (
    <footer className="bulkupdata-footer">
      <div className="bulkupdata-footer-inner">
        {/* Contact Us Section */}
        <div className="bulkupdata-footer-section">
          {/* <h3 className="bulkupdata-footer-title">Contact Us</h3> */}
          <div>
            <h3 className="bulkupdata-footer-title">For General Support</h3>
            <div className="bulkupdata-footer-contact">
              <p>
                <a href="mailto:support@lukasdesignlab.com">
                  support@lukasdesignlab.com
                </a>{" "}
              </p>
            </div>
          </div>
          <br /> <br /> <br /> <br />
          <div>
            <h3 className="bulkupdata-footer-title">
              For Bulk Deals & Partnerships
            </h3>
            <div className="bulkupdata-footer-contact">
              <p>
                <a href="mailto:business@lukasdesignlab.com">
                  business@lukasdesignlab.com
                </a>{" "}
              </p>
            </div>
          </div>
        </div>
        <br /> <br /> <br /> <br />
        <div className="bulkupdata-footer-links-wrapper">
          <ul className="bulkupdata-footer-links">
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms-and-conditions">Terms & Conditions</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
            <li>
              <a href="/feedback">Feedback</a>
            </li>
          </ul>
        </div>
        {/* Socials Section */}
        <div className="bulkupdata-footer-section">
          <h3 className="bulkupdata-footer-title">Follow Us</h3>
          <div className="bulkupdata-footer-socials">
            <a
              href="https://t.me/BulkUpData"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaTelegram style={iconStyle} />
            </a>
            <a
              href="https://instagram.com/bulkupdata"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaInstagram style={iconStyle} />
            </a>
            <a
              href="https://x.com/bulkupdata"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaXTwitter style={iconStyle} />
            </a>
            <a
              href="https://tiktok.com/@bulkupdata"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <SiTiktok style={iconStyle} />
            </a>
          </div>
        </div>
      </div>

      <div className="bulkupdata-footer-bottom">
        {/* &copy; {new Date().getFullYear()} */}© 2025 BulkUpData. An
        innovation from Lukas Design Lab. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
