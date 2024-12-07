"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken && !PUBLIC_PATHS.includes(pathname)) {
      router.push("/login");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
