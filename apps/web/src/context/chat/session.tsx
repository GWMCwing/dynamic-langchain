"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

export type ChatSession = {
  id: string;
  name: string;
};

export const ChatSessionContext = createContext<null | {
  chatSession: ChatSession | null;
  setChatSession: Dispatch<SetStateAction<ChatSession | null>>;
}>(null);

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  return (
    <ChatSessionContext.Provider value={{ chatSession, setChatSession }}>
      {children}
    </ChatSessionContext.Provider>
  );
}
