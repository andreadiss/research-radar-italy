"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-QH0P06QW42";

export function GooglePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: query ? `${pathname}?${query}` : pathname
    });
  }, [pathname, searchParams]);

  return null;
}