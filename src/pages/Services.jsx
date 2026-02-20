import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPrices } from "../firebase/priceService";
import "../styles/services.css";

const Services = () => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        console.log("✅ Service prices loaded:", data);
        setPrices(data);
      } catch (err) {
        console.error("❌ Error loading prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Get lowest price from service for display
  const getServicePrice = (serviceName) => {
    if (!prices || !prices.services || !prices.services[serviceName]) {
      return "Loading...";
    }

    const servicePrices = prices.services[serviceName];
    const priceValues = Object.values(servicePrices).filter(p => typeof p === 'number');
    
    if (priceValues.length === 0) return "N/A";
    
    const minPrice = Math.min(...priceValues);
    return `From ₦${minPrice.toLocaleString()}/item`;
  };

  const getHeavyItemPrice = (itemName) => {
    if (!prices || !prices.heavyItems || !prices.heavyItems[itemName]) {
      return "Loading...";
    }
    return `₦${prices.heavyItems[itemName].toLocaleString()}/item`;
  };

  const services = [
    {
      icon: "👕",
      title: "Wash & Fold",
      serviceName: "wash_fold",
      description:
        "Professional washing and neat folding for your everyday clothes",
      features: [
        "Premium detergents",
        "Soft fabric care",
        "Neatly folded",
        "24-48 hour turnaround",
      ],
    },
    {
      icon: "🔥",
      title: "Ironing Service",
      serviceName: "ironing",
      description:
        "Crisp, professionally pressed garments ready to wear immediately",
      features: [
        "Professional pressing",
        "Steam iron technology",
        "Wrinkle-free finish",
        "Hanger service available",
      ],
    },
    {
      icon: "✨",
      title: "Dry Cleaning",
      serviceName: "dry_cleaning",
      description:
        "Specialized care for delicate fabrics and high-end garments",
      features: [
        "Gentle dry cleaning",
        "Stain removal expertise",
        "Fabric protection",
        "Perfect for suits & dresses",
      ],
    },
  ];

  const heavyItems = [
    {
      icon: "🏡",
      title: "Curtains",
      itemName: "curtain",
      description: "Deep cleaning for curtains with odor and stain removal",
    },
    {
      icon: "🧺",
      title: "Rugs",
      itemName: "rugs",
      description: "Professional rug cleaning with color protection",
    },
  ];

  const addons = [
    {
      icon: "🚚",
      title: "Free Pickup & Delivery",
      description: "We come to you at your convenience",
    },
    {
      icon: "⚡",
      title: "Express Service",
      description: "Same-day service available for urgent needs",
    },
    {
      icon: "🌿",
      title: "Eco-Friendly Products",
      description: "Biodegradable detergents that care for the environment",
    },
    {
      icon: "💎",
      title: "Quality Guarantee",
      description: "Not satisfied? We'll re-clean for free or refund 100%",
    },
  ];

  if (loading) {
    return (
      <div className="services-page">
        <section className="services-hero">
          <div className="container">
            <h1>Our Services</h1>
            <p>Loading prices...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* HERO SECTION */}
      <section className="services-hero">
        <div className="container">
          <h1 data-aos="fade-down">Our Services</h1>
          <p data-aos="fade-down" data-aos-delay="100">
            Professional laundry solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* MAIN SERVICES */}
      <section className="main-services">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-detailed-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="service-icon-large">{service.icon}</div>
                <h2>{service.title}</h2>
                <p className="service-description">{service.description}</p>

                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="service-price">
                  {getServicePrice(service.serviceName)}
                </div>

                <Link to="/contact" className="service-btn">
                  Book Now
                </Link>
              </div>
            ))}
          </div>

          {/* HEAVY ITEMS */}
          <h2 className="section-title" style={{marginTop: "4rem"}} data-aos="fade-up">
            Heavy Items
          </h2>
          <div className="services-grid" style={{maxWidth: "900px", margin: "2rem auto 0"}}>
            {heavyItems.map((item, index) => (
              <div
                key={index}
                className="service-detailed-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="service-icon-large">{item.icon}</div>
                <h2>{item.title}</h2>
                <p className="service-description">{item.description}</p>

                <div className="service-price">
                  {getHeavyItemPrice(item.itemName)}
                </div>

                <Link to="/contact" className="service-btn">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADDONS SECTION */}
      <section className="addons-section">
        <div className="container">
          <h2 data-aos="fade-up">What Makes Us Different</h2>
          <p
            className="section-subtitle"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Extra value included in every order
          </p>

          <div className="addons-grid">
            {addons.map((addon, index) => (
              <div
                key={index}
                className="addon-card"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="addon-icon">{addon.icon}</div>
                <h3>{addon.title}</h3>
                <p>{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section">
        <div className="container">
          <h2 data-aos="fade-up">Our Process</h2>
          <p
            className="section-subtitle"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Quality care in every step
          </p>

          <div className="process-timeline">
            <div
              className="process-step"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="process-number">1</div>
              <div className="process-content">
                <h3>Inspection</h3>
                <p>
                  Each item is carefully inspected for stains and special care
                  requirements
                </p>
              </div>
            </div>

            <div
              className="process-step"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="process-number">2</div>
              <div className="process-content">
                <h3>Treatment</h3>
                <p>
                  Stains are pre-treated with specialized solutions for best
                  results
                </p>
              </div>
            </div>

            <div
              className="process-step"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <div className="process-number">3</div>
              <div className="process-content">
                <h3>Cleaning</h3>
                <p>
                  Professional washing or dry cleaning with premium detergents
                </p>
              </div>
            </div>

            <div
              className="process-step"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="process-number">4</div>
              <div className="process-content">
                <h3>Finishing</h3>
                <p>
                  Ironing, folding, and quality check before delivery to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Ready to Get Started?</h2>
            <p>Book your first order and experience premium laundry service</p>
            <Link to="/contact" className="btn btn-cta">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;