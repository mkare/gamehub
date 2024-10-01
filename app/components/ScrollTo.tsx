"use client";
import { useEffect, useState } from "react";

const ScrollToTop = ({}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className="btn btn-light"
      onClick={handleClick}
      style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 100 }}
    >
      top
    </button>
  );
};

const ScrollToSection = ({
  sectionId,
  style,
  variant = "mouse",
}: {
  sectionId?: string;
  style?: any;
  variant?: string;
}) => {
  const handleClick = () => {
    if (!sectionId) {
      const currentPos = window.scrollY;
      window.scrollTo({
        top: currentPos + window.innerHeight,
        behavior: "smooth",
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`scroll-to-${variant}`}
      style={style}
    />
  );
};

export { ScrollToTop, ScrollToSection };
