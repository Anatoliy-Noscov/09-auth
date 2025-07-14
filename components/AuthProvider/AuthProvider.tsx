"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getCurrentUser } from "../../lib/api/clientApi";
import Loader from "../../app/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const session = await checkSession();
        if (session) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
        router.push("/sign-in");
      }
    }

    verifyAuth();
  }, [router, setUser, setIsAuthenticated]);

  if (!user) return <Loader />;

  return <>{children}</>;
}
