"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { setAccessToken } from "@/src/api/mutator/custom-instance";

function SessionSync({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.accessToken ?? null);
  }, [session?.accessToken]);

  return <>{children}</>;
}

export function NextAuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}

export default NextAuthProvider;
