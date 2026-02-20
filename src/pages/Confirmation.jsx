import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, reference, bookingData } = location.state || {};

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingData) {
      navigate("/booking");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  return (
    <section className="confirmation">
      <div className="confirmation-container">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <h1 className="confirmation-title">Booking Confirmed! 🎉</h1>
        <p className="confirmation-subtitle">
          Thank you for choosing our laundry service
        </p>

        <div className="confirmation-content">
          {/* BOOKING REFERENCE */}
          <div className="reference-card">
            <h3>Your Booking Reference</h3>
            <div className="reference-number">{reference}</div>
            <p className="reference-note">
              Save this reference number for tracking your order
            </p>
          </div>

          {/* ORDER SUMMARY */}
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-section">
              <div className="summary-row">
                <span>Booking ID:</span>
                <strong>{bookingId || "Pending..."}</strong>
              </div>
              <div className="summary-row">
                <span>Customer Name:</span>
                <strong>{bookingData.customer.name}</strong>
              </div>
              <div className="summary-row">
                <span>Email:</span>
                <strong>{bookingData.customer.email}</strong>
              </div>
              <div className="summary-row">
                <span>Phone:</span>
                <strong>{bookingData.customer.phone}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery Date:</span>
                <strong>{bookingData.customer.deliveryDate}</strong>
              </div>
              <div className="summary-row">
                <span>Address:</span>
                <strong>{bookingData.customer.address}</strong>
              </div>
            </div>

            <div className="summary-section">
              <h4>Services Selected</h4>
              <div className="services-tags">
                {bookingData.services.map((service) => (
                  <span key={service} className="service-tag">
                    {service.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="summary-section">
              <h4>Items</h4>
              <div className="items-summary">
                {bookingData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span className="item-name">
                      {item.name} <span className="item-qty">x{item.quantity}</span>
                    </span>
                    <span className="item-price">
                      ₦{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-total">
              <span>Total Paid:</span>
              <strong>₦{bookingData.totalPrice.toLocaleString()}</strong>
            </div>
          </div>

          {/* NEXT STEPS */}
          <div className="next-steps-card">
            <h3>What Happens Next?</h3>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Confirmation Email</h4>
                  <p>
                    Check your email ({bookingData.customer.email}) for booking
                    confirmation and receipt
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Pickup Scheduled</h4>
                  <p>
                    Our team will contact you to schedule a convenient pickup time
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Processing</h4>
                  <p>Your items will be carefully cleaned and prepared</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Delivery</h4>
                  <p>
                    We'll deliver your fresh laundry on{" "}
                    <strong>{bookingData.customer.deliveryDate}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/track-order")}
            >
              Track Your Order
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/booking")}
            >
              Book Another Service
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>

          {/* CONTACT INFO */}
          <div className="contact-card">
            <h4>Need Help?</h4>
            <p>
              If you have any questions or need to make changes to your order,
              please contact us:
            </p>
            <div className="contact-methods">
              <a href="tel:+2348012345678">📞 +234 801 234 5678</a>
              <a href="mailto:support@laundry.com">📧 support@laundry.com</a>
            </div>
          </div>

          {/* WHATSAPP TRACKING REMINDER */}
          <div className="whatsapp-card">
            <div className="whatsapp-icon">💬</div>
            <h4>Stay Connected!</h4>
            <p>
              Track your order or make changes easily via WhatsApp. 
              Save our number and send us a message anytime!
            </p>
            <a 
              href={`https://wa.me/2348012345678?text=Hi! My booking reference is ${reference}. I'd like to track my order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <span className="whatsapp-logo">📱</span>
              Message us on WhatsApp
            </a>
            <p className="whatsapp-note">
              Send your booking reference: <strong>{reference}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;