import { ReactNode } from "react";
import { NextAuthSessionProvider } from "@context/auth/NextAuth";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function SessionLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
