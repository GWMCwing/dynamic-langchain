"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

export type ChatSessionSetting = {
  id: string;
};

export const ChatSessionSettingContext = createContext<null | {
  setting: ChatSessionSetting | null;
  setSetting: Dispatch<SetStateAction<ChatSessionSetting | null>>;
}>(null);

export function ChatSessionSettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [setting, setSetting] = useState<ChatSessionSetting | null>(null);
  return (
    <ChatSessionSettingContext.Provider value={{ setting, setSetting }}>
      {children}
    </ChatSessionSettingContext.Provider>
  );
}
