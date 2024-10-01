/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import { truncate } from "@/app/lib/helpers";

interface Stream {
  id: string;
  user_name: string;
  user_login: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  user_id: string;
}

interface TwitchStreamsProps {
  gameName: string;
}

// Oyun ID'sini almak için fetchGameId fonksiyonu
const fetchGameId = async (gameName: string) => {
  try {
    const clientId = "gp762nuuoqcoxypju8c569th9wz7q5"; // Kendi Client-ID'nizi kullanın
    const token = "9nu2f7s0qtoelq9ckte6r7j1sglrow"; // Kendi OAuth Token'ınızı kullanın

    // Oyun ID'sini almak için games endpoint'ini kullanıyoruz
    const response = await fetch(
      `https://api.twitch.tv/helix/games?name=${encodeURIComponent(gameName)}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch game ID");
    }

    const data = await response.json();

    if (data.data.length > 0) {
      return data.data[0].id;
    }
  } catch (err: any) {
    console.error("Twitch API error:", err.message);
    return null;
  }
};

const convertThumbnailUrl = (url: string) => {
  return url.replace("{width}", "320").replace("{height}", "180");
};

const TwitchStreams = ({ gameName }: TwitchStreamsProps) => {
  const [topStream, setTopStream] = useState<Stream[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopStream = async () => {
      try {
        const gameId = await fetchGameId(gameName);
        if (!gameId) {
          throw new Error("Game not found");
        }

        const clientId = "gp762nuuoqcoxypju8c569th9wz7q5"; // Kendi Client-ID'nizi kullanın
        const token = "9nu2f7s0qtoelq9ckte6r7j1sglrow"; // Kendi OAuth Token'ınızı kullanın

        const response = await fetch(
          `https://api.twitch.tv/helix/streams?game_id=${gameId}`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch streams");
        }

        const data = await response.json();
        setTopStream(data.data);
      } catch (err: any) {
        setError("Twitch API error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStream();
  }, [gameName]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center w-100">
        <h2 className="mb-4 h6">
          Top Live Streams for <i>{gameName}</i>
        </h2>
        <div
          className="stream-slider"
          style={{
            minHeight: "394px",
          }}
        >
          <div className="keen-slider">
            <div className="p-4 d-flex flex-column align-items-center">
              <p className="text-muted">Twitch streams Loading...</p>
              <p className="text-muted">Please wait.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!topStream) {
    return <p className="text-muted">No live streams found for {gameName}.</p>;
  }

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {/* <img
        src="/logos/twitch.svg"
        alt="Twitch Logo"
        className="w-auto mb-2"
        style={{ height: "2rem" }}
      /> */}
      <h2 className="mb-4 h6">
        Top Live Streams for <i>{gameName}</i>
      </h2>

      {topStream.length > 3 ? (
        <Slider slidePerView={3}>
          {topStream.map((stream) => (
            <div key={stream.id} className="keen-slider__slide">
              <a
                href={`https://www.twitch.tv/${stream.user_login}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={convertThumbnailUrl(stream.thumbnail_url)}
                  alt={stream.title}
                  className="image"
                />
                <div className="title">{truncate(stream.title, 60)}</div>
                <div className="username">
                  {stream.user_name} {stream.viewer_count}
                </div>
                <button className="btn btn-outline-light">Watch Now</button>
              </a>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="gap-3 mb-4 d-flex justify-content-center align-items-center">
          {topStream.map((stream) => (
            <div key={stream.id} className="keen-slider__slide">
              <a
                href={`https://www.twitch.tv/${stream.user_login}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={convertThumbnailUrl(stream.thumbnail_url)}
                  alt={stream.title}
                  className="mb-2 rounded img-fluid"
                />
                <div className="title">{truncate(stream.title, 60)}</div>
                <div className="username">
                  {stream.user_name} {stream.viewer_count}
                </div>
                <button className="btn btn-outline-light">Watch Now</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TwitchStreams;

/*


<div className="pb-4 pr-4 overflow-y-auto border rounded-lg max-h-96 border-slate-700">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {topStream &&
      topStream.map((stream) => (
        <div className="mt-4 ml-4" key={stream.id}>
          <a
            href={`https://www.twitch.tv/${stream.user_login}`}
            target="_blank"
            className="block"
          >
            <img
              src={convertThumbnailUrl(stream.thumbnail_url)}
              alt={stream.title}
              className="max-w-full mb-2 rounded-md"
            />

            <h3 className="text-lg font-semibold">{stream.user_name}</h3>
          </a>
          <p className="text-sm text-gray-500 break-words">
            {stream.title}
          </p>
          <p className="text-sm text-gray-500">
            Viewers: {stream.viewer_count}
          </p>
        </div>
      ))}
  </div>
</div>

import { useEffect, useState } from "react";

// Stream ve TwitchStreamsProps gibi tipleri burada tanımlayın.
interface Stream {
  id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
}

interface TwitchStreamsProps {
  gameName: string;
}

const TwitchStreams = ({ gameName }: TwitchStreamsProps) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const clientId = "gp762nuuoqcoxypju8c569th9wz7q5";
        const token = "9nu2f7s0qtoelq9ckte6r7j1sglrow";

        const response = await fetch(
          `https://api.twitch.tv/helix/streams?game_name=${encodeURIComponent(
            gameName
          )}`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch streams");
        }

        const data = await response.json();
        setStreams(data.data);
      } catch (err: any) {
        setError("Twitch API error: " + err.message);
      }
    };

    fetchStreams();
  }, [gameName]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="mb-4 text-2xl font-bold">Live Streams for {gameName}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {streams.map((stream) => (
          <div key={stream.id} className="p-4 rounded-lg shadow-md bg-card">
            <img
              src={stream.thumbnail_url
                .replace("{width}", "320")
                .replace("{height}", "180")}
              alt={stream.title}
              className="mb-2 rounded-md"
            />
            <h3 className="text-lg font-semibold">{stream.user_name}</h3>
            <p className="text-sm text-gray-500">{stream.title}</p>
            <p className="text-sm text-gray-500">
              Viewers: {stream.viewer_count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwitchStreams;
*/
