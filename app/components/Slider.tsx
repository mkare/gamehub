import { useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

interface SliderProps {
  slidePerView?: number;
  children: React.ReactNode;
}

const Slider = ({ slidePerView, children }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      mode: "free-snap",
      breakpoints: {
        "(min-width: 400px)": {
          slides: { perView: 2, spacing: 5 },
        },
        "(min-width: 768px)": {
          slides: { perView: slidePerView ? slidePerView : 3, spacing: 10 },
        },
        "(min-width: 1200px)": {
          slides: { perView: slidePerView ? slidePerView + 1 : 4, spacing: 20 },
        },
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      // add plugins here
    ]
  );

  if (!sliderRef || !instanceRef || !children) {
    return null;
  }

  return (
    <div className="stream-slider">
      <div className="container">
        <div ref={sliderRef} className="keen-slider">
          {children}
        </div>
        <div>
          {loaded && instanceRef.current && (
            <div className="stream-slider__controls">
              <button
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                role="button"
              >
                {"<<"}
              </button>
              <button
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                role="button"
              >
                {">>"}
              </button>
            </div>
          )}
          {loaded && instanceRef.current && (
            <div className="gap-2 mt-3 d-flex justify-content-center">
              {Array.from(
                Array(instanceRef.current.track.details.slides.length).keys()
              ).map((idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={
                      "p-1 border border-light rounded-circle opacity-50" +
                      (currentSlide === idx ? "bg-light" : "")
                    }
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
