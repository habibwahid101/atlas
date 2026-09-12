import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AtlasProvider } from "@/context/AtlasContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareTray } from "@/components/CompareTray";
import { CompareCapToast } from "@/components/CompareCapToast";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "ATLAS — Book Bangladesh with the full price up front",
  description: "Stays, day trips, and recreation across Bangladesh. All-in BDT pricing — no surprise fees.",
  openGraph: {
    title: "ATLAS — Book Bangladesh with the full price up front",
    description: "Stays, day trips, and recreation across Bangladesh. All-in BDT pricing — no surprise fees.",
    siteName: "ATLAS",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        <AtlasProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CompareTray />
          <CompareCapToast />
        </AtlasProvider>
      </body>
    </html>
  );
}
