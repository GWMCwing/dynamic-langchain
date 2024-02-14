"use client";
import { Session } from "next-auth";
import { ModelSelector } from "./modelSelector";
import { Suspense, useState } from "react";
import { FormControl } from "@mui/material";

export function NewChat({ user }: { user: Session["user"] }) {
  const [modelName, setModelName] = useState("");
  return (
    <div>
      <h1>New Chat</h1>
      <FormControl fullWidth>
        <ModelSelector modelName={modelName} setModelName={setModelName} />
      </FormControl>
    </div>
  );
}
