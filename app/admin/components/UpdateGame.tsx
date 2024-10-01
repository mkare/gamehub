/* eslint-disable @next/next/no-img-element */
"use client";
import { updateGame } from "@/app/utils/firestoreService";
import UpdateGameForm from "@/app/admin/components/GameForm";
import { toast } from "react-toastify";

interface UpdateGameProps {
  game: any;
  onSubmit: () => void;
}

const UpdateGame = ({ game, onSubmit }: UpdateGameProps) => {
  const handleSubmit = async (game: any) => {
    try {
      // remove background_image from game object
      delete game.background_image;
      await updateGame(game.id, game);
      onSubmit();
    } catch (e) {
      console.error("Error updating game: ", e);
      toast.error("Error updating game");
    }
  };

  return (
    <>
      <img
        src={game.background_image}
        alt={game.name}
        className="img-fluid mb-3"
      />
      <UpdateGameForm game={game} onSubmit={handleSubmit} submitType="update" />
    </>
  );
};

export default UpdateGame;
