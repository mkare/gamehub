import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import GameList from "@/app/components/GameList";
import Parallax from "@/app/components/Parallax";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Parallax />
      <GameList />
    </main>
  );
}
