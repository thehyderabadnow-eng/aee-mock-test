// src/app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}