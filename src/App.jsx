import AppRoutes from "./routes/AppRoutes";
import DoorReveal from "./components/DoorReveal";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./styles/globals.css";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <DoorReveal />
      <AppRoutes />
    </>
  );
}

export default App;
