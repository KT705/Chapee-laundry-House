// src/pages/Home.jsx
import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TestimonialSlider from "../components/TestimonialSlider";
import { faTruck, faJugDetergent, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="home-page">

      <section className="hero">
        <div className="hero-overlay">
          <div className="container">
            <div 
              className="hero-text"
              data-aos="fade-right"
              data-aos-delay="1000"
            >
              <h1>Your Trusted Laundry & Dry Cleaning Service</h1>
              <p>
                Professional laundry services with fast pickup and doorstep delivery.
                Clean clothes. Zero stress.
              </p>

              <a 
                href="/contact" 
                className="cta"
                data-aos="zoom-in"
                data-aos-delay="600"
              >
                Schedule a Pickup
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="wrapper">
          <h2 
            className="section-title"
            data-aos="fade-up"
          >
            How It Works
          </h2>

          <div className="steps">
            <div className="step" data-aos="fade-up" data-aos-delay="100">
              <FontAwesomeIcon icon={faTruck} size="4x" color="red"/>
              <h3>Schedule Pickup</h3>
              <p>Choose a pickup time that works for you. We’ll handle the rest.</p>
            </div>

            <div className="step" data-aos="fade-up" data-aos-delay="300">
              <FontAwesomeIcon icon={faJugDetergent} size="4x" color="blue"/>
              <h3>We Clean</h3>
              <p>Your clothes are professionally washed, dried, and folded.</p>
            </div>

            <div className="step" data-aos="fade-up" data-aos-delay="500">
              <FontAwesomeIcon icon={faDoorOpen} size="4x" color="green"/>
              <h3>Doorstep Delivery</h3>
              <p>Fresh, clean clothes delivered right back to your door.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container2">
          <h2 
            className="section-title"
            data-aos="fade-up"
          >
            Our Services
          </h2>

          <div className="services-grid">

            <div className="service-card" data-aos="zoom-in-up" data-aos-delay="100">
              <img
                src="/src/assets/services/wash-fold.jpg"
                alt="Wash and Fold Service"
              />
              <h3>Wash & Fold</h3>
              <p>
                Everyday laundry cleaned, dried, and neatly folded with care.
              </p>
              <a href="/services" className="service-btn">Learn More</a>
            </div>

            <div className="service-card" data-aos="zoom-in-up" data-aos-delay="300">
              <img
                src="/src/assets/services/dry-cleaning.jpg"
                alt="Dry Cleaning Service"
              />
              <h3>Dry Cleaning</h3>
              <p>
                Professional dry cleaning for delicate and special garments.
              </p>
              <a href="/services" className="service-btn">Learn More</a>
            </div>

            <div className="service-card" data-aos="zoom-in-up" data-aos-delay="500">
              <img
                src="/src/assets/services/ironing.jpg"
                alt="Ironing Service"
              />
              <h3>Ironing</h3>
              <p>
                Crisp, wrinkle-free ironing for a polished, professional look.
              </p>
              <a href="/services" className="service-btn">Learn More</a>
            </div>

          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container3">
          <h2 
            className="section-title"
            data-aos="fade-up"
          >
            Customer Reviews
          </h2>

          <div data-aos="fade-up" data-aos-delay="200">
            <TestimonialSlider/>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container4">
          <div 
            className="cta-box"
            data-aos="fade-up"
          >
            <h2>Ready to Get Your Clothes Clean?</h2>
            <p>
              Schedule a pickup today and enjoy fresh, professionally cleaned
              clothes delivered to your doorstep.
            </p>

            <div 
              className="cta-actions"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <a href="/contact" className="cta-primary">
                Schedule a Pickup
              </a>
              <a href="tel:+2349034910951" className="cta-secondary">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
