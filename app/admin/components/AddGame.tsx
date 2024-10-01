"use client";
import { useState } from "react";
import { addGame } from "@/app/utils/firestoreService";
import GameForm from "@/app/admin/components/GameForm";
import { toast } from "react-toastify";
import GetGameRawg from "@/app/admin/components/GetGameRawg";

const AddGame = () => {
  const [game, setGame] = useState<any>(null);

  const handleSubmit = async (game: any) => {
    try {
      await addGame(game);
    } catch (e) {
      console.error("Error adding game: ", e);
      toast.error("Error adding game");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add Game</h1>
      <GetGameRawg
        onGameSelect={(game: any) => {
          setGame(game);
        }}
      />
      <GameForm game={game} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddGame;
