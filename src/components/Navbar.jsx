import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CH</Link>
      </div>

      {/* Desktop Links */}
      <ul className="nav-links desktop">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* Hamburger */}
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="mobile-menu"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/services" onClick={toggleMenu}>Services</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
        </ul>
      </motion.div>
    </nav>
  );
}

export default Navbar;
