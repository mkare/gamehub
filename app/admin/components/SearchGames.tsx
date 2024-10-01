/* eslint-disable @next/next/no-img-element */
"use client";
import { useReducer, ChangeEvent, useEffect, useRef } from "react";

const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY as string;

enum ACTIONS {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_GAMES = "SET_GAMES",
  TOGGLE_LIST = "TOGGLE_LIST",
  ADD_GAME = "ADD_GAME",
  REMOVE_GAME = "REMOVE_GAME",
  SET_SEARCH = "SET_SEARCH",
}

interface State {
  games: Game[];
  addedGames: Game[];
  loading: boolean;
  error: string | null;
  search: string;
  listOpen: boolean;
}

interface Action {
  type: ACTIONS;
  payload?: any;
}

const initialState: State = {
  games: [],
  addedGames: [],
  loading: false,
  error: null,
  search: "",
  listOpen: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_GAMES:
      return { ...state, games: action.payload };
    case ACTIONS.TOGGLE_LIST:
      return { ...state, listOpen: !state.listOpen };
    case ACTIONS.ADD_GAME:
      return { ...state, addedGames: [...state.addedGames, action.payload] };
    case ACTIONS.REMOVE_GAME:
      return {
        ...state,
        addedGames: state.addedGames.filter((g) => g.id !== action.payload),
      };
    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

interface Game {
  id: string;
  name: string;
  background_image: string;
  released: string;
}

interface SearchGamesProps {
  list: any;
  onGameAdd: (games: Game[]) => void;
}

const SearchGames = ({ list, onGameAdd }: SearchGamesProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInput.current?.focus();
    dispatch({ type: ACTIONS.TOGGLE_LIST, payload: true });
  }, [list]);

  const handleSearch = async () => {
    if (!state.search.trim()) {
      return; // Eğer arama sorgusu boşsa hiçbir şey yapma
    }

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });

    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&search=${state.search}`
      );
      const data = await response.json();
      dispatch({ type: ACTIONS.SET_GAMES, payload: data.results });
    } catch (error: any) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: ACTIONS.TOGGLE_LIST, payload: true });
    }
  };

  const handleGameSelect = (game: Game) => {
    dispatch({ type: ACTIONS.ADD_GAME, payload: game });
    dispatch({
      type: ACTIONS.SET_GAMES,
      payload: state.games.filter((g) => g.id !== game.id),
    });
    onGameAdd([...state.addedGames, game]);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: e.target.value });
  };

  if (state.loading) {
    return <p>Loading...</p>;
  }

  if (state.error) {
    return <p>Error: {state.error}</p>;
  }

  return (
    <>
      <h2>Add Games to {list.name}</h2>
      <div
        className={`rawg-search rawg-search-list ${
          state.listOpen ? "active" : ""
        }`}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group" style={{ maxWidth: "500px" }}>
            <input
              type="text"
              placeholder={
                state.games.length > 0
                  ? `${state.games[0].name} ...`
                  : "Search for a game"
              }
              className="form-control"
              value={state.search}
              onChange={handleSearchChange}
              ref={searchInput}
            />
            <button
              type="submit"
              className="btn btn-outline-light"
              onClick={handleSearch}
            >
              Search
            </button>
            {state.games.length > 0 && (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    dispatch({ type: ACTIONS.SET_GAMES, payload: [] });
                    dispatch({ type: ACTIONS.SET_SEARCH, payload: "" });
                  }}
                >
                  Clear
                </button>
                <button
                  className="btn btn-outline-light"
                  onClick={() => dispatch({ type: ACTIONS.TOGGLE_LIST })}
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
                        transform: `translateY(${
                          state.listOpen ? 0 : -2
                        }px) rotate(${state.listOpen ? 180 : 0}deg)`,
                        transformOrigin: "center",
                        transition: "transform 0.2s",
                      }}
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-3 rawg-search-result">
          {state.games.length > 0 ? (
            state.games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameSelect(game)}
                className="item"
              >
                <span>{game.name}</span>
                {game.released && (
                  <span className="font-monospace">{game.released}</span>
                )}
              </div>
            ))
          ) : (
            <p>No games found</p>
          )}
        </div>

        <div className="mt-3">
          <h4>Added Games:</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {state.addedGames.length > 0 ? (
              state.addedGames.map((game) => (
                <div key={game.id}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: "1fr auto",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={game.background_image}
                      alt={game.name}
                      style={{
                        width: "100%", // Düzeltildi: Genişliği %100 olarak ayarladık
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                    <span className="bg-black p-2 w-100">{game.name}</span>
                    <button
                      className="btn btn-sm btn-outline-danger mt-1"
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.REMOVE_GAME,
                          payload: game.id,
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No games added yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchGames;
