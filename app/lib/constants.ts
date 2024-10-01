export interface MenuLink {
  label: string;
  href: string;
}

export interface MenuItem {
  name: string;
  slug: string;
  links: MenuLink[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Canlı yayınlar",
    slug: "live",
    links: [
      { label: "Twitch", href: "/twitch" },
      { label: "Kick", href: "/kick" },
    ],
  },
  {
    name: "Haberler",
    slug: "news",
    links: [
      { label: "En son haberler", href: "/en-son-haberler" },
      { label: "Popüler haberler", href: "/populer-haberler" },
    ],
  },
  {
    name: "Kategoriler",
    slug: "categories",
    links: [
      { label: "Mobil Oyunlar", href: "/mobil-oyunlar" },
      { label: "PC Oyunları", href: "/pc-oyunlari" },
      { label: "PlayStation", href: "/playstation" },
      { label: "Xbox", href: "/xbox" },
      { label: "Nintendo", href: "/nintendo" },
      { label: "VR Oyunlar", href: "/vr-oyunlar" },
    ],
  },
];
