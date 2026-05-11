import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Research Radar Italy",
  description: "Academic and research opportunities in Italy, searchable and easier to understand."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

