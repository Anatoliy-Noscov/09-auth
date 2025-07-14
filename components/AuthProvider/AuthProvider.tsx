"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getCurrentUser } from "../../lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const session = await checkSession();
        if (session) {
          const user = await getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/sign-in");
        }
      } catch {
        setIsAuthenticated(false);
      }
    }

    verifyAuth();
  }, [router, setIsAuthenticated, setUser]);

  return <>{children}</>;
}
