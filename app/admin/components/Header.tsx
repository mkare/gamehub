"use client";
import { useRef } from "react";
import Image from "next/image";

const dropdownMenu = [
  { name: "Create game", href: "/admin/create/game" },
  { name: "Create list", href: "/admin/create/list" },
  { name: "Games", href: "/admin/games" },
  { name: "Display site", href: "/", target: "_blank" },
];
const pageSlug = window.location.pathname;
const dropdownItems = dropdownMenu.filter(
  (item) => item.href !== `${pageSlug}`
);

const Header = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  return (
    <header className="admin-header">
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <a href="/admin">
            <Image
              src="/logos/game.svg"
              alt="GameHub Logo"
              width={37}
              height={37}
              priority
            />
          </a>
        </div>
        <div className="dropdown">
          <div
            className={`dropdown-toggle`}
            onClick={() => {
              menuRef.current?.classList.toggle("show");
              toggleRef.current?.classList.toggle("show");
            }}
            ref={toggleRef}
          >
            Admin Menu
          </div>
          <div className={`dropdown-menu end-0`} ref={menuRef}>
            {dropdownItems.map((item, index) => (
              <a
                key={index}
                className="dropdown-item"
                href={item.href}
                target={item.target}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
