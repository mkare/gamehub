"use client";
import { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "../lib/constants";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks"; // Redux custom hooks
import { loginUser, logout } from "@/app/store/authSlice"; // Importing the thunk

import DesktopMenu from "./NavbarDesktop";
import MobileMenu from "./NavbarMobile";

const initialDropdownState = menuItems.reduce(
  (acc, item) => ({ ...acc, [item.slug]: false }),
  {}
);

export default function Header() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState<Record<string, boolean>>(initialDropdownState);

  const dropdownRef = useRef<HTMLElement>(null);
  useOnClickOutside(dropdownRef, () => {
    setIsDropdownOpen(initialDropdownState);
  });

  const toggleDropdown = (menu: string) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__top">
          <Link className="logo" href={"/"}>
            <Image
              src="logos/game.svg"
              alt="GameHub Logo"
              width={180}
              height={37}
              priority
            />
            <span>GameHub</span>
          </Link>

          {user && (
            <Link href="/admin" className="btn">
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
