import type { Metadata } from "next";
import "./scss/main.scss";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
