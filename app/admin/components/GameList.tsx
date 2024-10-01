"use client";
import { useState, useEffect } from "react";
import {
  getGameList,
  getPaginatedGameList,
  deleteGame,
} from "@/app/utils/firestoreService";
import UpdateModal from "@/app/admin/components/UpdateGameModal";
import { Game } from "@/types/game";

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [showList, setShowList] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const handleDelete = async (gameId: string, imageName: string) => {
    try {
      await deleteGame(gameId, imageName);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    } catch (e) {
      console.error("Error deleting game: ", e);
    }
  };

  const fetchGames = async () => {
    try {
      const gameList = await getGameList();
      setGames(gameList);
    } catch (e) {
      console.error("Error fetching games: ", e);
    }
  };

  const fetchPaginatedGames = async () => {
    try {
      const gameList = await getPaginatedGameList();
      setGames(gameList.games);
    } catch (e) {
      console.error("Error fetching games: ", e);
    }
  };

  const toggleList = () => {
    setShowList(!showList);
  };

  useEffect(() => {
    setFilteredGames(
      games.filter((game) =>
        game.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, games]);

  return (
    <div>
      <h2 className="mt-4">Game List</h2>
      <input
        type="text"
        className="mb-3 form-control"
        placeholder="Search games"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button
        className="mb-3 btn btn-sm btn-outline-warning"
        onClick={fetchGames}
      >
        Fetch Games
      </button>
      <button
        className="mb-3 ms-3 btn btn-sm btn-outline-warning"
        onClick={fetchPaginatedGames}
      >
        Fetch Paginated Games
      </button>
      {filteredGames.length > 0 && (
        <button
          className="mb-3 ms-3 btn btn-sm btn-outline-secondary"
          onClick={toggleList}
        >
          {showList ? "Hide List" : "Show List"}
        </button>
      )}
      <ul className={`mb-5 list-group ${showList ? "d-block" : "d-none"}`}>
        {filteredGames.map((game) => (
          <li
            key={game.id}
            className="gap-3 d-flex align-items-center list-group-item justify-content-between"
          >
            <span>{game.name}</span>
            <UpdateModal game={game} />
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() =>
                game.id && handleDelete(game.id, game.background_image)
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
