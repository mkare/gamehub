import Streams from "@/app/components/Streams";
import GameDetail from "@/app/components/GameDetail";
import { getGame } from "@/app/utils/firestoreService";

const unSlug = (slug: string) => {
  // capitalize the first letter of each word
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const name = unSlug(slug);

  // Metadatalarınızı buraya ekleyebilirsiniz. Örneğin başlık ve açıklamalar.
  return {
    title: `GameHub | ${name}`,
    description: `Details for ${name}`,
  };
}

async function fetchData(slug: string) {
  if (!slug) {
    return null;
  }

  const game = await getGame(slug);

  return {
    game,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const gameData = await fetchData(slug);

  if (!gameData) {
    return <div>Game not found</div>;
  }

  const { game } = gameData;

  return (
    <main className="game-detail-page">
      <GameDetail
        id={game?.id || ""}
        slug={game?.slug || ""}
        name={game?.name || slug}
        released={game?.released || "No release date available"}
        description={game?.description || "No description available"}
        background_image={game?.background_image || ""}
        platforms={game?.platforms || []}
        genres={game?.genres || []}
        rating={game?.rating || 0}
      />
      <Streams gameName={game?.name || slug} />
      {/* <section className="streams position-relative z-2">
        <TwitchStreams gameName={game?.name || slug} />
        <YouTubeVideos query={game?.name || slug} />
        <News query={game?.name || slug} />
      </section> */}
    </main>
  );
}
