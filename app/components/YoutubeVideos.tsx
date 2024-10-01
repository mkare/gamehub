"use client";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import { truncate } from "@/app/lib/helpers";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
      medium: {
        url: string;
      };
    };
  };
}

interface YouTubeVideosProps {
  query: string;
}

// YouTube API'den videoları almak için fetchYouTubeVideos fonksiyonu
const fetchYouTubeVideos = async (query: string) => {
  try {
    const apiKey = "AIzaSyBo5KW3GkGbIGvW_6fDe0gbQPNwNuPA4TA"; // Kendi YouTube API Key'inizi kullanın

    // YouTube'dan videoları almak için search endpoint'ini kullanıyoruz
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=12&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();

    return data.items;
  } catch (err: any) {
    console.error("YouTube API error:", err.message);
    return null;
  }
};

const YouTubeVideos = ({ query }: YouTubeVideosProps) => {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await fetchYouTubeVideos(query);
        if (!fetchedVideos) {
          throw new Error("No videos found");
        }

        setVideos(fetchedVideos);
      } catch (err: any) {
        setError("YouTube API error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center w-100">
        <h2 className="mb-4 h6">
          Top Live Streams for <i>{query}</i>
        </h2>
        <div
          className="stream-slider"
          style={{
            minHeight: "394px",
          }}
        >
          <div className="keen-slider">
            <div className="p-4 d-flex flex-column align-items-center">
              <p className="text-muted">YouTube videos are Loading...</p>
              <p className="text-muted">Please wait.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 d-flex flex-column align-items-center w-100">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!videos) {
    return (
      <div className="p-4 d-flex flex-column align-items-center w-100">
        <p className="text-muted">No videos found for {query}.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h2 className="mb-4 h6">
        Top YouTube Videos for <i>{query}</i>
      </h2>
      {videos && (
        <Slider slidePerView={3}>
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              className="keen-slider__slide position-relative"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                className="d-block"
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="image"
                />
                <div className="title">{truncate(video.snippet.title, 50)}</div>
                <div className="username">{video.snippet.channelTitle}</div>
                <button className="btn btn-outline-light">Watch Video</button>
              </a>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default YouTubeVideos;
