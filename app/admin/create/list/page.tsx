import CreateList from "@/app/admin/components/CreateList";
import Header from "@/app/admin/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="container mb-5 mt-3">
        <Header />
        <CreateList />
      </div>
    </main>
  );
}
