import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sk-variables — See inside your Skript variables, live",
  description:
    "A real-time variable inspector for Skript. Browse, search, and edit your server's variables from a clean web dashboard. Free to install.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070809] text-zinc-200 font-sans selection:bg-emerald-400/30 selection:text-emerald-100">
        {children}
      </body>
    </html>
  );
}
