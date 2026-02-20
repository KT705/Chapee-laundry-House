import { useState } from "react";
import { getBookingByReference } from "../firebase/bookingService";
import "../styles/trackorder.css";

const TrackOrder = () => {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setBooking(null);

    if (!reference.trim()) {
      setError("Please enter a booking reference");
      return;
    }

    setLoading(true);

    try {
      const data = await getBookingByReference(reference.trim());
      if (data) {
        setBooking(data);
      } else {
        setError("No booking found with this reference");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Failed to fetch booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      ready: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#666";
  };

  const getStatusStep = (status) => {
    const steps = {
      pending: 1,
      processing: 2,
      ready: 3,
      delivered: 4,
      cancelled: 0,
    };
    return steps[status] || 0;
  };

  return (
    <section className="track-order">
      <div className="track-container">
        <h1 className="track-title">Track Your Order</h1>
        <p className="track-subtitle">
          Enter your booking reference to check your order status
        </p>

        {/* SEARCH FORM */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter booking reference (e.g., LAUNDRY-1234567890)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>

        {/* BOOKING DETAILS */}
        {booking && (
          <div className="booking-details">
            {/* STATUS HEADER */}
            <div
              className="status-header"
              style={{ background: getStatusColor(booking.status) }}
            >
              <h2>Order Status</h2>
              <div className="status-badge">{booking.status.toUpperCase()}</div>
            </div>

            {/* PROGRESS TRACKER */}
            {booking.status !== "cancelled" && (
              <div className="progress-tracker">
                {["pending", "processing", "ready", "delivered"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className={`progress-step ${
                        index + 1 <= getStatusStep(booking.status)
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="step-circle">
                        {index + 1 <= getStatusStep(booking.status) && "✓"}
                      </div>
                      <div className="step-label">{step}</div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* ORDER INFO */}
            <div className="order-info">
              <div className="info-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span>Name:</span>
                    <strong>{booking.customer.name}</strong>
                  </div>
                  <div className="info-item">
                    <span>Email:</span>
                    <strong>{booking.customer.email}</strong>
                  </div>
                  <div className="info-item">
                    <span>Phone:</span>
                    <strong>{booking.customer.phone}</strong>
                  </div>
                  <div className="info-item">
                    <span>Address:</span>
                    <strong>{booking.customer.address}</strong>
                  </div>
                  <div className="info-item">
                    <span>Delivery Date:</span>
                    <strong>{booking.customer.deliveryDate}</strong>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Services</h3>
                <div className="services-list">
                  {booking.services.map((service) => (
                    <span key={service} className="service-tag">
                      {service.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-section">
                <h3>Items</h3>
                <div className="items-list">
                  {booking.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-name">
                        {item.name}{" "}
                        <span className="item-qty">x{item.quantity}</span>
                      </span>
                      <span className="item-price">
                        ₦{item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="total-section">
                <span>Total Amount:</span>
                <strong>₦{booking.totalPrice.toLocaleString()}</strong>
              </div>

              <div className="payment-info">
                <span>Payment Status:</span>
                <span
                  className={`payment-badge ${
                    booking.paymentStatus === "paid" ? "paid" : "pending"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* ESTIMATED DELIVERY */}
            {booking.status !== "delivered" && booking.status !== "cancelled" && (
              <div className="delivery-estimate">
                <h4>📦 Estimated Delivery</h4>
                <p>{booking.customer.deliveryDate}</p>
              </div>
            )}

            {/* HELP SECTION */}
            <div className="help-section">
              <h4>Need Help?</h4>
              <p>Contact our customer support:</p>
              <div className="contact-options">
                <a href="tel:+2348012345678">📞 +234 801 234 5678</a>
                <a href="mailto:support@laundry.com">📧 support@laundry.com</a>
              </div>
            </div>
          </div>
        )}

        {/* NO SEARCH YET */}
        {!booking && !error && !loading && (
          <div className="no-search">
            <div className="search-icon">📦</div>
            <p>Enter your booking reference above to track your order</p>
            <p className="help-text">
              You can find your booking reference in the confirmation email
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrder;
