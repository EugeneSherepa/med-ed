import { useState, useEffect } from "react";
import "./Testimonial.scss";
import "../Testimonials/Testimonials.scss";

export const Testimonial = ({ testimonial }) => {
  const { image, title, text, author } = testimonial;

  // Mobile detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 990 : false
  );
  const [expanded, setExpanded] = useState(false);
  const wordLimit = 30; // adjust as needed

  // Update on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 990);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateText = (txt, limit) => {
    const words = txt.split(" ");
    if (words.length <= limit) return txt;
    return words.slice(0, limit).join(" ") + " ...";
  };

  const displayedText = isMobile
    ? expanded
      ? text
      : truncateText(text, wordLimit)
    : text;

  return (
    <div className="testimonial">
      <div className="testimonial-image">
        <img src={image} alt={`Студент(ка) ${author}`} />
      </div>
      <div className="testimonial-information">
        <div className="testimonial-information-wrapper">
          <div className="testimonial-information-wrapper-title">
            {title}
          </div>
          <div className="testimonial-information-wrapper-text">
            {displayedText}
            {isMobile && text.split(" ").length > wordLimit && (
              <button
                className="read-more-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "сховати" : "читати повністю"}
              </button>
            )}
          </div>
          <div className="testimonial-information-wrapper-author">
            {author}
          </div>
        </div>
      </div>
    </div>
  );
};
