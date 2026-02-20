import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { createBooking } from "../firebase/bookingService";
import "../styles/payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no booking data
  if (!bookingData) {
    navigate("/booking");
    return null;
  }

  // Paystack public key (replace with your own)
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxx";

  // Convert total to kobo (Paystack uses kobo)
  const amountInKobo = bookingData.totalPrice * 100;

  // Paystack configuration
  const paystackConfig = {
    reference: `LAUNDRY-${new Date().getTime()}`,
    email: bookingData.customer.email,
    amount: amountInKobo,
    publicKey: publicKey,
  };

  // Payment success handler
  const handlePaymentSuccess = async (reference) => {
    setIsProcessing(true);

    try {
      // Save booking to Firebase with payment reference
      const bookingId = await createBooking({
        ...bookingData,
        paymentReference: reference.reference,
        paymentStatus: "paid",
        status: "pending",
      });

      // Navigate to confirmation page
      navigate("/confirmation", {
        state: {
          bookingId,
          reference: reference.reference,
          bookingData,
        },
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Payment successful but failed to save booking. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment close handler
  const handlePaymentClose = () => {
    console.log("Payment closed");
  };

  // Paystack component props
  const componentProps = {
    ...paystackConfig,
    text: isProcessing ? "Processing..." : "Pay Now",
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
  };

  return (
    <section className="payment">
      <div className="payment-container">
        <h1 className="payment-title">Complete Your Payment</h1>
        <p className="payment-subtitle">Review your order and proceed to payment</p>

        <div className="payment-content">
          {/* ORDER DETAILS */}
          <div className="order-details">
            <h2>Order Details</h2>

            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="detail-row">
                <span>Name:</span>
                <strong>{bookingData.customer.name}</strong>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <strong>{bookingData.customer.email}</strong>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <strong>{bookingData.customer.phone}</strong>
              </div>
              <div className="detail-row">
                <span>Address:</span>
                <strong>{bookingData.customer.address}</strong>
              </div>
              <div className="detail-row">
                <span>Delivery Date:</span>
                <strong>{bookingData.customer.deliveryDate}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h3>Selected Services</h3>
              <div className="services-list">
                {bookingData.services.map((service) => (
                  <span key={service} className="service-badge">
                    {service.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Items</h3>
              <div className="items-list">
                {bookingData.items.map((item, index) => (
                  <div key={index} className="item-detail">
                    <div className="item-name">
                      <span>{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <div className="item-pricing">
                      <span className="unit-price">
                        ₦{item.unitPrice.toLocaleString()} each
                      </span>
                      <strong className="item-total">
                        ₦{item.subtotal.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="payment-summary">
            <h2>Payment Summary</h2>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₦{bookingData.totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Service Fee:</span>
                <span>₦0</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <strong>₦{bookingData.totalPrice.toLocaleString()}</strong>
              </div>
            </div>

            <div className="payment-info">
              <p>💳 Secure payment powered by Paystack</p>
              <p>🔒 Your payment information is encrypted</p>
            </div>

            <PaystackButton className="paystack-btn" {...componentProps} />

            <button
              className="back-btn"
              onClick={() => navigate("/booking")}
              disabled={isProcessing}
            >
              Back to Booking
            </button>

            <div className="payment-methods">
              <p>We accept:</p>
              <div className="method-icons">
                <span>💳 Card</span>
                <span>🏦 Bank Transfer</span>
                <span>📱 USSD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
