import { ReactNode } from "react";
import { NextAuthSessionProvider } from "@context/auth/NextAuth";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ChatRootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          style={{
            height: "100lvh",
            minHeight: "100lvh",
            maxHeight: "100lvh",
          }}
        >
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}
