import { useState, useEffect } from "react";
import { getTestimonials } from "../data/testimonials.js";

function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Firebase on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="testimonial-slider">
        <div className="testimonial-card">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Show message if no testimonials
  if (testimonials.length === 0) {
    return (
      <div className="testimonial-slider">
        <div className="testimonial-card">
          <p>No reviews yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  const { name, image, review } = testimonials[index];

  return (
    <div className="testimonial-slider">
      <div className="testimonial-card">
        {image && <img src={image} alt={name} />}
        <h3>{name}</h3>
        <p>"{review}"</p>
      </div>

      <div className="slider-controls">
        <button onClick={prevSlide}>‹</button>
        <button onClick={nextSlide}>›</button>
      </div>
    </div>
  );
}

export default TestimonialSlider;