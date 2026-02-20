import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { getPrices } from "../firebase/priceService";
import "../styles/contact.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
    message: "",
  });

  // Services and Items
  const [selectedServices, setSelectedServices] = useState([]);
  const [items, setItems] = useState({
    shirt: 0,
    trousers: 0,
    sweaters: 0,
    curtain: 0,
    rugs: 0,
  });

  // Prices
  const [prices, setPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch prices from Firebase
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        console.log("✅ Prices loaded:", data);
        setPrices(data);
      } catch (err) {
        console.error("❌ Error loading prices:", err);
        setStatus({
          type: "error",
          message: "Failed to load prices. Please refresh the page.",
        });
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleItemChange = (itemName, value) => {
    setItems((prev) => ({
      ...prev,
      [itemName]: Math.max(0, parseInt(value) || 0),
    }));
  };

  // Get price for an item
  const getItemPrice = (itemName) => {
    if (!prices) return 0;

    // Heavy items have flat prices
    if (itemName === "curtain" || itemName === "rugs") {
      return prices.heavyItems?.[itemName] || 0;
    }

    // Regular clothes: sum prices from all selected services
    if (selectedServices.length === 0) return 0;

    let totalPrice = 0;
    selectedServices.forEach((service) => {
      const servicePrice = prices.services?.[service]?.[itemName];
      if (servicePrice) {
        totalPrice += servicePrice;
      }
    });

    return totalPrice;
  };

  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    Object.entries(items).forEach(([itemName, quantity]) => {
      total += quantity * getItemPrice(itemName);
    });
    return total;
  };

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Validation
    if (selectedServices.length === 0) {
      setStatus({
        type: "error",
        message: "Please select at least one service",
      });
      setIsSubmitting(false);
      return;
    }

    const totalItems = Object.values(items).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      setStatus({
        type: "error",
        message: "Please add at least one item",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryDate) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields",
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare email content
    const itemsList = Object.entries(items)
      .filter(([_, qty]) => qty > 0)
      .map(([name, qty]) => `${name}: ${qty} (₦${(qty * getItemPrice(name)).toLocaleString()})`)
      .join(", ");

    const emailData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address || "Not provided",
      delivery_date: formData.deliveryDate,
      services: selectedServices.map(s => s.replace("_", " ")).join(", "),
      items: itemsList,
      total_price: `₦${calculateTotal().toLocaleString()}`,
      message: formData.message || "No additional message",
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus({
        type: "success",
        message: "Booking request sent successfully! We'll contact you shortly.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        deliveryDate: "",
        message: "",
      });
      setSelectedServices([]);
      setItems({
        shirt: 0,
        trousers: 0,
        sweaters: 0,
        curtain: 0,
        rugs: 0,
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({
        type: "error",
        message: "Failed to send booking request. Please try again or call us.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal();

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Book Your Laundry Service</h1>
          <p>Fill the form below and we'll contact you to confirm your booking</p>
        </div>

        <div className="contact-content">
          {/* BOOKING FORM */}
          <div className="contact-form-wrapper">
            <h2>Booking & Contact Form</h2>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            {loadingPrices && (
              <div className="loading-prices">Loading prices...</div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              {/* SERVICES SELECTION */}
              <div className="form-section">
                <h3>1. Select Service(s) *</h3>
                <div className="services-checkboxes">
                  <label className={selectedServices.includes("wash_fold") ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes("wash_fold")}
                      onChange={() => toggleService("wash_fold")}
                    />
                    <span>Wash & Fold</span>
                  </label>

                  <label className={selectedServices.includes("ironing") ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes("ironing")}
                      onChange={() => toggleService("ironing")}
                    />
                    <span>Ironing</span>
                  </label>

                  <label className={selectedServices.includes("dry_cleaning") ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes("dry_cleaning")}
                      onChange={() => toggleService("dry_cleaning")}
                    />
                    <span>Dry Cleaning</span>
                  </label>
                </div>
              </div>

              {/* CLOTHING ITEMS */}
              <div className="form-section">
                <h3>2. Add Items *</h3>
                <div className="items-grid">
                  {["shirt", "trousers", "sweaters"].map((item) => (
                    <div key={item} className="item-input">
                      <label>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => handleItemChange(item, items[item] - 1)}
                          disabled={items[item] === 0}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={items[item]}
                          onChange={(e) => handleItemChange(item, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleItemChange(item, items[item] + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="item-price">
                        {selectedServices.length > 0
                          ? `₦${getItemPrice(item).toLocaleString()}/item`
                          : "Select service first"}
                      </span>
                    </div>
                  ))}
                </div>

                <h4>Heavy Items (Optional)</h4>
                <div className="items-grid">
                  {["curtain", "rugs"].map((item) => (
                    <div key={item} className="item-input">
                      <label>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => handleItemChange(item, items[item] - 1)}
                          disabled={items[item] === 0}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={items[item]}
                          onChange={(e) => handleItemChange(item, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleItemChange(item, items[item] + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="item-price">
                        ₦{getItemPrice(item).toLocaleString()}/item
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="form-section">
                <h3>3. Your Details *</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="08012345678"
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Date *</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      min={getMinDeliveryDate()}
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pickup/Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter your address (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions? (optional)"
                  />
                </div>
              </div>

              {/* TOTAL */}
              <div className="order-total">
                <h3>Total Amount</h3>
                <div className="total-amount">₦{total.toLocaleString()}</div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || total === 0}
              >
                {isSubmitting ? "Sending..." : "Submit Booking Request"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="contact-info">
            <h2>Contact Information</h2>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h3>Address</h3>
                  <p>123 Laundry Street</p>
                  <p>Kano, Nigeria</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p>+234 903 491 0951</p>
                  <p>+234 903 491 0951</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📧</div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>info@laundry.com</p>
                  <p>support@laundry.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🕒</div>
                <div className="info-content">
                  <h3>Business Hours</h3>
                  <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;