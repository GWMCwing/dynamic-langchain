"use client";
import { NewChat } from "@components/chat/newChat";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ChatSessionsPage() {
  const { status, data } = useSession({
    required: true,
  });
  const searchParams = useSearchParams();
  const isNewChat = searchParams.get("newChat") === "true";

  if (status === "loading") return null;
  //
  return isNewChat ? <NewChat user={data.user} /> : <></>;
}
