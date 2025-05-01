import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bulkupdata-footer">
      <div className="bulkupdata-footer-inner">
        {/* Contact Us Section */}
        <div className="bulkupdata-footer-section">
          <h3 className="bulkupdata-footer-title">Contact Us</h3>
          <div className="bulkupdata-footer-contact">
            <p>
              <a href="mailto:info@bulkupdata.com">info@bulkupdata.com</a>
            </p>
          </div>
        </div>
      </div>

      <div className="bulkupdata-footer-bottom">
        &copy; {new Date().getFullYear()} BulkUpData. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;