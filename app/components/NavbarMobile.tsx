import Link from "next/link";
import { MenuItem } from "../lib/constants";

interface MobileMenuProps {
  menuItems: MenuItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileMenu({
  menuItems,
  isMenuOpen,
  setIsMenuOpen,
}: MobileMenuProps) {
  return (
    isMenuOpen && (
      <nav className="fixed z-50 top-20 min-h-dvh left-0 w-full bg-white dark:bg-primary-radial text-gray-800 dark:text-white py-2 lg:hidden">
        <ul className="flex flex-col items-center justify-evenly gap-y-4 p-6 pt-[10svh] h-[40svh]">
          {menuItems.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.links[0].href}
                className="block px-4 py-2 hover:underline"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className="bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50"
            >
              Giriş yap
            </Link>
          </li>
        </ul>
      </nav>
    )
  );
}
