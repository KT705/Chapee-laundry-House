function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h3>FreshFold Laundry</h3>
          <p>
            Professional laundry and dry cleaning services with fast pickup
            and doorstep delivery.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📍 Kano, Nigeria</p>
          <p>📞 +234 903 491 0951</p>
          <p>✉️ info@freshfoldlaundry.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FreshFold Laundry. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
