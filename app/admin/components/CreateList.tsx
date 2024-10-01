"use client";
import { useState, useEffect } from "react";
import {
  createList,
  addGameToList,
  getLists,
} from "@/app/utils/firestoreService";
import SearchGames from "./SearchGames";
import GetLists from "./GetLists";
import { toast } from "react-toastify";

interface List {
  id: string;
  name?: string;
  games?: { id: string; name: string; background_image: string }[];
}

interface Game {
  id: string;
  name: string;
  background_image: string;
}

const CreateList = () => {
  const [list, setList] = useState<List>({ id: "", name: "", games: [] });
  const [showCreateList, setShowCreateList] = useState<boolean>(false);
  const [listId, setListId] = useState<string>("");
  const [lists, setLists] = useState<List[]>([]);
  const [addedGames, setAddedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true); // Veriler yükleniyor
      try {
        const fetchedLists = await getLists();
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists: ", error);
        toast.error("Error fetching lists");
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };
    fetchLists();
  }, []);

  const handleListSubmit = async (newList: List) => {
    if (!newList.name) {
      toast.warn("List name cannot be empty!"); // Boş isim uyarısı
      return;
    }

    try {
      setLoading(true);
      await createList(newList);
      const updatedLists = await getLists();
      setLists(updatedLists);
    } catch (e) {
      console.error("Error adding list: ", e);
      toast.error("Error adding list");
    } finally {
      setLoading(false);
      setShowCreateList(false);
    }
  };

  const handleGameSubmit = async (listId: string, games: Game[]) => {
    try {
      for (const game of games) {
        await addGameToList(listId, {
          id: game.id,
          name: game.name,
          background_image: game.background_image,
        });
      }
      const updatedList = lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              games: [
                ...(list.games || []),
                ...games.map((g) => ({
                  id: g.id,
                  name: g.name,
                  background_image: g.background_image,
                })),
              ],
            }
          : list
      );
      setLists(updatedList);
      setAddedGames([]);
      toast.success("Games added to the list successfully!");
    } catch (e) {
      console.error("Error adding games to list: ", e);
      toast.error("Error adding games to list");
    }
  };

  return (
    <div className="container mt-5">
      <div className="gap-3 my-3 d-flex align-items-center justify-content-between">
        {showCreateList && (
          <div className="mb-3 w-100">
            <h1 className="h5">Create List</h1>
            <div className="mb-3 input-group">
              <span className="input-group-text" id="listName">
                List Name
              </span>
              <input
                type="text"
                className="form-control"
                id="listName"
                onChange={(e) => setList({ ...list, name: e.target.value })}
              />
              <button
                className="btn btn-outline-info"
                onClick={() => handleListSubmit(list)}
              >
                Create
              </button>
            </div>
          </div>
        )}
        <button
          className={
            `btn btn-outline-${showCreateList ? "secondary" : "info"} ` +
            " flex-shrink-0"
          }
          onClick={() => setShowCreateList((x) => !x)}
        >
          {showCreateList ? "Hide Input" : "Create List"}
        </button>
      </div>

      {loading ? ( // Yükleme durumu kontrolü
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <GetLists onListSelect={setListId} />
          {listId && (
            <>
              <hr className="my-5" />
              <SearchGames
                list={lists.find((l) => l.id === listId)}
                onGameAdd={setAddedGames}
              />
              <button
                className="btn btn-outline-info mt-3"
                onClick={() => handleGameSubmit(listId, addedGames)}
                disabled={loading} // Loader sırasında butonu devre dışı bırak
              >
                Add All Selected Games to List
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CreateList;
