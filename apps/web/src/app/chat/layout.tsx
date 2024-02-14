import { ReactNode } from "react";
import { NextAuthSessionProvider } from "@context/auth/NextAuth";
import { Inter } from "next/font/google";
import { SessionListProvider } from "@context/chat/sessionList";
import { Divider, Grid, SxProps } from "@mui/material";
import { ChatSideBar } from "@components/chat/sidebar";

const inter = Inter({ subsets: ["latin"] });
const LayoutSx = {
  panel: {
    height: "100%",
    maxHeight: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
} as const satisfies Record<string, SxProps>;

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
          <NextAuthSessionProvider>
            <SessionListProvider>
              <Grid
                container
                spacing={0}
                sx={{
                  height: "100%",
                  maxHeight: "100%",
                }}
              >
                <Grid item xs={3} xl={2} sx={{ ...LayoutSx.panel }}>
                  <ChatSideBar />
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid
                  item
                  xs={"auto"}
                  sx={{ ...LayoutSx.panel, width: "100%" }}
                >
                  {children}
                </Grid>
              </Grid>
            </SessionListProvider>
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}
