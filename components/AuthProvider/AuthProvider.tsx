"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession, getCurrentUser } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";
import Loader from "../../app/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      try {
        const session = await checkSession();
        if (!session) throw new Error("No session");

        const user = await getCurrentUser();

        const adaptedUser = {
          name: user.username,
          email: user.email,
          avatarURL: user.avatar ?? "/default-avatar.png",
        };

        setUser(adaptedUser);
      } catch {
        clearIsAuthenticated();
        if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
          router.replace("/sign-in");
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (isLoading) return <Loader />;

  return children;
}
