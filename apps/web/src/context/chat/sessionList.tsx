"use client";

import { ChatSessions } from "@repo/api-types/route/chat";
import { AxiosFetch } from "@utility/axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useEffect, useState } from "react";

export type SessionInfo = {
  id: string;
  modelName: string;
  date: number;
  title: string;
  lastMessage: string;
};

async function fetchSessionList(
  userData: Session["user"],
  setSessionList: Dispatch<SetStateAction<SessionInfo[]>>,
) {
  const { data } = await AxiosFetch<ChatSessions, "GET">(
    "GET",
    "/chat/chatSessions",
    "json",
    {
      headers: {
        Authorization: `Bearer ${userData.jwtToken}`,
      },
    },
  )();
  if (data.success === false) throw new Error(data.error);
  setSessionList(data.chatSessionList);
}

export const SessionListContext = createContext<null | {
  sessionList: SessionInfo[];
  refetch: () => Promise<unknown>;
}>(null);

export function SessionListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, status } = useSession({ required: true });
  const [sessionList, setSessionList] = useState<SessionInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  //
  //

  useEffect(() => {
    if (loaded) return;
    if (status !== "authenticated") return;
    fetchSessionList(data.user, setSessionList).then(() => {
      setLoaded(true);
    });
  }, [status]);
  //
  if (status === "loading") return null;
  //
  return (
    <SessionListContext.Provider
      value={{
        sessionList,
        refetch: fetchSessionList.bind(null, data.user, setSessionList),
      }}
    >
      {children}
    </SessionListContext.Provider>
  );
}
