import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DoorReveal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="door-wrapper">
      <motion.div
        className="door left-door"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "-110%" : 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />
      <motion.div
        className="door right-door"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "100%" : 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />
    </div>
  );
};

export default DoorReveal;
