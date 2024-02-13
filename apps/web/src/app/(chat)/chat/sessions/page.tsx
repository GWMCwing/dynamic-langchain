"use client";
import { ChatSideBar } from "@components/chat/sidebar";
import { Divider, Grid, SxProps } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

const PageSx = {
  panel: {
    height: "100%",
    maxHeight: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
} as const satisfies Record<string, SxProps>;

export default function ChatSessionsPage() {
  const { status, data } = useSession({
    required: true,
  });
  const [isAllChat, setIsAllChat] = useState(true);
  //
  if (status === "loading") return null;
  // if (data === null) return useRouter().push("/auth");
  //
  return (
    <Grid
      container
      spacing={0}
      sx={{
        height: "100%",
        maxHeight: "100%",
      }}
    >
      <Grid item xs={3} xl={2} sx={{ ...PageSx.panel }}>
        <ChatSideBar />
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item sx={PageSx.panel}>
        {/*  */}
      </Grid>
    </Grid>
  );
}
