"use client";

import type { ComponentProps } from "react";
import { track } from "@/lib/client-analytics";

// Reuse the existing event and payload; no new identifiers or event fields.
export function OfficialSourceLink({ href, children, ...props }: ComponentProps<"a"> & { href: string }) {
  return <a {...props} href={href} onClick={() => track("official_source_opened", { source_href: href })}>{children}</a>;
}
