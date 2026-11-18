import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coy - Discover",
  description: "Discover connections and mutual matches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-neutral-100 antialiased">
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
