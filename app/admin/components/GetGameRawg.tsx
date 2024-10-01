/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const GetGameRawg = ({
  gameName,
  onGameSelect,
}: {
  gameName?: string;
  onGameSelect: (game: any) => void;
}) => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(gameName || "");
  const [listOpen, setListOpen] = useState<boolean>(false);

  useEffect(() => {
    setListOpen(!!1);
  }, [games]);

  const handleSearch = () => {
    setLoading(true);
    setError(null);

    fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.results);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleGameSelect = (gameId: number) => {
    setLoading(true);
    setError(null);

    // Oyun ID'sine göre detaylı bilgiyi çekiyoruz
    fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        onGameSelect(data); // Detaylı oyun bilgilerini dışarıya iletiyoruz
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={`rawg-search` + (games.length > 0 ? " active" : "")}>
      <div
        className="input-group"
        style={{
          maxWidth: "500px",
        }}
      >
        <input
          type="text"
          placeholder={
            games.length > 0 ? `${games[0].name} ...` : "Search for a game"
          }
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-light" onClick={handleSearch}>
          Search
        </button>
        {games.length > 0 && (
          <>
            <button
              className="btn btn-outline-light"
              onClick={() => {
                setGames([]);
                setSearch("");
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => setListOpen((prev) => !prev)}
            >
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 15 0 7.5 1.5 6 8 12.5 14.5 6 16 7.5Z"
                  style={{
                    transform: `translateY(${listOpen ? 0 : -2}px) rotate(${
                      listOpen ? 180 : 0
                    }deg)`,
                    transformOrigin: "center",
                    transition: "transform 0.2s",
                  }}
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="mt-3 rawg-search-result">
        {listOpen &&
          (games.length > 0 ? (
            games.map((game) => {
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setListOpen(false);
                    handleGameSelect(game.id); // Oyun seçildiğinde detaylı bilgi çekme
                  }}
                >
                  {game.name} - {game.released}
                </div>
              );
            })
          ) : (
            <p>No games found</p>
          ))}
      </div>
    </div>
  );
};

export default GetGameRawg;
