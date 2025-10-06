import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Céleste Paris — Boutique",
  description:
    "Maison de prêt-à-porter. Élégance intemporelle, coupes modernes.",
  metadataBase: new URL("https://localhost:3000"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Céleste Paris",
    description: "Élégance intemporelle, coupes modernes.",
    url: "/",
    siteName: "Céleste Paris",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col text-brand bg-paper">
        <Header />
        <main className="flex-1 bg-[#EFECEC]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
