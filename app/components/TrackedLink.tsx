"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps } from "react";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

type TrackedLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
  event: string;
  properties?: AnalyticsProperties;
};

export function TrackedLink({
  children,
  event,
  properties,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={() => {
        track(event, compactProperties(properties));
      }}
    >
      {children}
    </Link>
  );
}

function compactProperties(properties?: AnalyticsProperties) {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>;
}
