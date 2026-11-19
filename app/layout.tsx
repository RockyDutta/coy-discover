import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabBar from "@/components/TabBar";

export const metadata: Metadata = {
  title: "Coy Discover",
  description: "Coy Discover mobile-first app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-neutral-900 text-neutral-100 antialiased">
      <body className="flex min-h-screen justify-center bg-neutral-900 font-sans">
        <div className="flex min-h-screen w-full max-w-[480px] flex-col bg-neutral-950 shadow-2xl">
          <main className="flex flex-1 flex-col overflow-y-auto">
            {children}
          </main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
