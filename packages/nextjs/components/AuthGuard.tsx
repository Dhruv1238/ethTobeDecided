"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "~~/context/AuthContext";

const PUBLIC_PATHS = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't redirect if we're processing tokens or on a public path
    const hasTokensInUrl = window.location.search.includes('access_token');
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath && !hasTokensInUrl) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}