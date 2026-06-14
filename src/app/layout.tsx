// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar"; // Navbar ని ఇంపోర్ట్ చేయండి
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
  title: "TGPSC Prep - AEE Civil Mock Tests",
  description: "Master your TGPSC AEE (Civil) preparation with real-time mock tests.",
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
      <body className="min-h-full flex flex-col">
        <Navbar /> {/* ఇక్కడ Navbar ని యాడ్ చేసాం */}
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}