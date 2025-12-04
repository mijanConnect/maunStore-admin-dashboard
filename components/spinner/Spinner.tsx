import "./spinner.css";
import { useEffect } from "react";

export default function Spinner() {
  useEffect(() => {
    // Hide scrollbar when spinner is shown
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Cleanup: restore scrollbar when spinner is removed
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full z-50">
      <span className="loader"></span>
    </div>
  );
}
