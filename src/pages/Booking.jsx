import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/booking.css";
import { getPrices } from "../firebase/priceService";

const Booking = () => {
  const navigate = useNavigate();

  // CUSTOMER INFO
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });

  // SERVICES
  const [selectedServices, setSelectedServices] = useState([]);

  // ITEMS
  const [items, setItems] = useState({
    shirt: 0,
    trousers: 0,
    sweaters: 0,
    curtain: 0,
    rugs: 0,
  });

  // PRICES
  const [prices, setPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // FETCH PRICES FROM FIREBASE
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        console.log("✅ Prices loaded:", data);
        setPrices(data);
      } catch (err) {
        console.error("❌ Error loading prices:", err);
        alert("Failed to load prices. Please refresh the page.");
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  // TOGGLE SERVICE SELECTION
  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // GET PRICE FOR AN ITEM
  const getItemPrice = (itemName) => {
    if (!prices) return 0;

    // Heavy items have flat prices (no service required)
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

  // CALCULATE SUBTOTAL FOR AN ITEM
  const getItemSubtotal = (itemName, quantity) => {
    return quantity * getItemPrice(itemName);
  };

  // CALCULATE TOTAL COST
  const calculateTotal = () => {
    let total = 0;
    Object.entries(items).forEach(([itemName, quantity]) => {
      total += getItemSubtotal(itemName, quantity);
    });
    return total;
  };

  // GET MINIMUM DELIVERY DATE (tomorrow)
  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // HANDLE ITEM QUANTITY CHANGE
  const handleItemChange = (itemName, value) => {
    setItems((prev) => ({
      ...prev,
      [itemName]: Math.max(0, parseInt(value) || 0),
    }));
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    const totalItems = Object.values(items).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      alert("Please add at least one item");
      return;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      alert("Please fill in all customer details");
      return;
    }

    // Prepare booking data
    const bookingData = {
      customer,
      services: selectedServices,
      items: Object.entries(items)
        .filter(([_, qty]) => qty > 0)
        .map(([name, qty]) => ({
          name,
          quantity: qty,
          unitPrice: getItemPrice(name),
          subtotal: getItemSubtotal(name, qty),
        })),
      totalPrice: calculateTotal(),
      createdAt: new Date().toISOString(),
    };

    // Navigate to payment page
    navigate("/payment", { state: { bookingData } });
  };

  // LOADING STATE
  if (loadingPrices) {
    return (
      <div className="booking-loading">
        <div className="spinner"></div>
        <p>Loading prices...</p>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <section className="booking">
      <div className="booking-container">
        <h1 className="booking-title">Book Your Laundry Service</h1>
        <p className="booking-subtitle">
          Select your services, add items, and we'll take care of the rest
        </p>

        <form className="booking-form" onSubmit={handleSubmit}>
          {/* SERVICE SELECTION */}
          <div className="form-section">
            <h2>1. Select Service(s)</h2>
            <div className="service-options">
              <label className={selectedServices.includes("wash_fold") ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={selectedServices.includes("wash_fold")}
                  onChange={() => toggleService("wash_fold")}
                />
                <div className="service-info">
                  <strong>Wash & Fold</strong>
                  <span>Clean and neatly folded</span>
                </div>
              </label>

              <label className={selectedServices.includes("ironing") ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={selectedServices.includes("ironing")}
                  onChange={() => toggleService("ironing")}
                />
                <div className="service-info">
                  <strong>Ironing</strong>
                  <span>Professionally pressed</span>
                </div>
              </label>

              <label className={selectedServices.includes("dry_cleaning") ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={selectedServices.includes("dry_cleaning")}
                  onChange={() => toggleService("dry_cleaning")}
                />
                <div className="service-info">
                  <strong>Dry Cleaning</strong>
                  <span>Delicate fabric care</span>
                </div>
              </label>
            </div>

            {selectedServices.length === 0 && (
              <p className="warning-text">
                ⚠️ Please select at least one service to see clothing prices
              </p>
            )}
          </div>

          {/* CLOTHING ITEMS */}
          <div className="form-section">
            <h2>2. Add Clothing Items</h2>
            <div className="items-grid">
              {["shirt", "trousers", "sweaters"].map((item) => {
                const unitPrice = getItemPrice(item);
                const subtotal = getItemSubtotal(item, items[item]);

                return (
                  <div key={item} className="item-card">
                    <div className="item-header">
                      <h3>{item.charAt(0).toUpperCase() + item.slice(1)}</h3>
                      <span className="item-price">
                        {selectedServices.length > 0
                          ? `₦${unitPrice.toLocaleString()}/item`
                          : "Select service"}
                      </span>
                    </div>

                    <div className="item-controls">
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

                    {items[item] > 0 && (
                      <div className="item-subtotal">
                        Subtotal: <strong>₦{subtotal.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HEAVY ITEMS */}
          <div className="form-section">
            <h2>3. Add Heavy Items (Optional)</h2>
            <p className="section-note">Fixed pricing - no service selection required</p>

            <div className="items-grid">
              {["curtain", "rugs"].map((item) => {
                const unitPrice = getItemPrice(item);
                const subtotal = getItemSubtotal(item, items[item]);

                return (
                  <div key={item} className="item-card">
                    <div className="item-header">
                      <h3>{item.charAt(0).toUpperCase() + item.slice(1)}</h3>
                      <span className="item-price">₦{unitPrice.toLocaleString()}/item</span>
                    </div>

                    <div className="item-controls">
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

                    {items[item] > 0 && (
                      <div className="item-subtotal">
                        Subtotal: <strong>₦{subtotal.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="form-section">
            <h2>4. Your Details</h2>
            <div className="customer-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="08012345678"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Date *</label>
                  <input
                    type="date"
                    min={getMinDeliveryDate()}
                    value={customer.deliveryDate}
                    onChange={(e) =>
                      setCustomer({ ...customer, deliveryDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pickup/Delivery Address *</label>
                <textarea
                  placeholder="Enter your full address"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>Services:</span>
                <span>
                  {selectedServices.length > 0
                    ? selectedServices.map((s) => s.replace("_", " ")).join(", ")
                    : "None selected"}
                </span>
              </div>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{Object.values(items).reduce((sum, qty) => sum + qty, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="submit-btn" disabled={total === 0}>
            Proceed to Payment
          </button>
        </form>
      </div>
    </section>
  );
};

export default Booking;
