import { Game } from "@/types/game";
const GameDetail = ({
  id,
  slug,
  name,
  released,
  description,
  background_image,
  platforms,
  genres,
  rating,
}: Game) => {
  return (
    <section className="game-detail">
      <div className="bg-img">
        <img src={background_image} alt={name} />
      </div>
      <div className="container content" id={id}>
        <h1 className="mt-3 text-center fw-bold">{name}</h1>
        {/* <p className="mt-4 text-center">
          {description || "No description available"}
        </p> */}
        {/* <p className="text-center">{released || "No release date available"}</p> */}
      </div>
    </section>
  );
};

export default GameDetail;
