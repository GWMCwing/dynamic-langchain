"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type PageSetting = {
  title: string;
  link: string;
};

const pages: PageSetting[] = [
  { title: "Chat", link: "/chat/sessions" },
  { title: "Doc", link: "/" },
  { title: "Github", link: "/" },
];

function pageButton(
  page: PageSetting,
  i: number,
  activePage: number | null,
  setActivePage: Dispatch<SetStateAction<number | null>>,
  router: ReturnType<typeof useRouter>,
) {
  return (
    <Button
      key={page.title}
      sx={{
        ...{
          my: 2,
          color: "black",
          display: "block",
          fontWeight: "bold",
        },
        ...(activePage === i && { color: "primary.main" }),
      }}
      onClick={() => {
        // setActivePage(i);
        router.push(page.link);
      }}
    >
      {page.title}
    </Button>
  );
}

export function NavBar() {
  const [activePage, setActivePage] = useState<number | null>(null);
  const router = useRouter();
  return (
    <AppBar sx={{ bgcolor: "white" }} position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page, i) =>
              pageButton(page, i, activePage, setActivePage, router),
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
