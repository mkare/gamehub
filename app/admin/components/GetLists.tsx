"use client";
import { useState, useEffect } from "react";
import { getLists, deleteList } from "@/app/utils/firestoreService";
import { toast } from "react-toastify";

interface List {
  id: string;
  name?: string;
  games?: string[];
}

const Lists = ({
  onListSelect,
}: {
  onListSelect: (listId: string) => void;
}) => {
  const [lists, setLists] = useState<List[]>([]);
  const [listId, setListId] = useState<string>("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const lists = await getLists();
        setLists(lists);
      } catch (e) {
        console.error("Error fetching lists: ", e);
        toast.error("Error fetching lists");
      } finally {
        setListId("");
      }
    };
    fetchLists();

    return () => {
      setLists([]);
    };
  }, []);

  useEffect(() => {
    if (listId) {
      onListSelect(listId);
    }
  }, [listId, onListSelect]);

  return (
    <>
      {lists.map((list) => (
        <div key={list.id} className="d-flex align-items-center py-2 gap-4">
          <h3
            onClick={() => {
              setListId(list.id);
            }}
            role="button"
          >
            {list.name}
          </h3>
          <button
            className="btn btn-sm btn-outline-danger mb-2"
            onClick={(e) => {
              e.stopPropagation();
              deleteList(list.id);
              const updatedLists = lists.filter((l) => l.id !== list.id);
              setLists(updatedLists);
            }}
          >
            delete list
          </button>
        </div>
      ))}
    </>
  );
};

export default Lists;
