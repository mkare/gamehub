import Link from "next/link";
import Image from "next/image";

export default function HeaderLite({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-center w-full p-4">
      <Link className="flex items-center" href={"/"}>
        <Image
          className="h-[36px] w-auto"
          src="/game.svg"
          alt="GameHub Logo"
          width={180}
          height={37}
          priority
        />
        <span className="relative ml-2 text-lg font-semibold text-gray-800 dark:text-white top-1">
          GameHub
        </span>
      </Link>
      {children}
    </header>
  );
}
