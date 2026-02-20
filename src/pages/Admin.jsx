import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getPrices, updatePrices } from "../firebase/priceService";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../data/testimonials.js";
import "../styles/admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("prices");
  
  const [prices, setPrices] = useState(null);
  const [editingPrices, setEditingPrices] = useState(false);
  const [priceForm, setPriceForm] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    image: "",
    review: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadData();
      } else {
        navigate("/admin-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadData = async () => {
    try {
      const pricesData = await getPrices();
      setPrices(pricesData);
      setPriceForm(JSON.parse(JSON.stringify(pricesData)));

      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePriceChange = (category, subcategory, item, value) => {
    setPriceForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: item
          ? {
              ...prev[category][subcategory],
              [item]: parseInt(value) || 0,
            }
          : parseInt(value) || 0,
      },
    }));
  };

  const handleSavePrices = async () => {
    try {
      await updatePrices(priceForm);
      setPrices(priceForm);
      setEditingPrices(false);
      alert("Prices updated successfully!");
    } catch (error) {
      console.error("Error updating prices:", error);
      alert("Failed to update prices");
    }
  };

  const handleCancelPriceEdit = () => {
    setPriceForm(JSON.parse(JSON.stringify(prices)));
    setEditingPrices(false);
  };

  const handleTestimonialFormChange = (e) => {
    setTestimonialForm({
      ...testimonialForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      await addTestimonial(testimonialForm);
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
      setTestimonialForm({ name: "", image: "", review: "" });
      setShowTestimonialForm(false);
      alert("Testimonial added successfully!");
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial");
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial.id);
    setTestimonialForm({
      name: testimonial.name,
      image: testimonial.image,
      review: testimonial.review,
    });
    setShowTestimonialForm(true);
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    try {
      await updateTestimonial(editingTestimonial, testimonialForm);
      const testimonialsData = await getTestimonials();
      setTestimonials(testimonialsData);
      setTestimonialForm({ name: "", image: "", review: "" });
      setShowTestimonialForm(false);
      setEditingTestimonial(null);
      alert("Testimonial updated successfully!");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      alert("Testimonial deleted successfully!");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <section className="admin">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage prices and testimonials</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </header>

        <div className="admin-tabs">
          <button
            className={activeTab === "prices" ? "active" : ""}
            onClick={() => setActiveTab("prices")}
          >
            💰 Manage Prices
          </button>
          <button
            className={activeTab === "testimonials" ? "active" : ""}
            onClick={() => setActiveTab("testimonials")}
          >
            ⭐ Manage Reviews
          </button>
        </div>

        {activeTab === "prices" && (
          <div className="admin-content">
            <div className="content-header">
              <h2>Service Prices</h2>
              {!editingPrices ? (
                <button
                  className="edit-btn"
                  onClick={() => setEditingPrices(true)}
                >
                  ✏️ Edit Prices
                </button>
              ) : (
                <div className="button-group">
                  <button className="save-btn" onClick={handleSavePrices}>
                    ✓ Save Changes
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={handleCancelPriceEdit}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="prices-section">
              <h3>Regular Services</h3>
              {priceForm && Object.entries(priceForm.services || {}).map(([serviceName, items]) => (
                <div key={serviceName} className="price-category">
                  <h4>{serviceName.replace("_", " ").toUpperCase()}</h4>
                  <div className="price-grid">
                    {Object.entries(items).map(([itemName, price]) => (
                      <div key={itemName} className="price-item">
                        <label>{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</label>
                        <div className="price-input-wrapper">
                          <span>₦</span>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                              handlePriceChange(
                                "services",
                                serviceName,
                                itemName,
                                e.target.value
                              )
                            }
                            disabled={!editingPrices}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="prices-section">
              <h3>Heavy Items</h3>
              <div className="price-grid">
                {priceForm && Object.entries(priceForm.heavyItems || {}).map(([itemName, price]) => (
                  <div key={itemName} className="price-item">
                    <label>{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</label>
                    <div className="price-input-wrapper">
                      <span>₦</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(
                            "heavyItems",
                            itemName,
                            null,
                            e.target.value
                          )
                        }
                        disabled={!editingPrices}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="admin-content">
            <div className="content-header">
              <h2>Customer Reviews</h2>
              <button
                className="add-btn"
                onClick={() => {
                  setShowTestimonialForm(true);
                  setEditingTestimonial(null);
                  setTestimonialForm({ name: "", image: "", review: "" });
                }}
              >
                ➕ Add Review
              </button>
            </div>

            {showTestimonialForm && (
              <div className="testimonial-form-wrapper">
                <form
                  onSubmit={
                    editingTestimonial
                      ? handleUpdateTestimonial
                      : handleAddTestimonial
                  }
                  className="testimonial-form"
                >
                  <h3>
                    {editingTestimonial ? "Edit Review" : "Add New Review"}
                  </h3>

                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={testimonialForm.name}
                      onChange={handleTestimonialFormChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={testimonialForm.image}
                      onChange={handleTestimonialFormChange}
                      placeholder="/src/assets/testimonials/user1.jpg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Review *</label>
                    <textarea
                      name="review"
                      value={testimonialForm.review}
                      onChange={handleTestimonialFormChange}
                      required
                      rows="4"
                      placeholder="Write the customer's review..."
                    />
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="submit-btn">
                      {editingTestimonial ? "Update Review" : "Add Review"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowTestimonialForm(false);
                        setEditingTestimonial(null);
                        setTestimonialForm({ name: "", image: "", review: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="testimonials-list">
              {testimonials.length === 0 ? (
                <p className="no-data">No reviews yet. Add your first one!</p>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card-admin">
                    {testimonial.image && (
                      <img src={testimonial.image} alt={testimonial.name} />
                    )}
                    <div className="testimonial-content">
                      <h4>{testimonial.name}</h4>
                      <p>"{testimonial.review}"</p>
                    </div>
                    <div className="testimonial-actions">
                      <button
                        className="edit-btn-small"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;