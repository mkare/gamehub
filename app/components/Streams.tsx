/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";

import TwitchStreams from "@/app/components/TwitchStreams";
import YouTubeVideos from "@/app/components/YoutubeVideos";

interface StreamsProps {
  gameName: string;
}

enum Tab {
  Twitch = "twitch",
  Youtube = "youtube",
  News = "news",
}

const Streams = ({ gameName }: StreamsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Twitch);
  const tabRef = useRef<HTMLUListElement>(null);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log(tabRef.current);
    const offset = tabRef.current?.offsetTop;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, []);

  return (
    <section className="streams position-relative z-2">
      <ul className="tabs" ref={tabRef}>
        {Object.values(Tab).map((tab) => (
          <li key={tab} className={activeTab === tab ? "active" : ""}>
            <a
              href="#twitch"
              onClick={(e) => {
                e.preventDefault();
                handleTabChange(tab);
              }}
            >
              <img
                src={`/logos/${tab}.svg`}
                alt={tab}
                className="w-auto"
                style={{ height: "2rem" }}
              />
              {tab === Tab.News && <span className="ms-2">News</span>}
            </a>
          </li>
        ))}
      </ul>
      {activeTab === Tab.Twitch && <TwitchStreams gameName={gameName} />}
      {activeTab === Tab.Youtube && <YouTubeVideos query={gameName} />}
      {activeTab === Tab.News && (
        <div className="d-flex flex-column align-items-center w-100">
          <h2 className="mb-4 h6">
            Top Live News for <i>{gameName}</i>
          </h2>
          <div
            className="stream-slider"
            style={{
              minHeight: "394px",
              alignSelf: "stretch",
              margin: "0 2.5rem",
            }}
          >
            <div className="keen-slider justify-content-center">
              <div className="p-4 d-flex flex-column align-items-center">
                <p className="text-muted">News Loading...</p>
                <p className="text-muted">Please wait.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Streams;
