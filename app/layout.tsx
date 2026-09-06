import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AtlasProvider } from "@/context/AtlasContext";
import { Header } from "@/components/Header";
import { CompareTray } from "@/components/CompareTray";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "ATLAS — Travel thoughtfully",
  description: "Bangladesh-first stays, day trips, and recreation. Quiet premium booking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        <AtlasProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <CompareTray />
        </AtlasProvider>
      </body>
    </html>
  );
}
