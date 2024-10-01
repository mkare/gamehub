interface Game {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Harf ve rakamlar dışındaki karakterleri "-" ile değiştirir
    .replace(/^-+|-+$/g, ""); // Başta ve sonda kalan "-" işaretlerini temizler
};

const GameCard = ({ id, name, background_image, description_raw }: Game) => {
  const slug = slugify(name);

  return (
    <a
      href={`/game/${slug}`}
      key={id}
      className="bg-card text-card-foreground rounded-md overflow-hidden shadow-md"
    >
      <img
        src={background_image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-white">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-muted-foreground">{description_raw}</p>
      </div>
    </a>
  );
};

export default GameCard;
