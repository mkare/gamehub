import Link from "next/link";
import { MenuItem } from "../lib/constants";
import { forwardRef } from "react";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  isDropdownOpen: Record<string, boolean>;
  toggleDropdown: (menu: string) => void;
}

export default forwardRef(function DesktopMenu(
  { menuItems, isDropdownOpen, toggleDropdown }: DesktopMenuProps,
  ref: any
) {
  return (
    <nav className="items-center hidden lg:flex gap-x-6">
      {menuItems.map((item) => (
        <div key={item.slug} className="relative">
          <button
            onClick={() => toggleDropdown(item.slug)}
            className="text-lg font-light text-white hover:underline"
            ref={ref}
          >
            {item.name}
          </button>
          {isDropdownOpen[item.slug] && (
            <ul className="absolute py-3 mt-2 text-gray-800 bg-white rounded-lg shadow-2xl dark:bg-primary-solid dark:text-white w-44">
              {item.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
});
