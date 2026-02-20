import { useEffect } from "react";
import "../styles/about.css";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="about">
      <div className="about-container">

        {/* HERO SECTION */}
        <div 
          className="about-hero"
          data-aos="fade-down"
        >
          <h1>About Our Laundry Service</h1>
          <p 
            className="hero-subtitle"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Providing exceptional laundry care since 2020
          </p>
        </div>

        {/* STORY SECTION */}
        <div className="story-section">
          <div 
            className="story-content"
            data-aos="fade-right"
          >
            <h2>Our Story</h2>
            <p>
              Founded in 2020, our laundry service was born from a simple idea:
              everyone deserves fresh, clean clothes without the hassle. We
              started with a small team and a big dream to revolutionize
              laundry services in Lagos.
            </p>
            <p>
              Today, we proudly serve thousands of satisfied customers across
              the city, offering professional cleaning services with free
              pickup and delivery. Our commitment to quality, convenience, and
              customer satisfaction has made us the trusted choice for busy
              professionals, families, and students.
            </p>
          </div>

          <div 
            className="story-image"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="image-placeholder">🧺</div>
          </div>
        </div>

        {/* VALUES SECTION */}
        <div className="values-section">
          <h2 data-aos="fade-up">Our Values</h2>

          <div className="values-grid">
            <div className="value-card" data-aos="zoom-in" data-aos-delay="100">
              <div className="value-icon">✨</div>
              <h3>Quality First</h3>
              <p>
                We use premium detergents and state-of-the-art equipment to
                ensure your clothes receive the best care possible.
              </p>
            </div>

            <div className="value-card" data-aos="zoom-in" data-aos-delay="250">
              <div className="value-icon">🚀</div>
              <h3>Speed & Efficiency</h3>
              <p>
                Quick turnaround times without compromising quality. We value
                your time as much as you do.
              </p>
            </div>

            <div className="value-card" data-aos="zoom-in" data-aos-delay="400">
              <div className="value-icon">🌿</div>
              <h3>Eco-Friendly</h3>
              <p>
                We're committed to sustainability, using biodegradable
                detergents and energy-efficient processes.
              </p>
            </div>

            <div className="value-card" data-aos="zoom-in" data-aos-delay="550">
              <div className="value-icon">💎</div>
              <h3>Customer Care</h3>
              <p>
                Your satisfaction is our priority. We go the extra mile to
                exceed your expectations every time.
              </p>
            </div>
          </div>
        </div>

        {/* SERVICES OVERVIEW */}
        <div className="services-overview">
          <h2 data-aos="fade-up">What We Offer</h2>

          <div className="services-grid">
            {[
              ["👕", "Wash & Fold", "Professional washing and neat folding for everyday clothes"],
              ["🔥", "Ironing Service", "Crisp, professionally pressed garments ready to wear"],
              ["✨", "Dry Cleaning", "Specialized care for delicate and high-end fabrics"],
              ["🏡", "Heavy Items", "Curtains, rugs, and large household items cleaned expertly"],
              ["🚚", "Pickup & Delivery", "Free pickup and delivery at your convenience"],
              ["⚡", "Express Service", "Same-day service available for urgent needs"]
            ].map((service, index) => (
              <div 
                key={index}
                className="service-item"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="service-icon">{service[0]}</div>
                <h3>{service[1]}</h3>
                <p>{service[2]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stats-section">
          <h2 data-aos="fade-up">Our Impact</h2>

          <div className="stats-grid">
            {[
             
              ["99%", "Satisfaction Rate"],
              ["24/7", "Online Booking"]
            ].map((stat, index) => (
              <div 
                key={index}
                className="stat-item"
                data-aos="zoom-in-up"
                data-aos-delay={index * 200}
              >
                <div className="stat-number">{stat[0]}</div>
                <div className="stat-label">{stat[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="team-section">
          <h2 data-aos="fade-up">Meet Our Team</h2>

          <p 
            className="team-intro"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Our dedicated team of professionals is committed to providing you
            with the best laundry experience.
          </p>

          <div className="team-grid">
            {[
              ["👨‍💼", "Chapee", "Founder & CEO", "15 years of experience in the laundry industry"],
              ["👩‍💼", "Sarah Okafor", "Operations Manager", "Ensuring smooth operations and quality control"],
              ["👨‍🔬", "David Mensah", "Quality Supervisor", "Expert in fabric care and stain removal"],
              ["👩‍💻", "Grace Eze", "Customer Support Lead", "Dedicated to exceptional customer service"]
            ].map((member, index) => (
              <div 
                key={index}
                className="team-member"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="member-photo">{member[0]}</div>
                <h3>{member[1]}</h3>
                <p className="member-role">{member[2]}</p>
                <p className="member-bio">{member[3]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div 
          className="cta-section"
          data-aos="fade-up"
        >
          <h2>Ready to Experience the Difference?</h2>
          <p>
            Join thousands of satisfied customers who trust us with their
            laundry needs.
          </p>

          <div 
            className="cta-buttons"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <a href="/booking" className="btn-primary">
              Book Now
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
