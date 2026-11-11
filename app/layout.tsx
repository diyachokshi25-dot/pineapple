import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pineapple — rate food, read chaos",
  description:
    "A tiny restaurant-review app: write a review, read the restaurant page. Facts in the database, answers computed on demand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="honeycomb min-h-full bg-cream text-crust-dark">
        <Header />
        {children}
        <footer className="honeycomb-dark mt-12 bg-crust-dark py-8 text-center text-sm text-cream/70">
          🍍 Pineapple — store facts, compute answers.
        </footer>
      </body>
    </html>
  );
}
