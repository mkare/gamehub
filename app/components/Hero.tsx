import { ScrollToTop, ScrollToSection } from "./ScrollTo";

export default function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <h1 className="title">
          <span>Tüm</span>
          <span>Oyunlar</span>
        </h1>
        <p className="desc">
          Aradığın oyun hakkında herşey burada!
          <br />
          <span className="mt-12 text-[6vw] md:text-[1.2rem]">
            <a href="#" className="text-white underline">
              haberler,
            </a>{" "}
            <a href="#" className="text-white underline">
              incelemeler,
            </a>{" "}
            <a href="#" className="text-white underline">
              videolar
            </a>{" "}
            <i>ve daha fazlası!</i>
          </span>
        </p>

        <div className="search-bar">
          <div className="mb-3 input-group">
            <input
              type="text"
              placeholder="Oyun ara..."
              className="form-control form-control-lg"
            />
            <button className="btn btn-lg">Ara</button>
          </div>
        </div>

        <ScrollToTop />
        <ScrollToSection
          sectionId="section1"
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            zIndex: 100,
          }}
        />
        <ScrollToSection
          sectionId="featuredGames"
          variant="arrow"
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
}
