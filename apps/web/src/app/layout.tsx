import "./globals.css";
import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import { Inter } from "next/font/google";
import { NavBar } from "@components/navbar/navbar";
import { NextAuthSessionProvider } from "@context/auth/NextAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamic LangChain Poc",
  description: "Proof of concept for dynamically loaded lang chain",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          minHeight: "100lvh",
        }}
      >
        <NextAuthSessionProvider>
          <NavBar />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
