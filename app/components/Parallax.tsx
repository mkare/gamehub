"use client";
import SimpleParallax from "simple-parallax-js";
import Image from "next/image";
import { ScrollToSection } from "./ScrollTo";
import { transform } from "next/dist/build/swc";

const Wrapper = ({
  children,
  text = "lorem ipsum",
}: {
  children: React.ReactNode;
  text?: React.ReactNode;
}) => (
  <section className="parallax" id="section1">
    <SimpleParallax scale={1.4} orientation="up">
      {children}
    </SimpleParallax>
    <h1 className="parallax-title">
      <div>{text}</div>
      <ParallaxButton />
    </h1>
    <ScrollToSection
      variant="caret"
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "50%",
        zIndex: 100,
      }}
    />
  </section>
);

const ParallaxButton = () => (
  <button className="parallax-button">Learn More</button>
);

const Parallax = () => (
  <>
    <Wrapper text={"Lorem ipsum dolor sit amet."}>
      <Image
        src="/parallax/h1-slider-1a-background-img.jpg"
        alt="image"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </Wrapper>
    <Wrapper text={"Inventore natus porro numquam optio."}>
      <Image
        src="/parallax/h1-slider-2a-background-img.jpg"
        alt="image"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </Wrapper>
    <Wrapper text={"Quisquam, quos, quae."}>
      <Image
        src="/parallax/h1-slider-3a-background-img.jpg"
        alt="image"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </Wrapper>
    <Wrapper text={"Natus, doloremque."}>
      <Image
        src="/parallax/h3-parallax-img-3.jpg"
        alt="image"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </Wrapper>
    <Wrapper text={"Praesentium modi et, ratione sint."}>
      <Image
        src="/parallax/h3-parallax-img-4.jpg"
        alt="image"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </Wrapper>
  </>
);

export default Parallax;
