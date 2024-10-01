import {
  getGameList,
  getPaginatedGameList,
} from "@/app/utils/firestoreService";
import { Game } from "@/types/game";

async function fetchGames() {
  try {
    const gameList = await getPaginatedGameList(15);
    return gameList.games;
  } catch (e) {
    console.error("Error fetching games: ", e);
    return [];
  }
}

export default async function GamesPage() {
  const games = await fetchGames();

  return (
    <section className="game-list" id="featuredGames">
      <div className="container mt-5">
        <h1 className="game-list-title">
          <span>Featured</span>
          <span>Games</span>
        </h1>
        <div className="games">
          {games.map((game: Game, i) => (
            <a
              href={`/game/${game.slug}`}
              key={game.id}
              className="game-list_item"
            >
              <div className="game-list_img">
                <img
                  src={game.background_image}
                  alt={game.name}
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
              <p className="game-list_title">{game.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
