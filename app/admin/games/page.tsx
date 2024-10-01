import GameList from "@/app/admin/components/GameList";
import Header from "@/app/admin/components/Header";

export default function Home() {
  return (
    <main>
      <div className="container mb-5 mt-3">
        <Header />
        <GameList />
      </div>
    </main>
  );
}
