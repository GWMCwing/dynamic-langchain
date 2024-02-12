"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

export type User = {
  id: string;
  name: string;
};

export const UserContext = createContext<null | {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}>(null);

export async function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
