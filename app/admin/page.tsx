import Header from "@/app/admin/components/Header";
import StatsAndSettings from "./components/StatsAndSettings";
import Image from "next/image";

const dropdownMenu = [
  {
    name: "Create game",
    description: "Add a new game to the database",
    href: "/admin/create/game",
    icon: "/icons/add-file.svg",
  },
  {
    name: "Create list",
    description: "Create a new list of games",
    href: "/admin/create/list",
    icon: "/icons/check-lists-square.svg",
  },

  {
    name: "Games",
    description: "View, Update and Delete games",
    href: "/admin/games",
    icon: "/icons/game-consol.svg",
  },
];

export default function Home() {
  return (
    <div className="container">
      <Header />

      <div className="row justify-content-center mt-5 g-1 g-sm-4">
        {dropdownMenu.map((item) => (
          <div key={item.name} className="col-4 col-md-4 col-lg-3">
            <a href={item.href} className="admin-dashboard-card">
              <Image
                src={item.icon ? item.icon : "/icons/gamepad.svg"}
                alt={item.name}
                width={50}
                height={50}
              />
              <div className="title">{item.name}</div>
              <div className="description">
                <small>{item.description}</small>
              </div>
            </a>
          </div>
        ))}
      </div>

      <StatsAndSettings />
    </div>
  );
}
