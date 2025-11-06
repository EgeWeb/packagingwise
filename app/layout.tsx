import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Packaging Wise Katalog - Stok Yönetimi",
  description: "Packaging Wise ürün kataloğu ve stok yönetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
