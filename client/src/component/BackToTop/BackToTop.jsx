import { useEffect, useState } from "react";
import "./backtotop.scss";

const BackToTop = ({ visible }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (!visible) {
      setIsShown(false);
      return undefined;
    }

    const handleScroll = () => {
      setIsShown(window.scrollY > 520);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${isShown ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <span className="button-ring"></span>
      <i className="bx bx-up-arrow-alt"></i>
    </button>
  );
};

export default BackToTop;
