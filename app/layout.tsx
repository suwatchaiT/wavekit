import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const description = "Fast wireless engineering calculators and references for GSM, LTE, 5G NR and Wi-Fi.";
  return {
    metadataBase: new URL(origin),
    title: "WaveKit — RF Engineering Tools",
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "WaveKit — RF Engineering Tools", description, images: [`${origin}/og.png`] },
    twitter: { card: "summary_large_image", title: "WaveKit — RF Engineering Tools", description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
