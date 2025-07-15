"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getCurrentUser } from "../../lib/api/clientApi";
import Loader from "../../app/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const session = await checkSession();

        if (!session) {
          setIsAuthenticated(false);
          router.push("/sign-in");
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();
  }, [router, setUser, setIsAuthenticated]);

  if (isLoading) return <Loader />;

  return <>{children}</>;
}
